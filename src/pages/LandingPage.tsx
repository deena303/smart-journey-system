import React from 'react';
import { JourneySearch } from '../components/planner/JourneySearch';
import { RecentJourneys } from '../components/planner/RecentJourneys';
import { Compass, Sparkles, Shield, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#DFF6FF]/60 via-[#F7F8FC] to-transparent pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#5F2CFF]/20 text-[#5F2CFF] shadow-xs mb-6 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Mobility Routing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0B0B12] font-display text-balance mb-4">
            Plan smarter. <br className="hidden sm:inline" />
            <span className="text-[#5F2CFF]">Travel better.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal text-balance mb-2">
            Compare every way to get there and discover the journey that fits you best.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium mb-10">
            One destination. Multiple ways to get there. One intelligent recommendation.
          </p>

          {/* Main Journey Planner Card */}
          <div className="max-w-3xl mx-auto">
            <JourneySearch />
          </div>

          {/* Recent Journeys */}
          <div className="max-w-3xl mx-auto mt-4">
            <RecentJourneys />
          </div>
        </div>
      </section>

      {/* Product Philosophy & Differentiator Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-white p-8 sm:p-10 border border-slate-200/80 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B12] font-display">
              Beyond the Shortest Route
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Google Maps or conventional apps only optimize for distance. JourneyIQ balances
              real-world friction so you never overpay or get stuck in traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-[#5F2CFF]/10 text-[#5F2CFF] flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B12] mb-1">Multi-Factor Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates travel time, distance, transit fare, vehicle transfers, walking steps, and
                CO₂ emissions simultaneously.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#DFF6FF]/40 border border-[#5F2CFF]/20">
              <div className="w-10 h-10 rounded-xl bg-[#5F2CFF] text-white flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B12] mb-1">Adaptive Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch between saving time, saving money, low walking, or green transit and watch
                route rankings adjust dynamically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0B0B12] mb-1">What-If Simulator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test constraints like "max budget ₹100" or "maximum 1 transfer" before leaving home.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
