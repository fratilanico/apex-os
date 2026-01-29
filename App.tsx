import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PasswordGate } from './components/PasswordGate';
import { ScrollToTop } from './components/ScrollToTop';
import { EasterEggHints } from './components/EasterEggHints';
import { PlayerOneHUD } from './components/artifacts/PlayerOne/PlayerOneHUD';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWebVitals } from './hooks/useWebVitals';
import { useAnalytics } from './hooks/useAnalytics';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const VibePage = lazy(() => import('./pages/VibePage').then(m => ({ default: m.VibePage })));
const ApproachPage = lazy(() => import('./pages/ApproachPage').then(m => ({ default: m.ApproachPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then(m => ({ default: m.AcademyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const GamePage = lazy(() => import('./pages/GamePage').then(m => ({ default: m.GamePage })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-cyan-400 font-mono animate-pulse">Loading...</div>
  </div>
);

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const { track } = useAnalytics();

  React.useEffect(() => {
    track('page_view', { path: location.pathname });
  }, [location.pathname, track]);

  return null;
};

const RouteErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
      <p className="text-white/60 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
      >
        Return Home
      </button>
    </div>
  </div>
);

const App = (): React.ReactElement => {
  // Initialize web vitals monitoring
  useWebVitals();

  return (
    <PasswordGate>
      <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />
        <PlayerOneHUD />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Home page error')} />}>
                  <HomePage />
                </ErrorBoundary>
              } />
              <Route path="/vibe" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Vibe page error')} />}>
                  <VibePage />
                </ErrorBoundary>
              } />
              <Route path="/approach" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Approach page error')} />}>
                  <ApproachPage />
                </ErrorBoundary>
              } />
              <Route path="/academy" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Academy page error')} />}>
                  <AcademyPage />
                </ErrorBoundary>
              } />
              <Route path="/contact" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Contact page error')} />}>
                  <ContactPage />
                </ErrorBoundary>
              } />
              <Route path="/pricing" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pricing page error')} />}>
                  <PricingPage />
                </ErrorBoundary>
              } />
              <Route path="/admin" element={
                <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Admin page error')} />}>
                  <AdminPage />
                </ErrorBoundary>
              } />
            </Route>
            {/* Game page outside Layout - full-screen immersive experience */}
            <Route path="/game" element={
              <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Game page error')} />}>
                <GamePage />
              </ErrorBoundary>
            } />
          </Routes>
        </Suspense>
        <ErrorBoundary fallback={null}>
          <EasterEggHints />
        </ErrorBoundary>
      </BrowserRouter>
    </PasswordGate>
  );
};

export default App;
