import { FLAT, FLAT_ON, type FlatToken } from "@/lib/design/tokens";
import { Label, Watermark } from "@/components/system";
import { cn } from "@/lib/utils";

export function PointSection({
  tone,
  index,
  slug,
  statement,
  body,
  className,
}: Readonly<{
  tone: FlatToken;
  index: number;
  slug: string;
  statement: string;
  body: string;
  className?: string;
}>) {
  const number = String(index).padStart(2, "0");

  return (
    <div
      className={cn("relative overflow-hidden py-16 md:py-24", className)}
      style={{ background: FLAT[tone], color: FLAT_ON[tone] }}
    >
      <Watermark opacity={0.16}>{number}</Watermark>

      <div className="relative mx-auto max-w-6xl px-6">
        <Label tone="inherit" numeric className="opacity-70">
          {number} · {slug}
        </Label>
        <p className="mt-6 max-w-2xl text-xl leading-snug font-bold md:text-2xl">{statement}</p>
        <p className="mt-8 max-w-2xl leading-relaxed opacity-85">{body}</p>
      </div>
    </div>
  );
}
