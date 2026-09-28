import React from 'react';
import { Route, JourneyPreference } from '../../types/journey';
import { Modal } from '../common/Modal';
import { generateRecommendationReason } from '../../utils/recommendationEngine';
import { RouteScore } from './RouteScore';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhyThisRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  allRoutes: Route[];
  preference: JourneyPreference;
}

export const WhyThisRouteModal: React.FC<WhyThisRouteModalProps> = ({
  isOpen,
  onClose,
  route,
  allRoutes,
  preference
}) => {
  if (!route) return null;

  const reason = generateRecommendationReason(route, allRoutes, preference);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why JourneyIQ Recommends This"
      subtitle={`Intelligent evaluation for ${route.name}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="bg-[#DFF6FF]/60 border border-[#5F2CFF]/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#5F2CFF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B12]">
              Recommendation Rationale
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            "{reason.headline}"
          </p>
          <p className="text-xs text-slate-500 mt-2">{reason.summary}</p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Comparative Benchmark vs Alternatives
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {reason.comparisons.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#5F2CFF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    {c.label}
                  </div>
                  <div className="text-xs font-bold text-[#0B0B12] mt-0.5">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Detailed Journey Score Breakdown
          </h5>
          <RouteScore score={route.score} breakdown={route.scoreBreakdown} />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5F2CFF] text-white text-xs font-semibold hover:bg-[#5F2CFF]/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
};
