"use server";

import { Resend } from "resend";
import { logger } from "@/lib/logger";
import { validateAll, type ContactField, type ContactState } from "@/lib/contact-state";

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
  const { error } = await new Resend(box.key).emails.send({
    from: box.from,
    to: [box.to],
    // The visitor's address goes in replyTo, never in from: their domain
    // has not authorised this server to send for it, so DMARC would
    // reject the mail and the failures would count against the sender.
    replyTo: values.email,
    subject: `Portfolio — ${values.name}`,
    text: `${values.name} <${values.email}>\n\n${values.message}`,
  });

  if (error) logger.error({ event: "contact.resend_error", error }, "Resend refused the message");

  return !error;
}

/* ------------------------------------------------------------------ */
/* Idempotency                                                        */
/* ------------------------------------------------------------------ */

// Module-scope, not a database: Fluid Compute keeps this instance warm
// between requests, which is enough to absorb the two real cases —
// a double click that fires the action twice before the button disables,
// and a visitor mashing submit with the same text. It resets on cold
// start and isn't shared across instances; that's fine, it only needs to
// blunt bursts, not enforce a hard global limit.
const COOLDOWN_MS = 30_000;
const recentByEmail = new Map<string, { at: number; payload: string }>();

function payloadOf(values: Values): string {
  return `${values.name}|${values.message}`;
}

// Prunes on read so the map can't grow unbounded over the life of the
// instance; a portfolio contact form never has enough traffic to need
// anything fancier.
function checkCooldown(email: string, payload: string): "clear" | "duplicate" | "throttled" {
  const now = Date.now();
  for (const [key, entry] of recentByEmail) {
    if (now - entry.at >= COOLDOWN_MS) recentByEmail.delete(key);
  }

  const prior = recentByEmail.get(email);
  if (!prior || now - prior.at >= COOLDOWN_MS) return "clear";
  return prior.payload === payload ? "duplicate" : "throttled";
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
    logger.warn({ event: "contact.honeypot" }, "Honeypot field filled, message dropped");
    return { status: "ok", message: "Message envoyé.", errors: {} };
  }

  const errors = validateAll(values);
  if (Object.keys(errors).length > 0) {
    logger.info(
      { event: "contact.validation_failed", fields: Object.keys(errors) },
      "Contact form submitted with invalid fields",
    );
    return { status: "error", message: "Le formulaire n'est pas complet.", errors };
  }

  const payload = payloadOf(values);
  const cooldown = checkCooldown(values.email, payload);
  if (cooldown === "duplicate") {
    // Same visitor, same text, inside the window: almost certainly the
    // same click landing twice. Answer as if it had just been sent,
    // without sending it again — the first send is still the one that
    // counts.
    logger.info({ event: "contact.duplicate" }, "Duplicate submission absorbed");
    return { status: "ok", message: "Bien reçu. Je réponds sous 48 h.", errors: {} };
  }
  if (cooldown === "throttled") {
    logger.warn({ event: "contact.throttled" }, "Submission throttled");
    return {
      status: "error",
      message: "Un message part déjà. Patientez quelques secondes avant d'en renvoyer un autre.",
      errors: {},
    };
  }

  // Claimed before the send, not after: `deliver` awaits the network, and a
  // second click landing during that window must see the slot as taken too
  // — recording it only on success leaves the exact race this guards
  // against wide open between the two awaits.
  recentByEmail.set(values.email, { at: Date.now(), payload });

  const box = mailbox();
  if (!box) {
    recentByEmail.delete(values.email);
    logger.error(
      { event: "contact.unconfigured" },
      "Contact form is unconfigured: RESEND_API_KEY, CONTACT_TO or CONTACT_FROM",
    );
    return UNDELIVERED;
  }

  try {
    if (!(await deliver(box, values))) {
      // A real failure shouldn't cost the visitor the cooldown window too —
      // release the slot so an immediate retry isn't throttled for a send
      // that never went out.
      recentByEmail.delete(values.email);
      return UNDELIVERED;
    }
  } catch (cause) {
    recentByEmail.delete(values.email);
    // A throw here is the network, not Resend — never let it reach the
    // visitor as a success.
    logger.error({ event: "contact.network_error", err: cause }, "Could not reach Resend");
    return UNDELIVERED;
  }

  logger.info({ event: "contact.sent" }, "Contact message delivered");

  return {
    status: "ok",
    message: "Bien reçu. Je réponds sous 48 h.",
    errors: {},
  };
}
