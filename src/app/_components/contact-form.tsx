"use client";

import { useActionState, useId, useState } from "react";
import { Action, Label } from "@/components/system";
import { sendMessage } from "@/lib/contact-action";
import {
  CONTACT_IDLE,
  validateField,
  type ContactField,
  type ContactState,
} from "@/lib/contact-state";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Les peaux                                                          */
/* ------------------------------------------------------------------ */

export type FormSkin = "ink" | "paper" | "cream";
export type FormShape = "boxed" | "prompt";

// Contrast ratios against each background:
//   --f-text  full cream on ink -> 15.8; full ink on paper -> 17.0.
//   --f-dim   placeholder text needs 4.5. Cream @55% -> 5.4, ink @60% on
//             paper -> 4.8 (the system's decorative 20% cream / inkLine
//             sits at 1.7, fine for a hairline but not for text).
//   --f-line  a field border is a UI element: 3:1 (WCAG 1.4.11), not 4.5.
//             Cream @40% -> 3.4, ink @50% on paper -> 3.5.
//   --f-error vermillon fails both backgrounds for small text (4.3 on ink,
//             3.9 on paper); amber replaces it on ink (9.9), rust on paper (5.9).
const PAPER = {
  "--f-text": "var(--foreground)",
  "--f-dim": `color-mix(in srgb, ${FLAT.ink} 60%, transparent)`,
  "--f-line": `color-mix(in srgb, ${FLAT.ink} 50%, transparent)`,
  "--f-focus": FLAT.vermillon,
  "--f-error": FLAT.rust,
  "--f-ok": FLAT.ink,
  "--f-field": "transparent",
} as React.CSSProperties;

const SKIN: Record<FormSkin, React.CSSProperties> = {
  ink: {
    "--f-text": FLAT.cream,
    "--f-dim": `color-mix(in srgb, ${FLAT.cream} 55%, transparent)`,
    "--f-line": `color-mix(in srgb, ${FLAT.cream} 40%, transparent)`,
    "--f-focus": FLAT.vermillon,
    "--f-error": FLAT.amber,
    "--f-ok": FLAT.cream,
    "--f-field": "transparent",
  } as React.CSSProperties,
  paper: PAPER,
  // Same ratios as paper hold on cream (only 0.025 lightness away): full
  // ink 15.8, placeholder @60% 4.7, hairline @50% 3.4, rust 5.4.
  cream: { ...PAPER, "--f-field": FLAT.cream } as React.CSSProperties,
};

/* ------------------------------------------------------------------ */
/* Le champ                                                           */
/* ------------------------------------------------------------------ */

const SHAPE: Record<FormShape, string> = {
  boxed: "border px-3 py-2.5",
  prompt: "border-0 border-b px-0 py-2",
};

type FieldProps = Readonly<{
  name: ContactField;
  label: string;
  shape: FormShape;
  type?: "text" | "email";
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  error?: string;
  onLeave: (field: ContactField, value: string) => void;
  onRevise: (field: ContactField, value: string) => void;
  className?: string;
}>;

function Field({
  name,
  label,
  shape,
  type = "text",
  placeholder,
  multiline = false,
  rows = 5,
  error,
  onLeave,
  onRevise,
  className,
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const control = cn(
    "w-full bg-[var(--f-field)] text-base tracking-tight text-[var(--f-text)]",
    "placeholder:text-[var(--f-dim)]",
    SHAPE[shape],
    "border-[var(--f-line)] transition-colors duration-200",
    "outline-none focus:border-[var(--f-focus)]",
    error && "border-[var(--f-error)]",
    multiline && "resize-y leading-relaxed",
  );

  const shared = {
    id,
    name,
    placeholder,
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onLeave(name, event.target.value),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onRevise(name, event.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: control,
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id}>
        <Label tone="inherit" style={{ color: "var(--f-dim)" }}>
          {label}
        </Label>
      </label>
      {multiline ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} autoComplete={name === "email" ? "email" : "name"} />
      )}
      <span
        id={errorId}
        className="min-h-[1rem] text-xs"
        style={{ color: "var(--f-error)", opacity: error ? 1 : 0 }}
      >
        {error ?? ""}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Le pot de miel                                                     */
/* ------------------------------------------------------------------ */

// Positioned off-screen rather than `display:none` — some bots skip
// unrendered fields, which would defeat the trap.
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
      <input name="company" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Le formulaire                                                      */
/* ------------------------------------------------------------------ */

function Status({ state }: Readonly<{ state: ContactState }>) {
  return (
    <p
      aria-live="polite"
      className="min-h-[1.25rem] text-sm"
      style={{
        color: state.status === "error" ? "var(--f-error)" : "var(--f-ok)",
        opacity: state.status === "idle" ? 0 : 1,
      }}
    >
      {state.message || "·"}
    </p>
  );
}

export function ContactForm({
  skin = "ink",
  shape = "boxed",
  aside,
  className,
}: Readonly<{
  skin?: FormSkin;
  shape?: FormShape;
  aside?: React.ReactNode;
  className?: string;
}>) {
  const [state, formAction, pending] = useActionState(sendMessage, CONTACT_IDLE);

  // A key is only present once the field has been left once — this
  // distinguishes "not yet checked" (key absent) from "checked, no error"
  // (key present, value "").
  const [local, setLocal] = useState<Partial<Record<ContactField, string>>>({});

  const check = (field: ContactField, value: string) =>
    setLocal((previous) => ({ ...previous, [field]: validateField(field, value.trim()) ?? "" }));

  const revise = (field: ContactField, value: string) => {
    if (local[field] !== undefined) check(field, value);
  };

  // Client-side verdict wins over the server's once it exists, even when
  // empty — clears a server error as soon as the field is fixed locally.
  const errorFor = (field: ContactField) =>
    local[field] !== undefined ? local[field] || undefined : state.errors[field];

  return (
    <form
      action={formAction}
      style={SKIN[skin]}
      className={cn("relative flex flex-col gap-6", className)}
      noValidate
    >
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          name="name"
          label="Nom"
          shape={shape}
          placeholder="Ada Lovelace"
          error={errorFor("name")}
          onLeave={check}
          onRevise={revise}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          shape={shape}
          placeholder="ada@exemple.fr"
          error={errorFor("email")}
          onLeave={check}
          onRevise={revise}
        />
      </div>
      <Field
        name="message"
        label="Le projet"
        shape={shape}
        multiline
        placeholder="Décrivez votre idée, votre défi ou ce qui vous amène ici..."
        error={errorFor("message")}
        onLeave={check}
        onRevise={revise}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Status state={state} />
          {aside}
        </div>
        <Action type="submit" size="lg" loading={pending}>
          Envoyer
        </Action>
      </div>
    </form>
  );
}
