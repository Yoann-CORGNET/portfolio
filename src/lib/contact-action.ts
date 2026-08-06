"use server";

import { validateAll, type ContactField, type ContactState } from "@/lib/contact-state";

// Resend's REST endpoint rather than the `resend` package: one POST with
// three fields does not earn a dependency, and the SDK's draw — React
// email templates — is not something a plain-text notification wants.
const ENDPOINT = "https://api.resend.com/emails";

// Both addresses come from the environment, not from source. This repo is
// public, so a recipient committed here is a recipient harvested off
// GitHub; and keeping the sender out of source makes the move from
// Resend's sandbox address to the verified domain a redeploy, not a patch.
type Mailbox = Readonly<{ key: string; to: string; from: string }>;

// Read inside the action, never at module scope: a key missing at module
// scope fails while the page is being rendered, where nothing can catch
// it. Read here, a missing key is just another error state on the form.
function mailbox(): Mailbox | undefined {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  return key && to && from ? { key, to, from } : undefined;
}

// Every failure the visitor cannot act on reads the same, and never blames
// them for it. The cause goes to the server log, not to the page.
const UNDELIVERED: ContactState = {
  status: "error",
  message: "L'envoi a échoué de mon côté. Réessayez dans un instant.",
  errors: {},
};

type Values = Record<ContactField, string>;

async function deliver(box: Mailbox, values: Values): Promise<boolean> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${box.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: box.from,
      to: [box.to],
      // The visitor's address goes in reply_to, never in from: their domain
      // has not authorised this server to send for it, so DMARC would
      // reject the mail and the failures would count against the sender.
      reply_to: values.email,
      subject: `Portfolio — ${values.name}`,
      text: `${values.name} <${values.email}>\n\n${values.message}`,
    }),
  });

  if (!response.ok) {
    console.error(`Resend refused the message: ${response.status} ${await response.text()}`);
  }

  return response.ok;
}

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

  const box = mailbox();
  if (!box) {
    console.error("Contact form is unconfigured: RESEND_API_KEY, CONTACT_TO or CONTACT_FROM.");
    return UNDELIVERED;
  }

  try {
    if (!(await deliver(box, values))) return UNDELIVERED;
  } catch (cause) {
    // A throw here is the network, not Resend — never let it reach the
    // visitor as a success.
    console.error("Could not reach Resend:", cause);
    return UNDELIVERED;
  }

  return {
    status: "ok",
    message: "Bien reçu. Je réponds sous 48 h.",
    errors: {},
  };
}
