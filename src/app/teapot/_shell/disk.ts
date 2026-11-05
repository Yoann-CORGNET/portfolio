import { dir, file, homeDisk } from "@/lib/shell/vfs";

/** The image only; `homeDisk` owns the skeleton so home cannot drift from `user`. */
export const TEAPOT_DISK = homeDisk(
  "invité",
  {
    "patience.txt": file("Ce fichier est vide. Comme votre café."),
    the: dir({ "earl-grey.txt": file("Chaud. Toujours chaud.") }),
    cafe: dir(),
  },
  {
    etc: dir({
      "rfc2324.txt": file("Hyper Text Coffee Pot Control Protocol. Voir la commande coffee."),
    }),
  },
);
