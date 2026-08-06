import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Bracketed, Label, Logo } from "@/components/system";
import { getBaseUrl } from "@/lib/get-base-url";
import { FLAT } from "@/lib/design/tokens";

export default function QRCodePage() {
  const linktreeUrl = `${getBaseUrl()}/linktree`;

  return (
    <div className="flex h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-10 px-6">
        <Link href="/" className="flex flex-col items-center gap-4">
          <Logo label="Yoann CORGNET" className="h-10 w-10" />
          <span className="text-xl tracking-tight">Yoann CORGNET</span>
        </Link>

        <Bracketed className="p-6">
          <div className="p-3" style={{ background: FLAT.cream }}>
            <QRCodeSVG
              value={linktreeUrl}
              size={240}
              level="M"
              bgColor={FLAT.cream}
              fgColor={FLAT.ink}
            />
          </div>
        </Bracketed>

        <p className="text-center text-sm text-muted-foreground">
          Scannez pour accéder à mes liens
        </p>
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
