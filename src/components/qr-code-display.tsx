"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useTheme } from "next-themes"

interface QRCodeDisplayProps {
  url: string
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-64 h-64 bg-secondary/50 rounded-lg animate-pulse" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="rounded-lg bg-white p-4">
      <QRCodeSVG
        value={url}
        size={256}
        level="M"
        bgColor="#ffffff"
        fgColor={isDark ? "#15803d" : "#166534"}
      />
    </div>
  )
}
