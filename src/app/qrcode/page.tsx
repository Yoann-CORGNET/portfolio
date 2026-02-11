import Link from "next/link"
import Image from "next/image"
import { getBaseUrl } from "@/lib/get-base-url"
import { QRCodeDisplay } from "@/components/qr-code-display"

export default function QRCodePage() {
  const linktreeUrl = `${getBaseUrl()}/linktree`

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold">
            <span className="text-primary">{">"}</span> Yoann CORGNET
          </h1>
        </div>

        {/* QR Code */}
        <QRCodeDisplay url={linktreeUrl} />

        {/* Instruction */}
        <p className="text-muted-foreground text-center text-sm">
          Scannez pour accéder à mes liens
        </p>
      </div>
    </div>
  )
}
