import type { ReactNode } from 'react';
import { Icon } from '../components/Icon.tsx';
import { Button, Page, PageHeader } from '../components/ui.tsx';
import { useNarration } from '../lib/useNarration.ts';
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
    </Page>
  );
}
