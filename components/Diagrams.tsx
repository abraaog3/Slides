/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, School, Heart, BookOpen, Activity, BarChart2 } from 'lucide-react';

// --- HISTORY TIMELINE DIAGRAM ---
export const HistoryTimeline: React.FC = () => {
  const [activeEra, setActiveEra] = useState(2);

  const eras = [
    { id: 0, year: "Antiguidade", label: "Exclusão", desc: "Pessoas sacrificadas ou abandonadas." },
    { id: 1, year: "1948", label: "Direitos Humanos", desc: "Declaração Universal da ONU." },
    { id: 2, year: "2002", label: "Diretrizes Nacionais", desc: "Foco na adaptação e inclusão." },
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-stone-800">Linha do Tempo</h3>
      <p className="text-sm text-stone-500 mb-6 text-center max-w-md">
        A evolução do olhar da sociedade sobre a pessoa com deficiência.
      </p>
      
      <div className="relative w-full max-w-sm py-8">
         {/* Line */}
         <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-300"></div>

         <div className="space-y-8">
            {eras.map((era) => (
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
export const FamilyConnectionDiagram: React.FC = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-[#F5F4F0] rounded-xl border border-stone-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-stone-900">A Tríade da Inclusão</h3>
      <p className="text-sm text-stone-600 mb-6 text-center max-w-md">
        O aluno se desenvolve plenamente quando há harmonia entre os pilares.
      </p>

      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Central Node: Student */}
        <div className="relative z-20 w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center border-4 border-nobel-gold shadow-lg">
            <Users className="text-white" size={32} />
            <div className="absolute -bottom-8 text-xs font-bold uppercase tracking-wider text-stone-600">Aluno</div>
        </div>

        {/* Orbiting Node: Family */}
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-full"
        >
            <div className="absolute top-0 left-1/2 -ml-8 w-16 h-16 bg-white rounded-full border border-stone-300 flex items-center justify-center shadow-sm">
                <Heart className="text-stone-400" size={24} />
                <div className="absolute -top-6 text-xs font-bold text-stone-500">Família</div>
            </div>
        </motion.div>

        {/* Orbiting Node: School */}
        <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48"
        >
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full border border-stone-300 flex items-center justify-center shadow-sm">
                <School className="text-stone-400" size={24} />
                <div className="absolute -bottom-6 text-xs font-bold text-stone-500">Escola</div>
            </div>
        </motion.div>

        {/* Connecting Lines (Visual only) */}
        <div className="absolute inset-0 rounded-full border border-stone-300/50 scale-100"></div>
        <div className="absolute inset-0 rounded-full border border-stone-300/50 scale-75"></div>

      </div>
      
      <div className="mt-8 flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="w-2 h-2 bg-nobel-gold rounded-full"></span> Apoio
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="w-2 h-2 bg-stone-900 rounded-full"></span> Desenvolvimento
          </div>
      </div>
    </div>
  );
};

// --- TEACHER COMPETENCY CHART ---
export const TeacherCompetencyChart: React.FC = () => {
    const [view, setView] = useState<'demand' | 'training'>('demand');
    
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-stone-900 text-stone-100 rounded-xl my-8 border border-stone-800 shadow-lg">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-xl mb-2 text-nobel-gold">O Desafio da Formação</h3>
                <p className="text-stone-400 text-sm mb-4 leading-relaxed">
                    A legislação exige especialização, mas a realidade escolar ainda enfrenta a carência de profissionais capacitados para a diversidade.
                </p>
                <div className="flex gap-2 mt-6">
                    <button 
                        onClick={() => setView('demand')} 
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border ${view === 'demand' ? 'bg-nobel-gold text-stone-900 border-nobel-gold' : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'}`}
                    >
                        Demanda
                    </button>
                    <button 
                        onClick={() => setView('training')} 
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border ${view === 'training' ? 'bg-nobel-gold text-stone-900 border-nobel-gold' : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'}`}
                    >
                        Capacitação
                    </button>
                </div>
                <div className="mt-6 font-mono text-xs text-stone-500 flex items-center gap-2">
                    <BarChart2 size={14} className="text-nobel-gold" /> 
                    <span>NÍVEL DE PREPARO (ESTIMATIVA)</span>
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

                {/* Bar 1: General Knowledge */}
                <div className="w-20 flex flex-col justify-end items-center h-full z-10">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-5 w-full text-center text-sm font-mono text-stone-400 font-bold bg-stone-900/90 py-1 px-2 rounded backdrop-blur-sm border border-stone-700/50 shadow-sm">
                            {view === 'demand' ? 'Alta' : 'Média'}
                        </div>
                        <motion.div 
                            className="w-full bg-stone-600 rounded-t-md border-t border-x border-stone-500/30"
                            initial={{ height: '20%' }}
                            animate={{ height: view === 'demand' ? '85%' : '50%' }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-xs font-bold text-stone-500 uppercase tracking-wider">Geral</div>
                </div>

                {/* Bar 2: Specialized Knowledge */}
                <div className="w-20 flex flex-col justify-end items-center h-full z-10">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-5 w-full text-center text-sm font-mono text-nobel-gold font-bold bg-stone-900/90 py-1 px-2 rounded backdrop-blur-sm border border-nobel-gold/30 shadow-sm">
                             {view === 'demand' ? 'Crítica' : 'Baixa'}
                        </div>
                        <motion.div 
                            className="w-full bg-nobel-gold rounded-t-md shadow-[0_0_20px_rgba(197,160,89,0.25)] relative overflow-hidden"
                            initial={{ height: '20%' }}
                            animate={{ height: view === 'demand' ? '95%' : '30%' }}
                            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
                        </motion.div>
                    </div>
                     <div className="h-6 flex items-center text-xs font-bold text-nobel-gold uppercase tracking-wider">Espec.</div>
                </div>
            </div>
        </div>
    )
}