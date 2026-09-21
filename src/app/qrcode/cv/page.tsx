import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/get-base-url";
import { QrScreen } from "../_components/qr-screen";

export const metadata: Metadata = {
  title: "QR code CV — Yoann CORGNET",
  description: "Scannez pour télécharger le CV de Yoann Corgnet.",
};

export default function QRCodeCvPage() {
  return (
    <QrScreen
      value={`${getBaseUrl()}/Yoann-CORGNET_CV.pdf`}
      caption="Scannez pour télécharger mon CV"
      switchHref="/qrcode"
      switchLabel="QR code des liens"
    />
  );
}
