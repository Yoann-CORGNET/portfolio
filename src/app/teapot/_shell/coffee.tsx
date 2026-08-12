import { FLAT } from "@/lib/design/tokens";
import { type Program, err, ok } from "@/lib/shell/types";

/**
 * The one thing this machine does that a standard shell cannot. The 418 is not
 * staged — the status line quotes the wire, not a string written here.
 */
export const coffee: Program = {
  name: "coffee",
  desc: "demander un café à la théière",
  async run() {
    const startedAt = performance.now();
    try {
      const response = await fetch("/api/coffee", { method: "POST" });
      const body = await response.json();
      const ms = Math.round(performance.now() - startedAt);

      const banner = (
        <>
          <div>
            HTTP/1.1{" "}
            <span className="font-bold" style={{ color: FLAT.vermillon }}>
              {response.status} {response.statusText || "I'm a Teapot"}
            </span>{" "}
            <span style={{ opacity: 0.5 }}>({ms} ms)</span>
          </div>
          <pre className="mt-1 whitespace-pre-wrap" style={{ opacity: 0.8 }}>
            {JSON.stringify(body, null, 2)}
          </pre>
        </>
      );

      // `coffee; echo $?` should not report success.
      return response.ok ? ok(banner) : err(banner, 1);
    } catch {
      return err("La requête n'est même pas arrivée jusqu'à la théière.");
    }
  },
};

/** Shadows the standard `whoami` the way an earlier `$PATH` entry would. */
export const whoami: Program = {
  name: "whoami",
  desc: "votre identité ici",
  run: () => ok("un·e curieux·se qui a tapé /teapot dans la barre d'adresse"),
};
