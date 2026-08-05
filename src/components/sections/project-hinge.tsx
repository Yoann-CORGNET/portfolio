import { FlowField, Frame } from "@/components/system";

/**
 * The texture every hinge draws.
 *
 * Owned here rather than passed in, because a hinge is the same object wherever
 * it appears and only its seed tells two of them apart. Settings sit lower than
 * the full-width bands: a field in a hinge accompanies a sentence, it does not
 * open a chapter. Hence the reduced intensity, the influence pulled in to the
 * height of the panel, and above all the short wavelength — at the bands' 320 a
 * box this size would show nothing but parallel lines.
 */
const TEXTURE = {
  palette: "machine",
  spacing: 7,
  scale: 180,
  curl: 1.2,
  intensity: 0.8,
  maxSteps: 600,
  fade: "edges",
  interactive: true,
  influence: 70,
  strength: 24,
} as const;

/**
 * The hinge between two moments of a project page.
 *
 * A texture in the left third, a line or two in the remaining two. No label and
 * no rule, so it reads as neither the quote that just closed a section nor the
 * title about to open the next one. A hinge has nothing to recap: it asks the
 * question that follows.
 *
 * Unlike `ProjectHero`, this bakes in its type scale as well as its texture.
 * There, each project opens at its own pitch and the typography had to stay
 * caller-supplied; here the point is that the hinges of a page are one object
 * seen twice, so a caller decides only what it says and which field it draws.
 */
export function ProjectHinge({
  lines,
  seed,
}: Readonly<{
  /**
   * Broken by hand, one entry per line. The break carries meaning — two
   * enumerated questions set one under the other are two questions, where a
   * single line lets the second pass for the end of the first.
   */
  lines: readonly string[];
  /**
   * The field is deterministic, so every hinge on the site needs its own seed:
   * reusing one already placed elsewhere draws the same texture twice.
   */
  seed: number;
}>) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="md:flex">
          {/* Below `md` the column drops entirely, texture included: there is no
              left third left to put it in, and moving it above the text would
              make it one more band in the flow instead of an object in the
              margin. The gutter is carried here so the text starts exactly on
              the third rather than on the third plus the gutter.

              The texture takes the height of the text it faces — `h-full` in a
              stretched cell — and has no rule around it: it fades out on its own
              edges, which a frame would contradict by closing it back into a
              rectangle. */}
          <div className="hidden md:block md:w-1/3 md:shrink-0 md:pr-12">
            <Frame className="h-full">
              <FlowField {...TEXTURE} seed={seed} />
            </Frame>
          </div>

          <blockquote className="max-w-2xl text-[clamp(1.125rem,2.6vw,1.75rem)] leading-snug tracking-tight">
            {lines.map((line) => (
              /* No `whitespace-nowrap`: the break is the one that was written,
                 and each line stays free to fold under itself when the measure
                 no longer holds it. */
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
