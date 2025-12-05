/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Activity, BarChart2, Crown, Anchor, Sprout } from 'lucide-react';

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
    leftLabel: string; // e.g. "Conforto"
    rightLabel: string; // e.g. "Legado"
    option1: string; // e.g. "Mundana"
    option2: string; // e.g. "Reino"
}

// --- HISTORY TIMELINE DIAGRAM ---
interface HistoryTimelineProps {
    events?: TimelineEvent[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ events }) => {
  const [activeEra, setActiveEra] = useState<number | string>(events && events.length > 0 ? events[events.length - 1].id : 0);
  
  // Default data if none provided
  const defaultEvents = [
    { id: 0, year: "Gênesis 1:28", label: "Fundação", desc: "O Mandato Cultural: Sede fecundos e multiplicai-vos." },
    { id: 1, year: "Salmo 127", label: "Bênção", desc: "Os filhos são herança do Senhor, galardão divino." },
    { id: 2, year: "Hoje", label: "Missão", desc: "Criar uma descendência piedosa para a glória de Deus." },
  ];

  const displayEvents = events && events.length > 0 ? events : defaultEvents;

  useEffect(() => {
     if (displayEvents.length > 0) {
         setActiveEra(displayEvents[displayEvents.length - 1].id);
     }
  }, [events]); // Reset active era if events change

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-stone-800">Linha do Tempo</h3>
      <div className="relative w-full max-w-sm py-8">
         {/* Line */}
         <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-300"></div>

         <div className="space-y-8">
            {displayEvents.map((era) => (
                <div 
                    key={era.id} 
                    className={`relative pl-20 cursor-pointer transition-all duration-300 ${activeEra === era.id ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => setActiveEra(era.id)}
                >
                    <div className={`absolute left-[27px] w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${activeEra === era.id ? 'bg-nobel-gold border-stone-800 scale-125' : 'bg-white border-stone-400'}`}></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-widest text-nobel-gold">{era.year}</span>
                        <span className="font-serif text-lg text-stone-900">{era.label}</span>
                        <span className="text-sm text-stone-600 mt-1">{era.desc}</span>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- FAMILY CONNECTION DIAGRAM ---
interface FamilyDiagramProps {
    data?: OrbitData;
}

export const FamilyConnectionDiagram: React.FC<FamilyDiagramProps> = ({ data }) => {
  const [pulse, setPulse] = useState(false);

  const displayData = data || {
      center: "Cristo",
      orbit1: "Casal",
      orbit2: "Filhos",
      label1: "Aliança",
      label2: "Herança"
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-[#F5F4F0] rounded-xl border border-stone-200 my-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Central Node */}
        <div className="relative z-20 w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center border-4 border-nobel-gold shadow-lg">
            <div className="flex flex-col items-center">
                <Crown className="text-white mb-1" size={28} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{displayData.center}</span>
            </div>
        </div>

        {/* Orbiting Node 1 */}
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-full"
        >
            <div className="absolute top-0 left-1/2 -ml-8 w-16 h-16 bg-white rounded-full border border-stone-300 flex items-center justify-center shadow-sm">
                <Heart className="text-stone-400" size={24} />
                <div className="absolute -top-6 text-xs font-bold text-stone-500">{displayData.orbit1}</div>
            </div>
        </motion.div>

        {/* Orbiting Node 2 */}
        <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48"
        >
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full border border-stone-300 flex items-center justify-center shadow-sm">
                <Sprout className="text-stone-400" size={24} />
                <div className="absolute -bottom-6 text-xs font-bold text-stone-500">{displayData.orbit2}</div>
            </div>
        </motion.div>

        {/* Connecting Lines (Visual only) */}
        <div className="absolute inset-0 rounded-full border border-stone-300/50 scale-100"></div>
        <div className="absolute inset-0 rounded-full border border-stone-300/50 scale-75"></div>

      </div>
      
      <div className="mt-8 flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="w-2 h-2 bg-nobel-gold rounded-full"></span> {displayData.label1}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="w-2 h-2 bg-stone-900 rounded-full"></span> {displayData.label2}
          </div>
      </div>
    </div>
  );
};

// --- ETERNAL INVESTMENT CHART ---
interface ChartProps {
    data?: ChartData;
}

export const TeacherCompetencyChart: React.FC<ChartProps> = ({ data }) => {
    const [view, setView] = useState<'option1' | 'option2'>('option2');
    
    const displayData = data || {
        title: "Investimento Eterno",
        leftLabel: "Conforto",
        rightLabel: "Legado",
        option1: "Mundana",
        option2: "Reino"
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-stone-900 text-stone-100 rounded-xl my-8 border border-stone-800 shadow-lg">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-xl mb-2 text-nobel-gold">{displayData.title}</h3>
                <div className="flex gap-2 mt-6">
                    <button 
                        onClick={() => setView('option1')} 
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border ${view === 'option1' ? 'bg-stone-200 text-stone-900 border-stone-200' : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'}`}
                    >
                        {displayData.option1}
                    </button>
                    <button 
                        onClick={() => setView('option2')} 
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border ${view === 'option2' ? 'bg-nobel-gold text-stone-900 border-nobel-gold' : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'}`}
                    >
                        {displayData.option2}
                    </button>
                </div>
                <div className="mt-6 font-mono text-xs text-stone-500 flex items-center gap-2">
                    <BarChart2 size={14} className="text-nobel-gold" /> 
                    <span>VALOR PERCEBIDO</span>
                </div>
            </div>
            
            <div className="relative w-64 h-72 bg-stone-800/50 rounded-xl border border-stone-700/50 p-6 flex justify-around items-end">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-10">
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                </div>

                {/* Bar 1 */}
                <div className="w-20 flex flex-col justify-end items-center h-full z-10">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-5 w-full text-center text-sm font-mono text-stone-400 font-bold bg-stone-900/90 py-1 px-2 rounded backdrop-blur-sm border border-stone-700/50 shadow-sm">
                            {view === 'option1' ? 'Alto' : 'Baixo'}
                        </div>
                        <motion.div 
                            className="w-full bg-stone-600 rounded-t-md border-t border-x border-stone-500/30"
                            initial={{ height: '20%' }}
                            animate={{ height: view === 'option1' ? '85%' : '30%' }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-xs font-bold text-stone-500 uppercase tracking-wider text-center leading-none">{displayData.leftLabel}</div>
                </div>

                {/* Bar 2 */}
                <div className="w-20 flex flex-col justify-end items-center h-full z-10">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-5 w-full text-center text-sm font-mono text-nobel-gold font-bold bg-stone-900/90 py-1 px-2 rounded backdrop-blur-sm border border-nobel-gold/30 shadow-sm">
                             {view === 'option1' ? 'Baixo' : 'Eterno'}
                        </div>
                        <motion.div 
                            className="w-full bg-nobel-gold rounded-t-md shadow-[0_0_20px_rgba(197,160,89,0.25)] relative overflow-hidden"
                            initial={{ height: '20%' }}
                            animate={{ height: view === 'option1' ? '20%' : '95%' }}
                            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
                        </motion.div>
                    </div>
                     <div className="h-6 flex items-center text-xs font-bold text-nobel-gold uppercase tracking-wider text-center leading-none">{displayData.rightLabel}</div>
                </div>
            </div>
        </div>
    )
}