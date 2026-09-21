import { getBaseUrl } from "@/lib/get-base-url";
import { QrScreen } from "./_components/qr-screen";

export default function QRCodePage() {
  return (
    <QrScreen
      value={`${getBaseUrl()}/linktree`}
      caption="Scannez pour accéder à mes liens"
      switchHref="/qrcode/cv"
      switchLabel="QR code du CV"
    />
  );
}
