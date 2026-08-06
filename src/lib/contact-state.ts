// Separate from the action because a module marked "use server" can only
// export async functions — everything else is turned into a server
// reference, and exporting a plain constant there breaks static rendering.
// Client and server both import from here so they share the same rules.

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "ok" | "error";
  message: string;
  errors: Partial<Record<ContactField, string>>;
};

export const CONTACT_IDLE: ContactState = { status: "idle", message: "", errors: {} };

// Loose on purpose: only rejects what obviously isn't an address. A
// stricter regex fails in the costly direction — rejecting real addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MIN_MESSAGE = 20;

export function validateField(field: ContactField, value: string): string | undefined {
  switch (field) {
    case "name":
      return value.length < 2 ? "Il me faut un nom." : undefined;
    case "email":
      return EMAIL.test(value) ? undefined : "Cette adresse ne ressemble pas à une adresse.";
    case "message":
      return value.length < MIN_MESSAGE
        ? `Encore ${MIN_MESSAGE - value.length} caractères, le temps de poser le contexte.`
        : undefined;
  }
}

export function validateAll(values: Record<ContactField, string>): ContactState["errors"] {
  const errors: ContactState["errors"] = {};
  for (const field of ["name", "email", "message"] as const) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
