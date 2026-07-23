import * as React from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Used to defer rendering anything that depends on browser-only state (theme,
 * viewport) until after hydration, without the setState-in-effect pattern.
 */
export function useMounted() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
