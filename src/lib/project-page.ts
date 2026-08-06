import { FLAT } from "@/lib/design/tokens";

// Hairline for a dark flat surface, where `border-border` isn't visible.
export const inkLine = `color-mix(in srgb, ${FLAT.cream} 20%, transparent)`;

export const dim = (opacity: number) => ({ opacity });
