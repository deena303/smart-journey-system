import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JourneyProvider } from './context/JourneyContext';
import { BatteryProvider } from './context/BatteryContext';
import { Navbar } from './components/common/Navbar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { ToastContainer } from './components/common/Toast';
import { BatterySimulatorBar } from './components/battery/BatterySimulatorBar';
import { BatterySaverBanner } from './components/battery/BatterySaverBanner';
import { LandingPage } from './pages/LandingPage';
import { ResultsPage } from './pages/ResultsPage';
import { RouteDetailsPage } from './pages/RouteDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { WhatIfPage } from './pages/WhatIfPage';
import { SavedJourneysPage } from './pages/SavedJourneysPage';
import { HistoryPage } from './pages/HistoryPage';
import { PreferencesPage } from './pages/PreferencesPage';

export default function App() {
  return (
    <BrowserRouter>
      <BatteryProvider>
        <JourneyProvider>
          <div className="min-h-screen bg-[#F7F8FC] text-[#0B0B12] flex flex-col font-sans selection:bg-[#5F2CFF] selection:text-white">
            {/* Top Battery Simulator Bar for Hackathon Judges & Demos */}
            <BatterySimulatorBar />

            {/* Desktop & Tablet Top Navigation */}
            <Navbar />

            {/* Battery Saver Banner if active */}
            <BatterySaverBanner />

            {/* Main Viewport Container */}
            <main className="flex-1 w-full">
              <Routes>
                {/* Landing & Planner */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/plan" element={<Navigate to="/" replace />} />

                {/* Search Results (With automatic Critical Battery Mode transformation) */}
                <Route path="/results" element={<ResultsPage />} />

                {/* Route Details with Timeline & Simulated Map */}
                <Route path="/route/:id" element={<RouteDetailsPage />} />

                {/* Route Comparison Matrix */}
                <Route path="/compare" element={<ComparePage />} />

                {/* What-If Simulator */}
                <Route path="/what-if" element={<WhatIfPage />} />

                {/* Saved Journeys */}
                <Route path="/saved" element={<SavedJourneysPage />} />

                {/* Journey History */}
                <Route path="/history" element={<HistoryPage />} />

                {/* Travel Preferences */}
                <Route path="/preferences" element={<PreferencesPage />} />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNavigation />

            {/* Toast Notification Layer */}
            <ToastContainer />
          </div>
        </JourneyProvider>
      </BatteryProvider>
    </BrowserRouter>
  );
}
