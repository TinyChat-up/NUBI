import { useState, type ReactNode } from 'react';
import { Icon } from '../components/Icon.tsx';
import { Button, Page, PageHeader } from '../components/ui.tsx';
import { useNarration } from '../lib/useNarration.ts';
import { useProgress } from '../state/progress.tsx';
import { useSettings, type Settings } from '../state/settings.tsx';

function Segmented<K extends keyof Settings>({ setting, label, options }: { setting: K; label: string; options: { value: Settings[K]; label: string; icon?: string }[] }) {
  const { settings, update } = useSettings();
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-lg font-black text-petroleo-900">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = settings[setting] === o.value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={on}
              onClick={() => update({ [setting]: o.value } as Partial<Settings>)}
              className={`tap flex min-h-14 items-center gap-2 rounded-full border-[3px] px-5 font-extrabold ${on ? 'border-petroleo-600 bg-petroleo-50 text-petroleo-900' : 'border-crema-300 bg-crema-50'}`}
            >
              {o.icon && <Icon name={o.icon} size={20} />}
              {o.label}
              {on && <Icon name="check" size={18} />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Group({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className="settings-group grid gap-6">
      <h2 className="flex items-center gap-2 text-2xl text-petroleo-900">
        <Icon name={icon} /> {title}
      </h2>
      {children}
    </section>
  );
}

const yesNo = [
  { value: false, label: 'No' },
  { value: true, label: 'Sí' },
];

/** Ajustes de lectura, sonido y movimiento: diseño adaptable a distintas necesidades. */
export function SettingsScreen() {
  const { reset } = useSettings();
  const narration = useNarration();

  return (
    <Page>
      <PageHeader title="Ajustes" subtitle="Para que NUBI se adapte a ti." icon="settings" />

      <div className="settings-preview" aria-live="polite">
        <p className="text-sm font-black tracking-wider text-coral-700 uppercase">Así se verá el texto</p>
        <p className="reading-text mt-2 text-2xl font-bold">Es martes por la mañana. Teo llega al colegio con su abuela Rosa.</p>
      </div>

      <div className="settings-sections">
        <Group title="Lectura" icon="text">
          <Segmented setting="textSize" label="Tamaño del texto" options={[{ value: 'm', label: 'Normal' }, { value: 'l', label: 'Grande' }, { value: 'xl', label: 'Muy grande' }]} />
          <Segmented setting="spacing" label="Espacio entre letras y líneas" options={[{ value: 'normal', label: 'Normal' }, { value: 'wide', label: 'Más espacio' }]} />
          <Segmented setting="font" label="Tipo de letra" options={[{ value: 'nunito', label: 'Redondeada' }, { value: 'legible', label: 'Muy clara' }]} />
          <Segmented setting="letterCase" label="Letras de las historias" options={[{ value: 'normal', label: 'Normales' }, { value: 'upper', label: 'MAYÚSCULAS' }]} />
          <Segmented setting="shortText" label="Textos cortos (lectura fácil)" options={yesNo} />
        </Group>

        <Group title="Escuchar" icon="volume">
          <p>Las historias se abren en lectura. Puedes activar Escuchar dentro del reproductor.</p>
          <Segmented setting="subtitles" label="Subtítulos al escuchar" options={yesNo} />
          <Segmented setting="deviceVoice" label="Usar la voz del dispositivo si no hay audio grabado" options={yesNo} />
          <Segmented setting="voiceRate" label="Velocidad de la voz" options={[{ value: 0.75, label: 'Despacio' }, { value: 0.9, label: 'Normal' }, { value: 1.05, label: 'Rápida' }]} />
          <div>
            <Button variant="soft" icon="volume" disabled={!narration.available} onClick={() => narration.speak('Hola, soy Nubi. Así suena la voz.')}>
              Probar la voz
            </Button>
            {!narration.available && <p className="mt-2 text-sm text-tinta-suave">La voz del dispositivo no está disponible o está desactivada.</p>}
          </div>
        </Group>

        <Group title="Movimiento" icon="motion">
          <Segmented
            setting="motion"
            label="Animaciones"
            options={[
              { value: 'auto', label: 'Como el dispositivo' },
              { value: 'reduced', label: 'Sin animaciones' },
              { value: 'full', label: 'Con animaciones suaves' },
            ]}
          />
        </Group>

        <Group title="Colores" icon="palette">
          <Segmented setting="contrast" label="Contraste" options={[{ value: 'normal', label: 'Normal' }, { value: 'high', label: 'Más contraste' }]} />
        </Group>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" icon="refresh" onClick={reset}>
          Volver a los ajustes iniciales
        </Button>
      </div>

      <DeviceData />
    </Page>
  );
}

/**
 * Datos de este dispositivo (antes en el Espacio familiar, fase 19). Borra el punto de los cuentos y lo
 * explorado; conserva estos ajustes. No hay servidor: nada sale del navegador.
 */
function DeviceData() {
  const { resetAll } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <section aria-labelledby="device-data" className="mt-10 rounded-[var(--radius-card)] border-2 border-crema-300 p-6">
      <h2 id="device-data" className="flex items-center gap-2 text-xl text-petroleo-900">
        <Icon name="lock" /> Datos de este dispositivo
      </h2>
      <p className="mt-2">NUBI guarda en este navegador estos ajustes y el punto donde se quedó cada cuento. No hay cuentas y no se envía nada a ningún servidor.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {confirm ? (
          <>
            <span className="font-bold">¿Borrar el progreso de los cuentos?</span>
            <Button
              variant="coral"
              icon="trash"
              onClick={() => {
                resetAll();
                setConfirm(false);
                setDone(true);
              }}
            >
              Sí, borrar
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="secondary" icon="trash" onClick={() => { setConfirm(true); setDone(false); }}>
            Borrar el progreso
          </Button>
        )}
      </div>
      {done && <p role="status" className="mt-3 font-bold text-salvia-700">Progreso borrado. Los ajustes se mantienen.</p>}
    </section>
  );
}
