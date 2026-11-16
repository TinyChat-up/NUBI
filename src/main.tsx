import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/nunito';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './index.css';
import { App } from './App.tsx';
import { ProgressProvider } from './state/progress.tsx';
import { SettingsProvider } from './state/settings.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </StrictMode>,
);
