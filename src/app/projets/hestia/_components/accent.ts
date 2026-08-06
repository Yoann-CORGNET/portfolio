import { FLAT } from "@/lib/design/tokens";

/**
 * L'accent chaud, sur le papier de la page.
 *
 * `Label tone="accent"` rend du vermillon, qui ne donne que 3,86 de contraste
 * sur le fond de page — sous le seuil de 4,5 qu'un texte de dix pixels réclame.
 * Rust, une clarté plus bas, remonte le rapport à 5,77. Sur un aplat, la
 * question ne se pose pas : c'est `tone="inherit"` qui s'applique, et l'aplat
 * descend sa propre encre lisible.
 */
export const ACCENT = { color: FLAT.rust };
