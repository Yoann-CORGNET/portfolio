"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type * as Three from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Label } from "@/components/system";
import { cn } from "@/lib/utils";
import { MASCOT_SPIN, type MascotFaceId } from "@/lib/design/mascot-shapes";
import { FLAT_RGB, MOTION } from "@/lib/design/tokens";
import {
  MASCOT_POSES,
  buildMascot,
  type Joints,
  type MascotPoseId,
  type MascotRig,
} from "./mascot-model";

/**
 * Une scène three.js pour Prompt en volume.
 *
 * three.js n'est chargé qu'ici, et la scène ne dessine que lorsqu'il se passe
 * quelque chose : un glissement de souris, un changement de pose, un cran du
 * chargement. Au repos, elle ne coûte rien. Pas de rotation automatique : le
 * mouvement fait arriver, puis s'arrête.
 */

type ThreeModule = typeof Three;
type Vec3 = readonly [number, number, number];
type Framing = "full" | "head";

const STATE_MS = MOTION.find((m) => m.name === "state")?.ms ?? 500;
const SPIN_STEP_MS = MASCOT_SPIN.ms / MASCOT_SPIN.steps;

/**
 * Un éclairage de studio neutre : un ciel doux, une lumière principale qui
 * porte l'ombre, un contre-jour faible pour que la silhouette ne tombe jamais
 * dans le noir. Le sol, invisible, ne garde que l'ombre.
 *
 * L'ombre est calibrée sur le robot. three.js applique `bias` en profondeur
 * normalisée : sur la plage par défaut (0,5 à 500 m), -0,0002 valait une
 * dizaine de centimètres, assez pour effacer l'ombre de la tête sur le corps
 * et décrocher celle du bras. La lumière est donc placée à `reach` rayons du
 * robot, dans sa direction, et sa boîte d'ombre serrée sur le modèle, avec
 * une marge (`span`) pour les bras levés.
 */
const LIGHTING = {
  sky: 1,
  key: {
    direction: [4, 7, 5] as Vec3,
    intensity: 2.2,
    mapSize: 2048,
    bias: -0.0002,
    normalBias: 0.001,
    reach: 6,
    span: 1.5,
    depth: 2,
  },
  fill: { position: [-5, 3, -4] as Vec3, intensity: 0.5 },
  floorShadow: 0.18,
} as const;

/** D'où la caméra regarde, et à combien de fois le rayon du modèle. */
const FRAMING: Record<Framing, { direction: Vec3; distance: number }> = {
  full: { direction: [1, 0.55, 1.25], distance: 1.35 },
  head: { direction: [0.38, 0.12, 0.92], distance: 1.25 },
};

/** Marge avant l'écran à laquelle une scène différée commence à se monter. */
const DEFER_MARGIN = "200px";

const JOINT_KEYS = ["yaw", "tilt", "pitch", "armL", "armR", "fwdL", "fwdR", "antenna"] as const;

function jointsOf(pose: MascotPoseId): Joints {
  const p = MASCOT_POSES[pose];
  return Object.fromEntries(JOINT_KEYS.map((key) => [key, p[key]])) as Joints;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/* ------------------------------------------------------------------ */
/* Construction de la scène                                           */
/* ------------------------------------------------------------------ */

function createRenderer(THREE: ThreeModule, host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className =
    "absolute inset-0 block h-full w-full cursor-grab active:cursor-grabbing";
  host.appendChild(renderer.domElement);
  return renderer;
}

/** Les trois lumières ; renvoie la principale, la seule qui porte une ombre. */
function addLights(THREE: ThreeModule, world: Three.Scene) {
  const [r, g, b] = FLAT_RGB.sand;
  const ground = new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  world.add(new THREE.HemisphereLight(0xffffff, ground, LIGHTING.sky));

  const key = new THREE.DirectionalLight(0xffffff, LIGHTING.key.intensity);
  key.castShadow = true;
  key.shadow.mapSize.set(LIGHTING.key.mapSize, LIGHTING.key.mapSize);
  key.shadow.bias = LIGHTING.key.bias;
  key.shadow.normalBias = LIGHTING.key.normalBias;
  world.add(key, key.target);

  const fill = new THREE.DirectionalLight(0xffffff, LIGHTING.fill.intensity);
  fill.position.set(...LIGHTING.fill.position);
  world.add(fill);
  return key;
}

function addFloor(THREE: ThreeModule, world: Three.Scene) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ opacity: LIGHTING.floorShadow }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  world.add(floor);
  return floor;
}

/**
 * Cadre la caméra et la boîte d'ombre sur le modèle au repos, une fois pour
 * toutes : recadrer à chaque pose ferait sauter la caméra quand un bras se lève.
 */
function frameModel(
  THREE: ThreeModule,
  {
    root,
    framing,
    camera,
    controls,
    key,
    floor,
  }: {
    root: Three.Object3D;
    framing: Framing;
    camera: Three.PerspectiveCamera;
    controls: OrbitControls;
    key: Three.DirectionalLight;
    floor: Three.Mesh;
  },
) {
  const box = new THREE.Box3().setFromObject(root);
  floor.position.y = box.min.y;
  const { center, radius } = box.getBoundingSphere(new THREE.Sphere());

  const { direction, distance } = FRAMING[framing];
  const dist = (radius / Math.tan((camera.fov * Math.PI) / 360)) * distance;
  camera.position
    .copy(center)
    .add(new THREE.Vector3(...direction).normalize().multiplyScalar(dist));
  camera.near = Math.max(dist / 100, 0.01);
  camera.far = dist * 100;
  controls.target.copy(center);
  controls.update();

  const { reach, span, depth } = LIGHTING.key;
  key.target.position.copy(center);
  key.position
    .copy(center)
    .add(new THREE.Vector3(...LIGHTING.key.direction).normalize().multiplyScalar(radius * reach));
  Object.assign(key.shadow.camera, {
    left: -radius * span,
    right: radius * span,
    top: radius * span,
    bottom: -radius * span,
    near: radius * (reach - depth),
    far: radius * (reach + depth),
  });
  key.shadow.camera.updateProjectionMatrix();
}

/** Garde le rendu à la taille de son hôte ; renvoie de quoi arrêter. */
function followSize(
  host: HTMLElement,
  renderer: Three.WebGLRenderer,
  camera: Three.PerspectiveCamera,
  render: () => void,
) {
  const fit = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  };
  const observer = new ResizeObserver(fit);
  observer.observe(host);
  fit();
  return () => observer.disconnect();
}

type Scene = {
  THREE: ThreeModule;
  render: () => void;
  rig: MascotRig;
  joints: Joints;
  /** Faux tant que la première pose n'est pas posée : elle arrive sans transition. */
  posed: boolean;
  dispose: () => void;
};

async function mountScene(host: HTMLElement, framing: Framing): Promise<Scene> {
  const [THREE, { OrbitControls: Controls }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/controls/OrbitControls.js"),
  ]);

  const renderer = createRenderer(THREE, host);
  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500);
  const key = addLights(THREE, world);
  const floor = addFloor(THREE, world);
  const rig = buildMascot(THREE, { headOnly: framing === "head" });
  world.add(rig.root);

  const render = () => renderer.render(world, camera);

  const controls = new Controls(camera, renderer.domElement);
  // Ni zoom ni panoramique : la molette doit continuer à faire défiler la page.
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.addEventListener("change", render);

  frameModel(THREE, { root: rig.root, framing, camera, controls, key, floor });
  const stopFollowing = followSize(host, renderer, camera, render);

  return {
    THREE,
    render,
    rig,
    joints: jointsOf("repos"),
    posed: false,
    dispose: () => {
      stopFollowing();
      controls.dispose();
      rig.dispose();
      floor.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Composant                                                          */
/* ------------------------------------------------------------------ */

/** Ce que la scène expose à qui la tient : le modèle tel qu'il est affiché. */
export type MascotStageHandle = {
  /**
   * Le modèle en glTF binaire (GLB) : un seul fichier qui garde les
   * couleurs, les noms des pièces et la hiérarchie des articulations. En
   * mètres, pieds au sol. Rejette tant que la scène n'est pas prête.
   */
  exportGlb: () => Promise<Blob>;
};

export function MascotStage({
  framing = "full",
  pose = "repos",
  face,
  deferred = false,
  label,
  className,
  ref,
}: Readonly<{
  framing?: Framing;
  pose?: MascotPoseId;
  /** Remplace le visage de la pose. */
  face?: MascotFaceId;
  /**
   * Ne monte la scène qu'à l'approche de l'écran. Pour les scènes plus bas
   * dans la page : celle du haut s'affiche plus vite, et une scène jamais
   * atteinte ne coûte rien.
   */
  deferred?: boolean;
  label: string;
  className?: string;
  ref?: React.Ref<MascotStageHandle>;
}>) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<Scene | null>(null);
  const [near, setNear] = useState(!deferred);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // L'exporteur n'est chargé qu'au premier téléchargement, pas avec la scène.
  useImperativeHandle(ref, () => ({
    exportGlb: async () => {
      const s = scene.current;
      if (!s) throw new Error("La scène 3D n'est pas prête.");
      const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
      const glb = await new GLTFExporter().parseAsync(s.rig.root, { binary: true });
      return new Blob([glb as ArrayBuffer], { type: "model/gltf-binary" });
    },
  }));

  /* Scène différée : on attend qu'elle approche de l'écran. */
  useEffect(() => {
    const el = host.current;
    if (near || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: DEFER_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  /* Montage : charge three.js, construit la scène, cadre le modèle. */
  useEffect(() => {
    const el = host.current;
    if (!near || !el) return;
    let cancelled = false;

    mountScene(el, framing)
      .then((mounted) => {
        if (cancelled) {
          mounted.dispose();
          return;
        }
        scene.current = mounted;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
      setReady(false);
    };
  }, [framing, near]);

  /* Pose et visage : on interpole les articulations sur la durée « state ». */
  useEffect(() => {
    const s = scene.current;
    if (!ready || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instant = reduce || !s.posed;
    s.posed = true;

    s.rig.setFace(face ?? MASCOT_POSES[pose].face);
    s.rig.root.traverse((node) => {
      if (node instanceof s.THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    const from = s.joints;
    const to = jointsOf(pose);
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = instant ? 1 : Math.min((now - start) / STATE_MS, 1);
      const k = ease(t);
      const current = Object.fromEntries(
        JOINT_KEYS.map((key) => [key, from[key] + (to[key] - from[key]) * k]),
      ) as Joints;
      s.rig.setJoints(current);
      s.joints = current;
      s.render();
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    // Le chargement tourne par crans, au rythme de sa version à plat.
    let timer: number | undefined;
    const spinner = s.rig.spinner();
    if (spinner && !reduce) {
      timer = window.setInterval(() => {
        spinner.rotation.z -= (2 * Math.PI) / MASCOT_SPIN.steps;
        s.render();
      }, SPIN_STEP_MS);
    }

    return () => {
      cancelAnimationFrame(frame);
      if (timer) window.clearInterval(timer);
    };
  }, [ready, pose, face]);

  return (
    <div ref={host} role="img" aria-label={label} className={cn("relative", className)}>
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <Label>la scène 3D n&apos;a pas pu se charger</Label>
        </div>
      )}
    </div>
  );
}
