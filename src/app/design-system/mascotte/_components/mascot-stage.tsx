"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type * as Three from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Label } from "@/components/system";
import { cn } from "@/lib/utils";
import type { MascotFaceId } from "@/lib/design/mascot-shapes";
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
 * three.js n'est chargé qu'ici, à l'arrivée sur la page, et la scène ne
 * dessine que lorsqu'il se passe quelque chose : un glissement de souris, un
 * changement de pose, un cran du chargement. Au repos, elle ne coûte rien.
 * Pas de rotation automatique : le mouvement fait arriver, puis s'arrête.
 */

const STATE_MS = MOTION.find((m) => m.name === "state")?.ms ?? 500;
const SPIN_STEP_MS = 110;

/** D'où vient la lumière principale : au-dessus, à droite, devant. */
const KEY_DIRECTION = { x: 4, y: 7, z: 5 } as const;

type Scene = {
  THREE: typeof Three;
  renderer: Three.WebGLRenderer;
  render: () => void;
  rig: MascotRig;
  joints: Joints;
  /** Faux tant que la première pose n'est pas posée : elle arrive sans transition. */
  posed: boolean;
  dispose: () => void;
};

const JOINT_KEYS = ["yaw", "tilt", "pitch", "armL", "armR", "fwdL", "fwdR", "antenna"] as const;

function jointsOf(pose: MascotPoseId): Joints {
  const p = MASCOT_POSES[pose];
  return Object.fromEntries(JOINT_KEYS.map((key) => [key, p[key]])) as Joints;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

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
  label,
  className,
  ref,
}: Readonly<{
  framing?: "full" | "head";
  pose?: MascotPoseId;
  /** Remplace le visage de la pose. */
  face?: MascotFaceId;
  label: string;
  className?: string;
  ref?: React.Ref<MascotStageHandle>;
}>) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<Scene | null>(null);
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

  /* Montage : charge three.js, construit la scène, cadre le modèle. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;

    (async () => {
      const [THREE, { OrbitControls: Controls }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);
      if (cancelled) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.className =
        "absolute inset-0 block h-full w-full cursor-grab active:cursor-grabbing";
      el.appendChild(renderer.domElement);

      const world = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500);

      // Un éclairage de studio neutre : un ciel doux, une lumière principale
      // qui porte l'ombre, un contre-jour faible pour que la silhouette ne
      // tombe jamais dans le noir. Le sol reprend le sable du système.
      const [sr, sg, sb] = FLAT_RGB.sand;
      const ground = new THREE.Color().setRGB(sr / 255, sg / 255, sb / 255, THREE.SRGBColorSpace);
      world.add(new THREE.HemisphereLight(0xffffff, ground, 1));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      world.add(key);
      world.add(key.target);
      const fill = new THREE.DirectionalLight(0xffffff, 0.5);
      fill.position.set(-5, 3, -4);
      world.add(fill);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.ShadowMaterial({ opacity: 0.18 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      world.add(floor);

      const rig = buildMascot(THREE, { headOnly: framing === "head" });
      world.add(rig.root);

      const render = () => renderer.render(world, camera);

      const controls: OrbitControls = new Controls(camera, renderer.domElement);
      // Ni zoom ni panoramique : la molette doit continuer à faire défiler la page.
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.addEventListener("change", render);

      // Cadrage sur la pose de repos, une fois pour toutes : recadrer à chaque
      // pose ferait sauter la caméra quand un bras se lève.
      const box = new THREE.Box3().setFromObject(rig.root);
      floor.position.y = box.min.y;
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const dist =
        (sphere.radius / Math.tan((camera.fov * Math.PI) / 360)) *
        (framing === "head" ? 1.25 : 1.35);
      const dir =
        framing === "head" ? new THREE.Vector3(0.38, 0.12, 0.92) : new THREE.Vector3(1, 0.55, 1.25);
      camera.position.copy(sphere.center).add(dir.normalize().multiplyScalar(dist));
      camera.near = Math.max(dist / 100, 0.01);
      camera.far = dist * 100;
      controls.target.copy(sphere.center);
      controls.update();
      // L'ombre est calibrée sur le robot. three.js applique `bias` en
      // profondeur normalisée : sur la plage par défaut (0,5 à 500 m), -0,0002
      // valait une dizaine de centimètres, assez pour effacer l'ombre de la
      // tête sur le corps et décrocher celle du bras. La lumière est donc
      // rapprochée, dans la même direction, et sa boîte d'ombre serrée sur le
      // modèle, avec une marge pour les bras levés.
      const r = sphere.radius;
      const reach = r * 6;
      key.target.position.copy(sphere.center);
      key.position
        .copy(sphere.center)
        .add(
          new THREE.Vector3(KEY_DIRECTION.x, KEY_DIRECTION.y, KEY_DIRECTION.z)
            .normalize()
            .multiplyScalar(reach),
        );
      key.shadow.bias = -0.0002;
      key.shadow.normalBias = 0.001;
      Object.assign(key.shadow.camera, {
        left: -r * 1.5,
        right: r * 1.5,
        top: r * 1.5,
        bottom: -r * 1.5,
        near: reach - r * 2,
        far: reach + r * 2,
      });
      key.shadow.camera.updateProjectionMatrix();

      const fit = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render();
      };
      const observer = new ResizeObserver(fit);
      observer.observe(el);
      fit();

      scene.current = {
        THREE,
        renderer,
        render,
        rig,
        joints: jointsOf("repos"),
        posed: false,
        dispose: () => {
          observer.disconnect();
          controls.dispose();
          rig.dispose();
          floor.geometry.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        },
      };
      setReady(true);
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, [framing]);

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

    // Le chargement tourne par crans, comme dans sa version à plat.
    let timer: number | undefined;
    const spinner = s.rig.spinner();
    if (spinner && !reduce) {
      timer = window.setInterval(() => {
        spinner.rotation.z -= Math.PI / 4;
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
