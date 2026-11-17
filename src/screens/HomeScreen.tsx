import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { LinkButton } from '../components/ui.tsx';

/** Una portada de álbum: bienvenida, paisaje entero y una sola entrada. */
export function HomeScreen() {
  return (
    <div className="home-cover">
      <header className="home-utilities">
        <LinkButton to="/ajustes" variant="ghost" icon="settings">Ajustes</LinkButton>
        <LinkButton to="/familias" variant="ghost" icon="grown">Familias</LinkButton>
      </header>
      <section className="home-spread" aria-labelledby="home-title">
        <div className="home-welcome">
          <GuideArt size={160} className="home-guide w-24 sm:w-40 lg:w-48" label="Nubi, la nube guía, te saluda" />
          <div>
            <h1 id="home-title" className="home-brand">NUBI</h1>
            <p className="reading-text home-invitation">Un mundo de historias por descubrir</p>
          </div>
        </div>
        <Illustration id="portada-fondo" decorative priority ratio fit="contain" sizes="(min-width: 1024px) 66vw, 100vw" className="home-landscape" />
        <div className="home-entry">
          <LinkButton to="/mundo" size="lg" iconAfter="arrow-right">Entrar en mi mundo</LinkButton>
        </div>
      </section>
      <p className="home-note"><Icon name="volume-off" size={18} /> Sin sonidos inesperados <span aria-hidden>·</span> Sin prisas</p>
    </div>
  );
}
