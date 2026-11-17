import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { LinkButton } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';

/**
 * Portada: el paisaje ilustrado ocupa toda la pantalla y el niño o la niña «entra» en el mundo.
 * - `portada-fondo` a sangre con `cover` y su punto focal (el colegio queda en el centro en vertical).
 * - Título, Nubi y la única acción principal en el cielo, sin bloques que tapen el paisaje.
 * - Ajustes y Familias arriba, siempre con su palabra visible.
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
        <Link to="/familias" className="tap home-hero-pill" aria-label="Familias: espacio para personas adultas">
          <Icon name="grown" size={22} /> Familias
        </Link>
      </header>

      <div className="home-hero-sky">
        <div className="home-hero-title">
          <GuideArt size={160} className="home-hero-guide" label="Nubi, la nube guía, te saluda" />
          <div>
            <h1 id="home-title" className="home-hero-brand">NUBI</h1>
            <p className="reading-text home-hero-tagline">Un mundo de historias por descubrir</p>
          </div>
        </div>
        <LinkButton to="/mundo" size="lg" iconAfter="arrow-right" className="home-hero-cta">
          Entrar en mi mundo
        </LinkButton>
      </div>

      <p className="home-hero-note">
        <Icon name="volume-off" size={18} /> Sin sonidos inesperados <span aria-hidden>·</span> Sin prisas
      </p>
    </section>
  );
}
