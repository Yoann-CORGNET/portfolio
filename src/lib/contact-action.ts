"use server";

import { validateAll, type ContactState } from "@/lib/contact-state";

// Not wired to a real transport (mail service, API key, sender domain) —
// deliberately, this stage is about the form's states, not delivery.
const FEIGNED_LATENCY_MS = 700;

export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: report success rather than an error, so a bot doesn't learn
  // what to fix.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "ok", message: "Message envoyé.", errors: {} };
  }

  const errors = validateAll(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Le formulaire n'est pas complet.", errors };
  }

  await new Promise((resolve) => setTimeout(resolve, FEIGNED_LATENCY_MS));

  return {
    status: "ok",
    message: "Bien reçu. Je réponds sous 48 h.",
    errors: {},
  };
}
