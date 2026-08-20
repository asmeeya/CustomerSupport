import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, Circle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { TroubleshootingGuide } from '../types';

interface TroubleshootingDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  guides: TroubleshootingGuide[];
  onStartDiagnostic: (guideName: string) => void;
}

export const TroubleshootingDirectoryModal: React.FC<TroubleshootingDirectoryModalProps> = ({
  isOpen,
  onClose,
  guides,
  onStartDiagnostic,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<TroubleshootingGuide>(guides[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Step-by-Step Diagnostic Center</h2>
              <p className="text-xs text-slate-500">Guided troubleshooting protocols for hardware & account resolution</p>
            </div>
          </div>
          <button
            id="close-troubleshoot-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Guide Selector Sidebar */}
          <div className="border-r border-slate-200 p-3 bg-slate-50 space-y-1.5 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
              Select Device / Issue
            </span>
            {guides.map((guide) => (
              <button
                key={guide.productIdOrIssue}
                onClick={() => {
                  setSelectedGuide(guide);
                  setCompletedSteps({});
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all ${
                  selectedGuide.productIdOrIssue === guide.productIdOrIssue
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="font-semibold">{guide.productName}</div>
                <div className={`text-[10px] truncate ${
                  selectedGuide.productIdOrIssue === guide.productIdOrIssue ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {guide.category}
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Steps Viewer */}
          <div className="md:col-span-2 p-5 overflow-y-auto space-y-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                  {selectedGuide.category}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedGuide.productName}</h3>
                <p className="text-xs text-slate-600 italic mt-0.5">"{selectedGuide.commonSymptom}"</p>
              </div>

              <button
                onClick={() => {
                  onStartDiagnostic(`I need step-by-step troubleshooting help with ${selectedGuide.productName}: ${selectedGuide.commonSymptom}`);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                Launch with AI <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {selectedGuide.steps.map((step) => {
                const isChecked = !!completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-blue-600 shrink-0"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                            Step {step.stepNumber}: {step.title}
                          </h4>
                          {isChecked && (
                            <span className="text-[10px] font-semibold text-emerald-700 uppercase bg-emerald-100 px-1.5 py-0.2 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.instruction}
                        </p>
                        {step.tip && (
                          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 p-2 rounded-md font-medium">
                            💡 <strong>Tip:</strong> {step.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between px-5">
          <span>Click any step to track your diagnostic progress.</span>
          <span className="font-medium text-slate-700">
            {Object.values(completedSteps).filter(Boolean).length} of {selectedGuide.steps.length} Steps Done
          </span>
        </div>
      </div>
    </div>
  );
};
