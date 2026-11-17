import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { LinkButton } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';

/**
 * Portada: el paisaje ilustrado ocupa toda la pantalla (fase 18) y lleva a las DOS funciones de NUBI (fase 19):
 * - «Descubrir un cuento»: la acción principal, para el niño o la niña.
 * - «Para familias y docentes»: acceso secundario, con su propio aspecto y una línea que dice para quién es.
 * Ajustes queda arriba como utilidad, siempre con su palabra visible.
 * Con poca altura (zoom alto) la sección crece y se desplaza: nunca se fuerza la pantalla completa.
 */
export function HomeScreen() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <Illustration id="portada-fondo" decorative priority fit="cover" sizes="100vw" className="home-hero-art absolute inset-0" />

      <header className="home-hero-bar">
        <Link to="/ajustes" className="tap home-hero-pill">
          <Icon name="settings" size={22} /> Ajustes
        </Link>
      </header>

      <div className="home-hero-sky">
        <div className="home-hero-title">
          <GuideArt size={144} className="home-hero-guide w-24 sm:w-36" label="Nubi, la nube guía, te saluda" />
          <div>
            <h1 id="home-title" className="home-hero-brand">NUBI</h1>
            <p className="reading-text home-hero-tagline">Cuentos para descubrir qué pasa y qué podría pasar</p>
          </div>
        </div>
        <div className="home-hero-actions">
          <LinkButton to="/historias" size="lg" iconAfter="arrow-right" className="home-hero-cta">
            Descubrir un cuento
          </LinkButton>
          <Link to="/acompanar" className="tap home-hero-adult">
            <Icon name="grown" size={22} />
            <span>
              <span className="block">Para familias y docentes</span>
              <span className="home-hero-adult-note">Cómo acompañar cada cuento</span>
            </span>
          </Link>
        </div>
      </div>

      <p className="home-hero-note">
        <Icon name="volume-off" size={18} /> Sin sonidos inesperados <span aria-hidden>·</span> Sin prisas
      </p>
    </section>
  );
}
