import { BookOpen, Footprints, Handshake, Leaf, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { btnOutline, btnPrimary } from "../lib/variants/button";

const PILLARS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Leaf,
    title: "Preservação ambiental",
    text: "A Mata Atlântica é um dos biomas mais ameaçados do planeta. Menos de 12% da cobertura original sobreviveu, e Teresópolis abriga um dos fragmentos mais significativos. O Circuito Terê Verde nasce do compromisso de proteger o que resta, tornando a informação ambiental acessível a todos.",
  },
  {
    icon: Footprints,
    title: "Turismo consciente",
    text: "Turismo consciente não é turismo menos divertido — é turismo mais inteligente. Quando o visitante conhece as regras, os limites e a biodiversidade local, a experiência é mais rica e o impacto, mínimo. Nossa plataforma transforma informação em responsabilidade.",
  },
  {
    icon: BookOpen,
    title: "Educação ambiental",
    text: "Crianças que crescem conhecendo a fauna e flora locais se tornam adultos que protegem o ambiente. O Circuito Terê Verde apoia programas educativos nos parques, disponibilizando informações didáticas sobre biodiversidade, ecossistemas e conservação.",
  },
  {
    icon: Handshake,
    title: "Comunidade local",
    text: "O ecoturismo responsável fortalece a economia local sem destruir o recurso natural que o sustenta. Guias, pousadas, restaurantes e artesãos locais se beneficiam quando os visitantes chegam informados e engajados.",
  },
];

const TEAM = [
  { name: "João Paulo da Costa Rosa", ra: "06007776" },
  { name: "Leonardo Gurgel Maciel Ferreira", ra: "06010973" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="bg-green-700 px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <span className="mb-4 inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-medium text-green-900">
            Sobre o projeto
          </span>
          <h1 className="mb-4 text-[clamp(1.5rem,3vw,2.25rem)] text-white">
            Uma ponte entre a cidade e a natureza
          </h1>
          <p className="max-w-[600px] text-base leading-relaxed text-white/80">
            O Circuito Terê Verde é uma plataforma digital criada para democratizar o acesso a
            informações sobre os parques naturais de Teresópolis, promovendo turismo responsável e
            educação ambiental para visitantes, moradores e pesquisadores.
          </p>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-14 px-6 py-12">
        <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {[
            {
              title: "Missão",
              text: "Democratizar o acesso a informações ambientais e turísticas dos parques de Teresópolis, promovendo turismo consciente e preservação ambiental.",
            },
            {
              title: "Visão",
              text: "Ser a principal referência digital em ecoturismo responsável para a Região Serrana do Rio de Janeiro até 2027.",
            },
            {
              title: "Valores",
              text: "Sustentabilidade, transparência, educação ambiental, acessibilidade e respeito à biodiversidade local.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-gray-100 border-t-4 border-t-green-600 bg-white p-6"
            >
              <h2 className="mb-2.5 text-base text-green-800">{item.title}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-6 text-[1.375rem] text-green-800">Nossos pilares</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="flex flex-col gap-2.5 rounded-lg border border-gray-100 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p.icon className="size-7 text-green-700" aria-hidden />
                <h3 className="text-base font-semibold text-green-800">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-[1fr_auto] items-start gap-8 rounded-lg border border-gray-100 bg-white p-8">
            <div className="flex flex-col">
              <span className="w-fit mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Contexto acadêmico
              </span>
              <h2 className="mb-3.5 text-xl text-green-800">MVP desenvolvido na UNIFESO</h2>
              <p className="mb-3 text-[0.9rem] leading-relaxed text-gray-600">
                Este projeto foi desenvolvido como Trabalho de Conclusão da disciplina de
                <strong> Desenvolvimento de MVP Front-End</strong> do Curso Superior de Tecnologia
                em Análise e Desenvolvimento de Sistemas da UNIFESO (Centro Universitário Serra dos
                Órgãos), Teresópolis — RJ.
              </p>
              <p className="mb-3 text-[0.9rem] leading-relaxed text-gray-600">
                A escolha da situação-problema foi motivada pela ausência de uma plataforma digital
                unificada para os parques da região, um problema real identificado no cotidiano da
                cidade onde a UNIFESO está inserida.
              </p>
              <div className="mt-2 flex flex-col gap-2.5">
                {TEAM.map((member) => (
                  <div key={member.ra} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[0.9375rem] font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">Matrícula: {member.ra}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-w-[160px] flex-col items-center gap-2">
              <img src="/unifeso-logo.png" alt="UNIFESO" className="max-w-[140px] object-contain" />
              <p className="text-center text-[0.6875rem] text-gray-500">
                Centro Universitário Serra dos Órgãos
              </p>
              <p className="text-center text-[0.6875rem] text-gray-500">Teresópolis, RJ — 2026</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-3.5 rounded-xl bg-green-700 px-8 py-12 text-center">
          <h2 className="text-2xl text-white">Pronto para explorar?</h2>
          <p className="text-base text-white/75">
            Descubra trilhas, cachoeiras e eventos nos parques de Teresópolis.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3.5">
            <Link to="/trilhas" className={btnPrimary()}>
              Ver trilhas
            </Link>
            <Link to="/cachoeiras" className={btnOutline()}>
              Ver cachoeiras
            </Link>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-1 bg-green-800 p-6 text-center text-[0.8125rem] text-white/60">
        <p>© 2026 Circuito Terê Verde — Explore, Preserve, Conecte-se</p>
        <p className="text-xs opacity-70">
          Projeto acadêmico — UNIFESO · Desenvolvimento de MVP Front-End
        </p>
      </footer>
    </div>
  );
}
