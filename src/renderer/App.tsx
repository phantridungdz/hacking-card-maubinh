import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { App as Game } from '../app/App';
import { Active } from '../app/pages/Active';
import { Onboard } from '../app/pages/Onboard';
import { ThemeProvider } from '../components/provider/theme-provider';
import { Toaster } from '../components/toast/toaster';
import { TooltipProvider } from '../components/ui/tooltip';
import './App.css';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Onboard />} />
              <Route path="/app" element={<Game />} />
              <Route path="/active-license" element={<Active />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
