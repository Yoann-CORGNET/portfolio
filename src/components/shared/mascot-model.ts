import type * as Three from "three";
import {
  HEAD as HEAD_MM,
  MASCOT_FACES,
  SCREEN,
  SHAPE_TONES,
  type MascotFaceId,
} from "@/lib/design/mascot-shapes";
import { FLAT_RGB, type FlatToken } from "@/lib/design/tokens";

/**
 * Prompt en volume : un petit serveur pétrole, une tête crème, un écran encre.
 *
 * Tout est fait de boîtes, comme le reste du système est fait d'aplats : pas
 * de biseau, pas de courbe. Les cotes sont en mètres, origine au sol. Le
 * visage n'est pas modélisé ici : il est lu dans `mascot-shapes.ts`, le même
 * tracé que l'illustration et l'emoji, extrudé de six millimètres.
 */

type ThreeModule = typeof Three;

/** Les cotes retenues : une tête une fois et demie plus large que le corps. */
const BODY = { w: 0.22, h: 0.16, d: 0.16 } as const;
/** Les cotes de la tête, partagées avec le symbole à plat, passées en mètres. */
const mm = (v: number) => v / 1000;
const HEAD = { w: mm(HEAD_MM.w), h: mm(HEAD_MM.h), d: mm(HEAD_MM.d) } as const;
const LEG_H = 0.045;
const ARM_L = 0.11;
const FOOT_H = 0.03;
/** Hauteur visible du cou, entre le corps et la tête. */
const NECK_GAP = 0.014;
/** Ce que le cou cache dans la tête, pour rester accroché quand elle penche. */
const NECK_SUNK = 0.024;

export type MascotPose = {
  label: string;
  /** Tête : lacet, roulis, tangage. */
  yaw: number;
  tilt: number;
  pitch: number;
  /** Bras : écart latéral et avancée, gauche puis droit. */
  armL: number;
  armR: number;
  fwdL: number;
  fwdR: number;
  antenna: number;
  face: MascotFaceId;
};

export const MASCOT_POSES = {
  repos: {
    label: "repos",
    yaw: 0,
    tilt: 0,
    pitch: 0,
    armL: 0.14,
    armR: 0.14,
    fwdL: 0,
    fwdR: 0,
    antenna: 0,
    face: "heureux",
  },
  coucou: {
    label: "coucou",
    yaw: 0.25,
    tilt: -0.14,
    pitch: 0,
    armL: 0.14,
    armR: 2.1,
    fwdL: 0,
    fwdR: -0.3,
    antenna: 0.3,
    face: "heureux",
  },
  reflechit: {
    label: "réfléchit",
    yaw: -0.2,
    tilt: 0.16,
    pitch: -0.1,
    armL: 0.1,
    armR: 0.5,
    fwdL: 0,
    fwdR: -1.6,
    antenna: -0.25,
    face: "perplexe",
  },
  victoire: {
    label: "victoire",
    yaw: 0,
    tilt: 0,
    pitch: -0.12,
    armL: 2.2,
    armR: 2.2,
    fwdL: -0.25,
    fwdR: -0.25,
    antenna: 0.15,
    face: "heureux",
  },
  surpris: {
    label: "surpris",
    yaw: 0,
    tilt: 0,
    pitch: -0.08,
    armL: 0.7,
    armR: 0.7,
    fwdL: -0.4,
    fwdR: -0.4,
    antenna: 0.5,
    face: "surpris",
  },
  erreur: {
    label: "erreur",
    yaw: 0.1,
    tilt: 0.1,
    pitch: 0.28,
    armL: 0.03,
    armR: 0.03,
    fwdL: 0,
    fwdR: 0,
    antenna: -0.7,
    face: "erreur",
  },
} as const satisfies Record<string, MascotPose>;

export type MascotPoseId = keyof typeof MASCOT_POSES;

export const MASCOT_POSE_IDS = Object.keys(MASCOT_POSES) as MascotPoseId[];

/** Les articulations qu'une pose fait bouger, sans le visage. */
export type Joints = Omit<MascotPose, "label" | "face">;

export type MascotRig = {
  root: Three.Group;
  setFace: (face: MascotFaceId) => void;
  setJoints: (joints: Joints) => void;
  /** Le groupe qui tourne quand le visage est « chargement », sinon null. */
  spinner: () => Three.Group | null;
  dispose: () => void;
};

export function buildMascot(THREE: ThreeModule, { headOnly = false } = {}): MascotRig {
  const materials = new Map<FlatToken, Three.MeshStandardMaterial>();
  const geometries: Three.BufferGeometry[] = [];

  const material = (token: FlatToken) => {
    let m = materials.get(token);
    if (!m) {
      const [r, g, b] = FLAT_RGB[token];
      const glossy = token === "ink" || token === "vermillon";
      m = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace),
        roughness: glossy ? 0.6 : 0.85,
        metalness: 0,
      });
      m.name = token;
      materials.set(token, m);
    }
    return m;
  };

  const group = (name: string, parent: Three.Object3D, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };

  const box = (
    name: string,
    token: FlatToken,
    [w, h, d]: [number, number, number],
    [x, y, z]: [number, number, number],
    parent: Three.Object3D,
  ) => {
    const geometry = new THREE.BoxGeometry(w, h, d);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material(token));
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const root = new THREE.Group();
  root.name = "prompt";
  const y0 = FOOT_H + LEG_H;

  /* Jambes et pieds */
  for (const s of [-1, 1]) {
    const side = s < 0 ? "L" : "R";
    const x = s * BODY.w * 0.28;
    box(`foot_${side}`, "ink", [0.075, FOOT_H, 0.11], [x, FOOT_H / 2, 0.012], root);
    box(`leg_${side}`, "charcoal", [0.04, LEG_H, 0.04], [x, FOOT_H + LEG_H / 2, 0], root);
  }

  /* Corps : le serveur */
  const torso = group("torso", root, 0, y0, 0);
  box("body", "petrol", [BODY.w, BODY.h, BODY.d], [0, BODY.h / 2, 0], torso);
  box("plinth", "charcoal", [BODY.w + 0.002, 0.02, BODY.d + 0.002], [0, 0.01, 0], torso);
  const ventTop = BODY.h - 0.045;
  for (let i = 0; i < 3; i++) {
    box(
      `vent_${i}`,
      "sand",
      [BODY.w * 0.58, 0.008, 0.004],
      [-BODY.w * 0.09, ventTop - i * 0.02, BODY.d / 2 + 0.002],
      torso,
    );
  }
  for (let i = 0; i < 2; i++) {
    box(
      `led_${i}`,
      "cream",
      [0.014, 0.014, 0.004],
      [BODY.w * 0.3, ventTop - i * 0.04, BODY.d / 2 + 0.002],
      torso,
    );
  }

  /* Bras */
  const arms: Record<"L" | "R", Three.Group> = {} as Record<"L" | "R", Three.Group>;
  for (const s of [-1, 1]) {
    const side = s < 0 ? "L" : "R";
    const shoulder = group(`shoulder_${side}`, torso, s * (BODY.w / 2 + 0.018), BODY.h - 0.025, 0);
    box(
      `upperarm_${side}`,
      "charcoal",
      [0.034, ARM_L, 0.042],
      [0, -ARM_L / 2 + 0.012, 0],
      shoulder,
    );
    box(`hand_${side}`, "cream", [0.042, 0.04, 0.05], [0, -ARM_L - 0.006, 0], shoulder);
    arms[side] = shoulder;
  }

  /* Cou et tête. Le cou dépasse de 1,4 cm sous la tête et s'y enfonce de
     NECK_SUNK : la tête pivote à sa base, et en penchant (jusqu'à 0,28 rad
     de tangage plus 0,1 de roulis) son dessous remonte d'environ 1,6 cm au
     bord du cou. Sans cette réserve, le cou décollerait de la tête. */
  const neck = group("neck", torso, 0, BODY.h, 0);
  const neckH = NECK_GAP + NECK_SUNK;
  box("neck_block", "charcoal", [0.08, neckH, 0.08], [0, neckH / 2, 0], neck);
  const head = group("head", neck, 0, NECK_GAP, 0);
  box("head_shell", "cream", [HEAD.w, HEAD.h, HEAD.d], [0, HEAD.h / 2, 0], head);
  box(
    "head_rule",
    "sand",
    [HEAD.w + 0.002, mm(HEAD_MM.rule), HEAD.d + 0.002],
    [0, mm(HEAD_MM.rule) / 2, 0],
    head,
  );

  const screenW = mm(HEAD_MM.screen.w);
  const screenH = mm(HEAD_MM.screen.h);
  const screenY = mm(HEAD_MM.screen.y);
  const screenD = mm(HEAD_MM.screen.depth);
  const screen = box("screen", "ink", [screenW, screenH, screenD], [0, screenY, HEAD.d / 2], head);

  /* Oreilles : des poignées de rack */
  const ear = {
    reach: mm(HEAD_MM.ear.reach),
    bar: mm(HEAD_MM.ear.bar),
    thick: mm(HEAD_MM.ear.thickness),
    spread: mm(HEAD_MM.ear.spread),
  };
  for (const s of [-1, 1]) {
    const side = s < 0 ? "L" : "R";
    const ex = (s * HEAD.w) / 2;
    const mid = HEAD.h / 2;
    for (const v of [1, -1]) {
      box(
        `ear_${side}_${v > 0 ? "top" : "bottom"}`,
        "charcoal",
        [ear.reach, ear.thick, ear.thick],
        [ex + (s * ear.reach) / 2, mid + v * ear.spread, 0],
        head,
      );
    }
    box(
      `ear_${side}_bar`,
      "charcoal",
      [ear.bar, ear.spread * 2 + ear.thick, ear.thick],
      [ex + s * (ear.reach + ear.bar / 2), mid, 0],
      head,
    );
  }

  /* Antenne. Sa base est un cube centré sur le pivot, à moitié enfoncé dans
     la tête : tant que l'antenne penche de moins de 45° (les poses vont
     jusqu'à 0,7 rad), aucun coin du dessous ne remonte au-dessus de la
     surface, et la base ne décolle jamais. */
  const a = HEAD_MM.antenna;
  const antenna = group("antenna", head, mm(a.x), HEAD.h, mm(a.z));
  const base = mm(a.base);
  const mastH = mm(a.mastH);
  const tip = mm(a.tip);
  box("antenna_base", "charcoal", [base, base, base], [0, 0, 0], antenna);
  box(
    "antenna_mast",
    "charcoal",
    [mm(a.mast), mastH, mm(a.mast)],
    [0, base / 2 + mastH / 2, 0],
    antenna,
  );
  box("antenna_tip", "petrol", [tip, tip, tip], [0, base / 2 + mastH + tip / 2, 0], antenna);

  /* Visage : le tracé 2D, extrudé */
  const faceAnchor = group("face", head, 0, screenY, HEAD.d / 2 + 0.007);
  const k = screenW / SCREEN.w;
  let spinner: Three.Group | null = null;
  let current: MascotFaceId | null = null;

  const clearFace = () => {
    for (const child of [...faceAnchor.children]) {
      faceAnchor.remove(child);
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) node.geometry.dispose();
      });
    }
  };

  const setFace = (face: MascotFaceId) => {
    if (face === current) return;
    clearFace();
    const spec = MASCOT_FACES[face];
    spinner = "spin" in spec ? group("spinner", faceAnchor) : null;
    const parent = spinner ?? faceAnchor;
    screen.material = material(spec.screen);
    spec.shapes.forEach((shape, i) => {
      const token = SHAPE_TONES[shape.tone];
      if (shape.kind === "bar") {
        const geometry = new THREE.BoxGeometry(shape.w * k, shape.h * k, 0.006);
        const mesh = new THREE.Mesh(geometry, material(token));
        mesh.name = `stroke_${i}`;
        mesh.position.set(shape.x * k, shape.y * k, 0);
        mesh.rotation.z = shape.rot;
        parent.add(mesh);
        return;
      }
      const outline = new THREE.Shape(
        shape.points.map(([x, y]) => new THREE.Vector2(x * k, y * k)),
      );
      const geometry = new THREE.ExtrudeGeometry(outline, { depth: 0.006, bevelEnabled: false });
      geometry.translate(0, 0, -0.003);
      const mesh = new THREE.Mesh(geometry, material(token));
      mesh.name = `stroke_${i}`;
      parent.add(mesh);
    });
    current = face;
  };

  const setJoints = (j: Joints) => {
    head.rotation.set(j.pitch, j.yaw, j.tilt);
    arms.L.rotation.set(j.fwdL, 0, -j.armL);
    arms.R.rotation.set(j.fwdR, 0, j.armR);
    antenna.rotation.z = j.antenna;
  };

  setFace("heureux");
  setJoints(MASCOT_POSES.repos);

  let model = root;
  if (headOnly) {
    // La tête seule, posée au sol : c'est la même pièce, détachée du cou.
    neck.remove(head);
    head.position.set(0, 0, 0);
    model = new THREE.Group();
    model.name = "prompt_tete";
    model.add(head);
  }

  return {
    root: model,
    setFace,
    setJoints,
    spinner: () => spinner,
    dispose: () => {
      clearFace();
      for (const g of geometries) g.dispose();
      for (const m of materials.values()) m.dispose();
    },
  };
}
