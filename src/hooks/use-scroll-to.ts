"use client";

import { useCallback } from "react";

export const useScrollTo = () => {
  const scrollTo = useCallback((id: string) => {
    // Vérifier qu'on est côté client
    if (typeof window === "undefined") return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      console.warn(`Element #${id} not found`);
    }
  }, []);

  return scrollTo;
};
