import { Reveal, Rule } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { SECTION_TITLE } from "../typography";

export function StackSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <ProjectSectionTitle
            lines={["Ma première vraie", "stack logicielle"]}
            className={SECTION_TITLE}
          />

          <p className="mt-10 max-w-2xl text-lg leading-relaxed">
            Jusque-là je faisais des exercices : un langage à la fois, un fichier à la fois, un
            énoncé qui disait quand c&apos;était fini. StockElec a été le premier endroit où
            j&apos;ai vu un logiciel entier : une API Spring que je n&apos;avais pas écrite, un
            front que je découvrais, et la couture entre les deux, que ni l&apos;un ni l&apos;autre
            ne montre tout seul. Personne ne venait dire que c&apos;était fini.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-16">
            <Rule tone="accent" className="w-16" />
            <p className="mt-8 max-w-3xl text-[clamp(1.5rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-tighter">
              D&apos;abord comprendre, ensuite remplacer.
            </p>
          </div>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed">
            Le premier réflexe devant un projet hérité est de tout réécrire : ce qu&apos;on ne
            comprend pas a l&apos;air mal fait. J&apos;y ai perdu assez de temps pour apprendre
            l&apos;ordre inverse. Lire, retrouver l&apos;intention, ne remplacer que ce dont je
            savais expliquer le remplacement. L&apos;API y est passée pour l&apos;essentiel, une
            fois comprise ; le front s&apos;est construit en apprenant son framework dessus.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
