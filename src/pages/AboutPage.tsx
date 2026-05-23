import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import styles from "./AboutPage.module.css";

const PILLARS = [
  {
    icon: "🌿",
    title: "Preservação ambiental",
    text: "A Mata Atlântica é um dos biomas mais ameaçados do planeta. Menos de 12% da cobertura original sobreviveu, e Teresópolis abriga um dos fragmentos mais significativos. O Circuito Terê Verde nasce do compromisso de proteger o que resta, tornando a informação ambiental acessível a todos.",
  },
  {
    icon: "🥾",
    title: "Turismo consciente",
    text: "Turismo consciente não é turismo menos divertido — é turismo mais inteligente. Quando o visitante conhece as regras, os limites e a biodiversidade local, a experiência é mais rica e o impacto, mínimo. Nossa plataforma transforma informação em responsabilidade.",
  },
  {
    icon: "📚",
    title: "Educação ambiental",
    text: "Crianças que crescem conhecendo a fauna e flora locais se tornam adultos que protegem o ambiente. O Circuito Terê Verde apoia programas educativos nos parques, disponibilizando informações didáticas sobre biodiversidade, ecossistemas e conservação.",
  },
  {
    icon: "🤝",
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
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Sobre o projeto</span>
          <h1 className={styles.heroTitle}>Uma ponte entre a cidade e a natureza</h1>
          <p className={styles.heroText}>
            O Circuito Terê Verde é uma plataforma digital criada para democratizar o acesso a
            informações sobre os parques naturais de Teresópolis, promovendo turismo responsável e
            educação ambiental para visitantes, moradores e pesquisadores.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        {/* Missão, Visão, Valores */}
        <section className={styles.mvvGrid}>
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
            <div key={item.title} className={styles.mvvCard}>
              <h2 className={styles.mvvTitle}>{item.title}</h2>
              <p className={styles.mvvText}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* Pilares */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nossos pilares</h2>
          <div className={styles.pillarsGrid}>
            {PILLARS.map((p) => (
              <article key={p.title} className={styles.pillarCard}>
                <span className={styles.pillarIcon}>{p.icon}</span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarText}>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Proposta acadêmica */}
        <section className={styles.section}>
          <div className={styles.academicCard}>
            <div className={styles.academicText}>
              <span className={styles.academicTag}>Contexto acadêmico</span>
              <h2 className={styles.academicTitle}>MVP desenvolvido na UNIFESO</h2>
              <p className={styles.academicDesc}>
                Este projeto foi desenvolvido como Trabalho de Conclusão da disciplina de
                <strong> Desenvolvimento de MVP Front-End</strong> do Curso Superior de Tecnologia
                em Análise e Desenvolvimento de Sistemas da UNIFESO (Centro Universitário Serra dos
                Órgãos), Teresópolis — RJ.
              </p>
              <p className={styles.academicDesc}>
                A escolha da situação-problema foi motivada pela ausência de uma plataforma digital
                unificada para os parques da região, um problema real identificado no cotidiano da
                cidade onde a UNIFESO está inserida.
              </p>
              <div className={styles.teamList}>
                {TEAM.map((member) => (
                  <div key={member.ra} className={styles.teamMember}>
                    <div className={styles.teamAvatar}>{member.name.charAt(0)}</div>
                    <div>
                      <p className={styles.teamName}>{member.name}</p>
                      <p className={styles.teamRole}>Matrícula: {member.ra}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.academicLogo}>
              <img src="/unifeso-logo.png" alt="UNIFESO" className={styles.uniLogo} />
              <p className={styles.uniCaption}>Centro Universitário Serra dos Órgãos</p>
              <p className={styles.uniCaption}>Teresópolis, RJ — 2026</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Pronto para explorar?</h2>
          <p className={styles.ctaText}>
            Descubra trilhas, cachoeiras e eventos nos parques de Teresópolis.
          </p>
          <div className={styles.ctaBtns}>
            <Link to="/trilhas" className={styles.ctaBtnPrimary}>
              Ver trilhas
            </Link>
            <Link to="/cachoeiras" className={styles.ctaBtnOutline}>
              Ver cachoeiras
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Circuito Terê Verde — Explore, Preserve, Conecte-se</p>
        <p className={styles.footerSub}>
          Projeto acadêmico — UNIFESO · Desenvolvimento de MVP Front-End
        </p>
      </footer>
    </div>
  );
}
