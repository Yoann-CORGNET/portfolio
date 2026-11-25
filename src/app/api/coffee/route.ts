import { NextResponse } from "next/server";

/**
 * RFC 2324 (Hyper Text Coffee Pot Control Protocol). This server is a
 * teapot; it never had coffee to give. Both verbs answer the same way, since
 * refusing to brew isn't a side effect worth separating from reading it.
 */
function refuse() {
  return NextResponse.json(
    {
      error: "I'm a teapot",
      detail: "Ceci est une théière. Elle ne prépare pas de café.",
      rfc: "RFC 2324 §2.3.2",
      alternative: "/teapot",
    },
    { status: 418, statusText: "I'm a Teapot" },
  );
}

export const GET = refuse;
export const POST = refuse;
