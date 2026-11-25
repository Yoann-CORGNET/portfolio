"use client";

import { useRef, useState } from "react";
import { Action, Label, Segmented } from "@/components/system";
import { MASCOT_FACES, MASCOT_FACE_IDS, type MascotFaceId } from "@/lib/design/mascot-shapes";
import { MASCOT_POSES, MASCOT_POSE_IDS, type MascotPoseId } from "./mascot-model";
import { MascotStage, type MascotStageHandle } from "./mascot-stage";

/** Une bascule du système, avec son nom, pilotée par une valeur. */
function Choice<T extends string>({
  name,
  options,
  labelOf,
  value,
  onChange,
}: Readonly<{
  name: string;
  options: readonly T[];
  labelOf: (option: T) => string;
  value: T;
  onChange: (option: T) => void;
}>) {
  return (
    <fieldset>
      <legend>
        <Label>{name}</Label>
      </legend>
      <div className="mt-2">
        <Segmented
          options={options.map(labelOf)}
          active={options.indexOf(value)}
          onSelect={(i) => onChange(options[i])}
        />
      </div>
    </fieldset>
  );
}

/** Le modèle entier, avec ses poses et ses expressions à portée de main. */
export function MascotViewer() {
  const [pose, setPose] = useState<MascotPoseId>("coucou");
  const [face, setFace] = useState<MascotFaceId>(MASCOT_POSES.coucou.face);

  const stage = useRef<MascotStageHandle>(null);
  const [saving, setSaving] = useState(false);

  const choosePose = (next: MascotPoseId) => {
    setPose(next);
    setFace(MASCOT_POSES[next].face);
  };

  /* Le fichier porte la pose et le visage affichés : ce qu'on voit est ce qu'on emporte. */
  const download = async () => {
    if (!stage.current) return;
    setSaving(true);
    try {
      const blob = await stage.current.exportGlb();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prompt-${pose}-${face}.glb`;
      document.body.append(link);
      link.click();
      link.remove();
      // Révoquer l'adresse dans la foulée du clic peut couper le
      // téléchargement avant qu'il ait lu le fichier, selon le navigateur.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Le bouton est posé dans la scène, en bas à droite : il porte sur ce
          qu'on voit, pas sur les réglages en dessous. */}
      <div className="relative min-h-[30rem] flex-1">
        <MascotStage
          ref={stage}
          pose={pose}
          face={face}
          label={`Prompt en volume, pose ${MASCOT_POSES[pose].label}, visage ${MASCOT_FACES[face].label}`}
          className="absolute inset-0"
        />
        <div className="absolute bottom-4 right-4">
          <Action variant="outline" size="sm" loading={saving} onClick={download}>
            Télécharger · GLB
          </Action>
        </div>
      </div>
      <div className="space-y-5 border-t border-border p-6">
        <Choice
          name="pose"
          options={MASCOT_POSE_IDS}
          labelOf={(id) => MASCOT_POSES[id].label}
          value={pose}
          onChange={choosePose}
        />
        <Choice
          name="visage"
          options={MASCOT_FACE_IDS}
          labelOf={(id) => MASCOT_FACES[id].label}
          value={face}
          onChange={setFace}
        />
        <Label className="block opacity-60">glisser pour tourner autour</Label>
      </div>
    </div>
  );
}
