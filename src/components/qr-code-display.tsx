"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  return (
    <div className="rounded-lg bg-white p-4">
      <QRCodeSVG value={url} size={256} level="M" bgColor="#ffffff" fgColor="#166534" />
    </div>
  );
}
