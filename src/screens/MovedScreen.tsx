import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { LinkButton, Page } from '../components/ui.tsx';

/**
 * Compatibilidad de rutas antiguas (fase 19). Las secciones que salieron de la navegación
 * (Mi mundo, Recreaciones, Mis emociones, Mis herramientas, Espacio familiar) no se redirigen
 * solas: se explica qué ha cambiado y se ofrece un destino nuevo con un solo botón principal.
 * Ver docs/product/REMOVED_NAVIGATION.md.
 */
export interface MovedInfo {
  /** Nombre antiguo de la sección, tal como se veía. */
  was: string;
  /** Qué ha cambiado, en una o dos frases cortas. */
  text: string;
  to: string;
  action: string;
  icon: string;
  /** Destino alternativo opcional. */
  also?: { to: string; action: string; icon: string };
}

export function MovedScreen({ info }: { info: MovedInfo }) {
  return (
    <Page>
      <div className="card moved-card mx-auto flex max-w-xl flex-col items-center gap-4 p-6 text-center sm:p-8">
        <GuideArt mood="thinking" size={120} />
        <p className="text-sm font-black tracking-wider text-coral-700 uppercase">{info.was}</p>
        <h1 className="text-3xl text-petroleo-900">NUBI ha cambiado</h1>
        <p className="reading-text text-lg">{info.text}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton to={info.to} icon={info.icon} size="lg">
            {info.action}
          </LinkButton>
          {info.also && (
            <LinkButton to={info.also.to} icon={info.also.icon} variant="secondary" size="lg">
              {info.also.action}
            </LinkButton>
          )}
        </div>
        <LinkButton to="/" variant="ghost" icon="home">
          Ir al inicio
        </LinkButton>
      </div>
    </Page>
  );
}
