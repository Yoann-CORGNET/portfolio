import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Bracketed, Label, Logo } from "@/components/system";
import { FLAT } from "@/lib/design/tokens";

/**
 * One full-screen QR code, read from a phone at arm's length. `/qrcode` and
 * `/qrcode/cv` are the same screen with a different target, and each links to
 * the other so either can be put on display and flipped to its sibling.
 */
export function QrScreen({
  value,
  caption,
  switchHref,
  switchLabel,
}: Readonly<{
  /** Absolute URL the code encodes. */
  value: string;
  caption: string;
  /** The sibling screen this one flips to. */
  switchHref: string;
  switchLabel: string;
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-10 px-6">
        <Link href="/" className="flex flex-col items-center gap-4">
          <Logo label="Yoann CORGNET" className="h-10 w-10" />
          <span className="text-xl tracking-tight">Yoann CORGNET</span>
        </Link>

        <Bracketed className="p-6">
          <div className="p-3" style={{ background: FLAT.cream }}>
            <QRCodeSVG value={value} size={240} level="M" bgColor={FLAT.cream} fgColor={FLAT.ink} />
          </div>
        </Bracketed>

        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-sm text-muted-foreground">{caption}</p>
          <Link
            href={switchHref}
            className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
          >
            <ArrowLeftRight aria-hidden="true" className="h-3 w-3 text-muted-foreground" />
            <Label>{switchLabel}</Label>
          </Link>
        </div>
      </div>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-8 gap-y-2">
          <Label>© Yoann Corgnet</Label>
          <Link href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
            <Label>design system</Label>
          </Link>
        </div>
      </footer>
    </div>
  );
}
