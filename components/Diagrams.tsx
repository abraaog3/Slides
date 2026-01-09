/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Scale, Sigma, Braces, Network, GitCommit, ArrowDown, Variable, Divide, X } from 'lucide-react';

// --- TYPES ---
export interface TimelineEvent {
    id: number | string;
    year: string;
    label: string;
    desc: string;
}

export interface OrbitData {
    center: string;
    orbit1: string;
    orbit2: string;
    label1: string;
    label2: string;
}

export interface ChartData {
    title: string;
    leftLabel: string;
    rightLabel: string;
    option1: string;
    option2: string;
}

// --- LOGICAL DEDUCTION TIMELINE (Formerly HistoryTimeline) ---
// Visual style: Resembles a formal logic proof or derivation steps
interface HistoryTimelineProps {
    events?: TimelineEvent[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ events }) => {
  const [activeStep, setActiveStep] = useState<number | string>(events && events.length > 0 ? events[events.length - 1].id : 0);
  
  const defaultEvents = [
    { id: 0, year: "Step 1", label: "Premissa Inicial", desc: "Definição do escopo." },
    { id: 1, year: "Step 2", label: "Inferência", desc: "Aplicação de regras." },
    { id: 2, year: "Step 3", label: "Conclusão", desc: "Resultado lógico." },
  ];

  const displayEvents = events && events.length > 0 ? events : defaultEvents;

  useEffect(() => {
     if (displayEvents.length > 0) {
         setActiveEra(displayEvents[displayEvents.length - 1].id);
     }
  }, [events]); 

  const setActiveEra = (id: string | number) => setActiveStep(id);

  // Logical operators as decoration
  const operators = ["∀x", "∃y", "p→q", "∴", "≡", "¬p"];

  return (
    <div className="flex flex-col items-center p-6 md:p-8 bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-stone-200 my-8 w-full">
      <h3 className="font-serif text-2xl mb-6 text-stone-800 flex items-center gap-3 border-b border-stone-100 pb-2 w-full justify-center md:justify-start">
        <GitCommit size={24} className="text-nobel-gold"/> 
        <span className="italic">Cadeia de Dedução</span>
      </h3>
      
      <div className="relative w-full max-w-lg py-4">
         {/* Vertical Deduction Line */}
         <div className="absolute left-[27px] top-4 bottom-4 w-px bg-stone-300"></div>

         <div className="space-y-6">
            {displayEvents.map((step, index) => (
                <div 
                    key={step.id} 
                    className={`relative pl-16 cursor-pointer group transition-all duration-300 ${activeStep === step.id ? 'opacity-100 translate-x-1' : 'opacity-60 hover:opacity-80'}`}
                    onClick={() => setActiveEra(step.id)}
                >
                    {/* Node / Bullet */}
                    <div className={`absolute left-[14px] top-1 w-7 h-7 rounded bg-white border border-stone-300 flex items-center justify-center font-serif text-[10px] z-10 transition-colors ${activeStep === step.id ? 'border-nobel-gold text-nobel-gold shadow-sm' : 'text-stone-400'}`}>
                        {index + 1}
                    </div>

                    {/* Logic Symbol Annotation (Absolute Left) */}
                    <div className="absolute -left-6 top-1.5 text-xs font-mono text-stone-300 font-bold select-none">
                        {operators[index % operators.length]}
                    </div>

                    <div className="flex flex-col border-l-2 border-transparent pl-4 hover:border-stone-100 transition-all">
                        <div className="flex items-baseline gap-3">
                            <span className="font-mono text-xs font-bold text-nobel-gold tracking-wider uppercase">{step.year}</span>
                            <span className="font-serif text-xl font-medium text-stone-900 leading-none">{step.label}</span>
                        </div>
                        <span className="text-sm font-sans text-stone-600 mt-2 leading-relaxed max-w-md block">
                            {activeStep === step.id && (
                                <motion.span
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {step.desc}
                                </motion.span>
                            )}
                            {activeStep !== step.id && <span className="line-clamp-1">{step.desc}</span>}
                        </span>
                    </div>
                </div>
            ))}
         </div>
         
         {/* End Symbol */}
         <div className="absolute left-[22px] bottom-0 text-stone-300">
             <ArrowDown size={12} />
         </div>
      </div>
    </div>
  );
};

// --- SEMANTIC FIELD ORBIT (Formerly FamilyConnectionDiagram) ---
// Visual style: Conceptual map, central idea with orbiting properties
interface FamilyDiagramProps {
    data?: OrbitData;
}

export const FamilyConnectionDiagram: React.FC<FamilyDiagramProps> = ({ data }) => {
  const displayData = data || {
      center: "Conceito",
      orbit1: "Propriedade A",
      orbit2: "Propriedade B",
      label1: "Axioma 1",
      label2: "Axioma 2"
  };

  return (
    <div className="flex flex-col items-center p-8 bg-[#F5F4F0] rounded-lg border border-stone-200 my-8 shadow-inner w-full">
      <div className="relative w-72 h-72 flex items-center justify-center">
        
        {/* Central Node: The Core Concept */}
        <div className="relative z-20 w-28 h-28 bg-white rounded-full flex items-center justify-center border border-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col items-center p-2 text-center">
                <Brain className="text-stone-800 mb-2 stroke-1" size={32} />
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-900 leading-tight">
                    {displayData.center}
                </span>
            </div>
            {/* Decorative Brackets */}
            <Braces className="absolute -left-4 text-stone-300 font-thin h-24 w-8" strokeWidth={1} />
            <Braces className="absolute -right-4 text-stone-300 font-thin h-24 w-8 rotate-180" strokeWidth={1} />
        </div>

        {/* Orbit Path 1 */}
        <div className="absolute w-56 h-56 rounded-full border border-stone-300 border-dashed animate-[spin_60s_linear_infinite]"></div>
        
        {/* Orbiting Node 1 */}
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-56 h-56"
        >
            <div className="absolute top-0 left-1/2 -ml-6 -mt-6">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center shadow-lg relative group">
                    <span className="text-lg font-serif text-nobel-gold italic">∀</span>
                    {/* Tooltip style label */}
                    <div className="absolute pt-2 top-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        <span className="bg-white text-stone-900 text-[10px] px-2 py-1 rounded shadow-sm border border-stone-100 font-bold uppercase tracking-wider">
                            {displayData.orbit1}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Orbit Path 2 */}
        <div className="absolute w-40 h-40 rounded-full border border-stone-300 border-dotted animate-[spin_40s_linear_infinite_reverse]"></div>

        {/* Orbiting Node 2 */}
        <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-40 h-40"
        >
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
                <div className="w-10 h-10 bg-white border border-nobel-gold rounded-full flex items-center justify-center shadow-md relative group">
                    <span className="text-lg font-serif text-stone-800 italic">⊃</span>
                     <div className="absolute pb-2 bottom-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        <span className="bg-stone-800 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold uppercase tracking-wider">
                            {displayData.orbit2}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>

      </div>
      
      {/* Legend */}
      <div className="mt-8 flex gap-8 border-t border-stone-200/50 pt-4">
          <div className="flex items-center gap-3">
              <span className="font-mono text-stone-400 text-xs">Fig 1.</span>
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{displayData.label1}</span>
          </div>
          <div className="flex items-center gap-3">
              <span className="font-mono text-stone-400 text-xs">Fig 2.</span>
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{displayData.label2}</span>
          </div>
      </div>
    </div>
  );
};

// --- PRAGMATIC CALCULUS CHART (Formerly TeacherCompetencyChart) ---
// Visual style: Abstract bar chart representing logic variables p and q
interface ChartProps {
    data?: ChartData;
}

export const TeacherCompetencyChart: React.FC<ChartProps> = ({ data }) => {
    const [view, setView] = useState<'option1' | 'option2'>('option2');
    
    const displayData = data || {
        title: "Cálculo Pragmático",
        leftLabel: "Sentença",
        rightLabel: "Significado",
        option1: "Semântica",
        option2: "Pragmática"
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-stone-900 text-stone-100 rounded-lg my-8 border border-stone-800 shadow-2xl w-full">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-2xl mb-2 text-white flex items-center gap-3">
                    <Sigma size={24} className="text-nobel-gold" />
                    {displayData.title}
                </h3>
                <div className="w-12 h-0.5 bg-stone-700 mb-6"></div>
                
                <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                    Análise da relação entre o conteúdo proposicional e a força ilocucionária.
                </p>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => setView('option1')} 
                        className={`px-4 py-3 rounded text-sm font-medium transition-all duration-200 border flex items-center justify-between group ${view === 'option1' ? 'bg-stone-100 text-stone-900 border-stone-100' : 'bg-transparent text-stone-400 border-stone-800 hover:border-stone-600'}`}
                    >
                         <div className="flex items-center gap-3">
                            <Variable size={16} /> 
                            <span>{displayData.option1}</span>
                         </div>
                         <span className="font-mono text-xs opacity-50">p</span>
                    </button>
                    <button 
                        onClick={() => setView('option2')} 
                        className={`px-4 py-3 rounded text-sm font-medium transition-all duration-200 border flex items-center justify-between group ${view === 'option2' ? 'bg-nobel-gold text-stone-900 border-nobel-gold' : 'bg-transparent text-stone-400 border-stone-800 hover:border-stone-600'}`}
                    >
                         <div className="flex items-center gap-3">
                            <Network size={16} /> 
                            <span>{displayData.option2}</span>
                         </div>
                         <span className="font-mono text-xs opacity-50">p + q</span>
                    </button>
                </div>
            </div>
            
            {/* Abstract Logic Visualization */}
            <div className="relative w-64 h-72 bg-stone-950/50 rounded border border-stone-800 p-8 flex justify-center items-end gap-6 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#57534e 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

                {/* Variable P (The Said) */}
                <div className="w-16 flex flex-col justify-end items-center h-full z-10 relative">
                    <motion.div 
                        className="w-full bg-stone-300 relative"
                        initial={{ height: '20%' }}
                        animate={{ height: view === 'option1' ? '80%' : '30%' }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <div className="absolute top-2 left-0 right-0 text-center text-stone-900 font-serif font-bold">p</div>
                    </motion.div>
                    <div className="mt-3 text-[10px] font-mono text-stone-500 uppercase tracking-widest text-center">{displayData.leftLabel}</div>
                </div>

                {/* Operator (+ / >) */}
                <div className="text-stone-600 font-mono mb-10 text-xl">{view === 'option2' ? '→' : '+'}</div>

                {/* Variable Q (The Implicated) */}
                <div className="w-16 flex flex-col justify-end items-center h-full z-10 relative">
                     <motion.div 
                        className="w-full bg-nobel-gold/90 relative shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                        initial={{ height: '0%' }}
                        animate={{ height: view === 'option1' ? '10%' : '90%' }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    >
                         <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                         <div className="absolute top-2 left-0 right-0 text-center text-stone-900 font-serif font-bold">q</div>
                    </motion.div>
                     <div className="mt-3 text-[10px] font-mono text-nobel-gold uppercase tracking-widest text-center">{displayData.rightLabel}</div>
                </div>
            </div>
        </div>
    )
}