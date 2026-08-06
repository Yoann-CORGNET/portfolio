// Server-only. Structured logs for anything that happens off-screen from the
// visitor — form deliveries, third-party failures — so an incident can be
// diagnosed from log lines instead of guessed at.

import pino from "pino";

export const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
