/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { HistoryTimeline, FamilyConnectionDiagram, TeacherCompetencyChart, TimelineEvent, OrbitData, ChartData } from './components/Diagrams';
import { BookOpen, ChevronLeft, ChevronRight, FileText, Users, GraduationCap, Quote, X, LayoutGrid, List, Database, Search, FolderOpen, MoreVertical, CheckCircle2, CloudUpload, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown, Edit3, Settings, Save, Minus, GripVertical, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration ---
// Credenciais atualizadas com base no print fornecido
const supabaseUrl = 'https://avwbeshjaskfdsclftzu.supabase.co';
const supabaseKey = 'sb_publishable_yP5yPUYfXHNAigJiT7di9w_tfM8RcMu'; 

const supabase = createClient(supabaseUrl, supabaseKey);

// --- SQL SETUP SCRIPT ---
const SETUP_SQL_SCRIPT = `
-- 1. Criação da Tabela
create table if not exists public.presentations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  author text,
  date text,
  slides numeric,
  content jsonb,
  meta jsonb,
  active boolean default false
);

-- 2. Habilitar Segurança (RLS)
alter table public.presentations enable row level security;

-- 3. Políticas de Acesso Público
create policy "Allow public read access" on public.presentations for select to anon using (true);
create policy "Allow public insert access" on public.presentations for insert to anon with check (true);
create policy "Allow public update access" on public.presentations for update to anon using (true);
`;

type SlideLayoutType = 'standard' | 'timeline' | 'dark-orbit' | 'chart' | 'quote';

interface SlideContent {
    chapter: string;
    title: string;
    text: string[];
    highlight?: string;
    timelineEvents?: TimelineEvent[];
    diagramData?: OrbitData;
    chartData?: ChartData;
}

interface SlideData {
    id: string;
    layout: SlideLayoutType;
    content: SlideContent;
}

interface PresentationMetadata {
    title: string;
    subtitle: string;
    author: string;
}

interface Presentation {
    id: string;
    title: string;
    author: string;
    date: string;
    slides: number;
    active: boolean;
    content?: SlideData[];
    meta?: PresentationMetadata;
}

const StandardLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
  <div className="w-full h-full flex items-center justify-center bg-white p-6">
    <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
      <div className="md:col-span-4">
        <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">{content.chapter}</div>
        <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight text-stone-900">{content.title}</h2>
        <div className="w-16 h-1 bg-nobel-gold mb-6"></div>
        {content.highlight && (
            <div className="mt-8 p-6 bg-stone-50 border-l-4 border-nobel-gold text-stone-700 italic text-lg text-justify">
                "{content.highlight}"
            </div>
        )}
      </div>
      <div className="md:col-span-8 text-2xl md:text-3xl text-stone-700 leading-relaxed space-y-8 font-light">
        {content.text.map((paragraph, idx) => (
            <p key={idx} className="text-justify">{paragraph}</p>
        ))}
      </div>
    </div>
  </div>
);

const TimelineLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
  <div className="w-full h-full flex items-center justify-center bg-white border-t border-stone-100 p-6">
      <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-200">
                      <BookOpen size={14}/> {content.chapter}
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">{content.title}</h2>
                  <div className="text-2xl md:text-3xl text-stone-700 mb-6 leading-relaxed space-y-6 font-light">
                    {content.text.map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                    ))}
                  </div>
              </div>
              <div>
                  <HistoryTimeline events={content.timelineEvents} />
              </div>
          </div>
      </div>
  </div>
);

const DarkOrbitLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
  <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-100 overflow-hidden relative p-6">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-stone-600 blur-[100px] absolute top-[-100px] left-[-100px]"></div>
          <div className="w-96 h-96 rounded-full bg-nobel-gold blur-[100px] absolute bottom-[-100px] right-[-100px]"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1 flex justify-center">
                  <FamilyConnectionDiagram data={content.diagramData} />
               </div>
               <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-nobel-gold text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-700">
                      {content.chapter}
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">{content.title}</h2>
                  <div className="text-2xl md:text-3xl text-stone-300 mb-6 leading-relaxed space-y-6 font-light">
                     {content.text.map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                    ))}
                  </div>
               </div>
          </div>
      </div>
  </div>
);

const ChartLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
    <div className="w-full h-full flex items-center justify-center bg-[#F9F8F4] p-6">
        <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center mb-12">
                <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">{content.chapter}</div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">{content.title}</h2>
                <div className="text-2xl md:text-3xl text-stone-700 leading-relaxed text-justify max-w-4xl mx-auto space-y-6 font-light">
                     {content.text.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
            <div className="max-w-3xl mx-auto">
                <TeacherCompetencyChart data={content.chartData} />
            </div>
        </div>
    </div>
);

const QuoteLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
  <div className="w-full h-full flex items-center justify-center bg-white border-t border-stone-200 p-6">
       <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 relative">
              <div className="aspect-square bg-[#F5F4F0] rounded-xl overflow-hidden relative border border-stone-200 shadow-inner flex items-center justify-center p-8">
                   <div className="text-center">
                      <Quote size={80} className="mx-auto text-nobel-gold mb-6" strokeWidth={1} />
                      {content.highlight && <p className="font-serif italic text-stone-600 text-2xl md:text-3xl text-center leading-snug">"{content.highlight}"</p>}
                   </div>
              </div>
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">{content.chapter}</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 text-stone-900">{content.title}</h2>
              <div className="text-2xl md:text-3xl text-stone-700 mb-6 leading-relaxed space-y-6 font-light">
                   {content.text.map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                    ))}
              </div>
          </div>
       </div>
  </div>
);

const initialSlidesData: SlideData[] = [
    {
        id: '1',
        layout: 'standard',
        content: {
            chapter: 'Introdução',
            title: 'Formalistas vs. Informalistas',
            text: [
                "Há uma divergência clássica na lógica filosófica entre os formalistas e os informalistas sobre a relação entre os instrumentos da lógica formal (como ¬, ∧, ∨, ∀, ∃) e suas contrapartes na linguagem natural (não, e, ou, todo, alguns).",
                "Os formalistas argumentam que a linguagem natural é imperfeita e incoerente, enquanto os instrumentos formais oferecem precisão. Os informalistas, por outro lado, defendem que a linguagem natural tem sua própria lógica complexa que serve a propósitos além da ciência."
            ]
        }
    }
];

const HeroSlide: React.FC<{ formattedDate: string; meta: PresentationMetadata }> = ({ formattedDate, meta }) => (
  <header className="relative h-full flex items-center justify-center overflow-hidden">
    <HeroScene />
    <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.92)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)]" />
    <div className="relative z-10 container mx-auto px-6 text-center">
      <div className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30">
        {meta.author} • {formattedDate}
      </div>
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-stone-900 drop-shadow-sm">
        {meta.title} <br/><span className="italic font-normal text-stone-600 text-2xl md:text-4xl block mt-4">{meta.subtitle}</span>
      </h1>
      <p className="max-w-3xl mx-auto text-2xl md:text-3xl text-stone-700 font-light leading-relaxed mb-12">
        {meta.subtitle}
      </p>
    </div>
  </header>
);

const BibliographySlidePart1 = () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F9F8F4] p-6 md:p-16">
         <div className="container mx-auto max-w-5xl h-full flex flex-col pt-10">
              <h2 className="font-sans text-4xl text-stone-600 uppercase tracking-widest mb-10 border-b border-stone-300 pb-4 text-left">
                  Bibliografia Principal
              </h2>
              <div className="space-y-8 pr-4">
                  <div className="flex items-start gap-8 group">
                      <div className="mt-1 shrink-0 text-stone-400">
                          <FileText size={40} strokeWidth={1.2} />
                      </div>
                      <div className="flex-1">
                          <p className="text-[#6B4C9A] font-medium text-lg tracking-wide mb-1">GRICE, H.P.</p>
                          <p className="text-stone-800 font-serif font-bold italic text-2xl leading-snug mb-1">Logic and Conversation.</p>
                          <p className="text-[#6B4C9A] text-lg opacity-90">In: Syntax and Semantics, Vol 3. Academic Press, 1975.</p>
                      </div>
                  </div>
              </div>
         </div>
    </div>
);

const BibliographySlidePart2 = () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F9F8F4] p-6 md:p-16">
         <div className="container mx-auto max-w-5xl h-full flex flex-col pt-10">
              <h2 className="font-sans text-4xl text-stone-600 uppercase tracking-widest mb-10 border-b border-stone-300 pb-4 text-left">
                  Bibliografia Complementar
              </h2>
              <div className="space-y-8 pr-4">
                  <div className="flex items-start gap-8 group">
                      <div className="mt-1 shrink-0 text-stone-400">
                          <FileText size={40} strokeWidth={1.2} />
                      </div>
                      <div className="flex-1">
                          <p className="text-[#6B4C9A] font-medium text-lg tracking-wide mb-1">LEVINSON, S.C.</p>
                          <p className="text-stone-800 font-serif font-bold italic text-2xl leading-snug mb-1">Pragmatics.</p>
                          <p className="text-[#6B4C9A] text-lg opacity-90">Cambridge University Press, 1983.</p>
                      </div>
                  </div>
              </div>
         </div>
    </div>
);

const FooterSlide: React.FC<{ meta: PresentationMetadata }> = ({ meta }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-6">
        <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-4xl mb-4">{meta.title}</div>
            <p className="text-xl">"{meta.subtitle}"</p>
        </div>
        <div className="text-center mt-16 text-sm text-stone-600">
            Baseado no trabalho de H.P. Grice apresentado por {meta.author}.
        </div>
    </div>
);

const AdminPanel: React.FC<{ 
    currentSlides: SlideData[], 
    setSlides: (slides: SlideData[]) => void,
    meta: PresentationMetadata,
    setMeta: (meta: PresentationMetadata) => void,
    totalSlides: number, 
    close: () => void,
    activePresentationId: string | null,
    setActivePresentationId: (id: string | null) => void
}> = ({ currentSlides, setSlides, meta, setMeta, totalSlides, close, activePresentationId, setActivePresentationId }) => {
    
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'library' | 'editor'>('library');

    // Melhoria robusta no tratamento de erros para evitar [object Object]
    const handleSupabaseError = (err: any, action: string) => {
        console.error(`Erro detalhado (${action}):`, err);
        
        let msg = "Erro desconhecido";
        
        if (typeof err === 'string') {
            msg = err;
        } else if (err && typeof err === 'object') {
            msg = err.message || err.error_description || err.msg || err.code || "Erro sem mensagem definida";
            if (err.status) msg = `Status ${err.status}: ${msg}`;
            if (err.details) msg += `\nDetalhes: ${err.details}`;
            if (err.hint) msg += `\nDica: ${err.hint}`;
        }
        
        if (msg.includes('[object Object]')) {
             try {
                 msg = "Informação do objeto: " + JSON.stringify(err);
             } catch (e) {
                 msg = "Erro complexo - Verifique o console do navegador (F12) para detalhes técnicos.";
             }
        }

        alert(`Falha ao ${action}:\n\n${msg}`);
    };

    const fetchPresentations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                 const mappedData = data.map((item: any) => ({
                     id: item.id,
                     title: item.title,
                     author: item.author,
                     date: item.date || new Date(item.created_at).toLocaleDateString('pt-BR'),
                     slides: item.slides || 0,
                     active: item.id === activePresentationId
                 }));
                 setPresentations(mappedData);
            }
        } catch (err: any) {
            handleSupabaseError(err, "buscar apresentações");
        } finally {
            setLoading(false);
        }
    };

    const loadPresentation = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                if (data.content) setSlides(data.content);
                if (data.meta) setMeta(data.meta);
                setActivePresentationId(id);
                alert('Apresentação carregada com sucesso!');
                setActiveTab('editor'); 
            }
        } catch (err: any) {
             handleSupabaseError(err, "carregar apresentação");
        } finally {
            setLoading(false);
        }
    };

    const saveCurrentPresentation = async () => {
        setLoading(true);
        try {
            const payload = {
                title: meta.title,
                author: meta.author,
                date: new Date().toLocaleDateString('pt-BR'),
                slides: totalSlides,
                content: currentSlides,
                meta: meta,
                active: true,
            };

            if (activePresentationId) {
                const { error } = await supabase
                    .from('presentations')
                    .update(payload)
                    .eq('id', activePresentationId);
                if (error) throw error;
                alert("Apresentação atualizada!");
            } else {
                const { data, error } = await supabase
                    .from('presentations')
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                if (data) setActivePresentationId(data.id);
                alert("Apresentação salva!");
            }
            fetchPresentations();
        } catch (err: any) {
            handleSupabaseError(err, "salvar apresentação");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresentations();
    }, [activePresentationId]);

    const updateSlide = (index: number, field: keyof SlideContent | 'layout', value: any) => {
        const newSlides = [...currentSlides];
        if (field === 'layout') {
            newSlides[index].layout = value;
        } else {
            newSlides[index].content = { ...newSlides[index].content, [field]: value };
        }
        setSlides(newSlides);
    };

    const updateTextParagraph = (slideIndex: number, pIndex: number, text: string) => {
         const newSlides = [...currentSlides];
         newSlides[slideIndex].content.text[pIndex] = text;
         setSlides(newSlides);
    };

    const updateTimelineEvent = (slideIndex: number, eventIndex: number, field: keyof TimelineEvent, value: string) => {
        const newSlides = [...currentSlides];
        const events = newSlides[slideIndex].content.timelineEvents || [];
        events[eventIndex] = { ...events[eventIndex], [field]: value };
        newSlides[slideIndex].content.timelineEvents = events;
        setSlides(newSlides);
    };

    const addTimelineEvent = (slideIndex: number) => {
        const newSlides = [...currentSlides];
        const events = newSlides[slideIndex].content.timelineEvents || [];
        const step = events.length + 1;
        newSlides[slideIndex].content.timelineEvents = [...events, { id: Date.now(), year: `Step ${step}`, label: 'Nova Premissa', desc: 'Descrição...' }];
        setSlides(newSlides);
    };

    const removeTimelineEvent = (slideIndex: number, eventIndex: number) => {
        const newSlides = [...currentSlides];
        const events = newSlides[slideIndex].content.timelineEvents || [];
        newSlides[slideIndex].content.timelineEvents = events.filter((_, i) => i !== eventIndex);
        setSlides(newSlides);
    };

    const updateDiagramData = (slideIndex: number, field: keyof OrbitData, value: string) => {
        const newSlides = [...currentSlides];
        newSlides[slideIndex].content.diagramData = {
            ...(newSlides[slideIndex].content.diagramData || { center: 'Conceito', orbit1: 'A', orbit2: 'B', label1: 'L1', label2: 'L2' }),
            [field]: value
        };
        setSlides(newSlides);
    };

    const updateChartData = (slideIndex: number, field: keyof ChartData, value: string) => {
         const newSlides = [...currentSlides];
         newSlides[slideIndex].content.chartData = {
             ...(newSlides[slideIndex].content.chartData || { title: 'Lógica', leftLabel: 'P', rightLabel: 'Q', option1: 'A', option2: 'B' }),
             [field]: value
         };
         setSlides(newSlides);
    };

    const addSlide = () => {
        const newSlide: SlideData = {
            id: Math.random().toString(36).substr(2, 9),
            layout: 'standard',
            content: { chapter: 'Novo Capítulo', title: 'Slide', text: ['Seu conteúdo...'] }
        };
        setSlides([...currentSlides, newSlide]);
    };

    const removeSlide = (index: number) => {
        setSlides(currentSlides.filter((_, i) => i !== index));
    };

    const moveSlide = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= currentSlides.length) return;
        const newSlides = [...currentSlides];
        [newSlides[index], newSlides[index + direction]] = [newSlides[index + direction], newSlides[index]];
        setSlides(newSlides);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#F9F8F4] w-full max-w-6xl h-[90vh] rounded-xl border border-nobel-gold shadow-2xl flex flex-col overflow-hidden text-stone-800">
                <div className="p-4 border-b border-stone-300 flex justify-between items-center bg-white/80">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Settings className="text-nobel-gold" size={24} />
                            <h2 className="text-xl font-serif text-stone-900 font-bold">Painel de Controle</h2>
                        </div>
                        <div className="flex bg-stone-200 rounded-lg p-1 gap-1">
                            <button onClick={() => setActiveTab('library')} className={`px-4 py-1.5 rounded-md text-sm transition-all ${activeTab === 'library' ? 'bg-white shadow-sm' : 'text-stone-500'}`}>Biblioteca</button>
                            <button onClick={() => setActiveTab('editor')} className={`px-4 py-1.5 rounded-md text-sm transition-all ${activeTab === 'editor' ? 'bg-white shadow-sm' : 'text-stone-500'}`}>Editor</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={saveCurrentPresentation} className="flex items-center gap-2 px-4 py-2 bg-stone-700 text-white text-sm rounded-full hover:bg-stone-900">
                            {loading ? <RefreshCw size={16} className="animate-spin"/> : <Save size={16} />}
                            <span>Salvar</span>
                        </button>
                        <button onClick={close} className="text-stone-400 hover:text-stone-800 bg-stone-200/50 p-2 rounded-full"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === 'library' ? (
                         <div className="h-full overflow-y-auto p-8">
                            <div className="grid grid-cols-1 gap-4">
                                {presentations.length === 0 && !loading && (
                                    <div className="text-center py-20 text-stone-400">Nenhuma apresentação encontrada.</div>
                                )}
                                {presentations.map((pres) => (
                                    <div key={pres.id} className={`flex items-center justify-between p-6 rounded-lg border bg-white shadow-sm transition-all ${pres.active ? 'border-nobel-gold' : 'border-stone-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <FileText size={24} className="text-stone-400" />
                                            <div>
                                                <h3 className="text-lg font-serif font-bold">{pres.title}</h3>
                                                <div className="text-xs text-stone-500">{pres.author} • {pres.date}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => loadPresentation(pres.id)} className="px-6 py-2 border border-stone-300 rounded-full text-sm hover:bg-stone-50">Abrir</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col md:flex-row overflow-hidden">
                            <div className="w-80 border-r p-6 overflow-y-auto bg-white">
                                <h3 className="text-xs font-bold text-stone-400 uppercase mb-4 tracking-widest">Metadados</h3>
                                <div className="space-y-4">
                                    <input value={meta.title} onChange={e => setMeta({...meta, title: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm outline-none focus:ring-1 focus:ring-nobel-gold" placeholder="Título" />
                                    <input value={meta.subtitle} onChange={e => setMeta({...meta, subtitle: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm outline-none focus:ring-1 focus:ring-nobel-gold" placeholder="Subtítulo" />
                                    <input value={meta.author} onChange={e => setMeta({...meta, author: e.target.value})} className="w-full p-2 border border-stone-200 rounded text-sm outline-none focus:ring-1 focus:ring-nobel-gold" placeholder="Autor" />
                                </div>
                                <button onClick={addSlide} className="w-full py-3 mt-8 bg-stone-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"><Plus size={18} /> Novo Slide</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
                                {currentSlides.map((slide, idx) => (
                                    <div key={slide.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-stone-50 p-3 flex justify-between items-center border-b border-stone-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                                                <select value={slide.layout} onChange={e => updateSlide(idx, 'layout', e.target.value)} className="text-xs border border-stone-300 rounded px-2 py-1 outline-none">
                                                    <option value="standard">Standard</option>
                                                    <option value="timeline">Timeline</option>
                                                    <option value="dark-orbit">Dark Orbit</option>
                                                    <option value="chart">Chart</option>
                                                    <option value="quote">Quote</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => moveSlide(idx, -1)} className="p-1.5 hover:bg-stone-200 rounded text-stone-400"><ArrowUp size={16}/></button>
                                                <button onClick={() => moveSlide(idx, 1)} className="p-1.5 hover:bg-stone-200 rounded text-stone-400"><ArrowDown size={16}/></button>
                                                <button onClick={() => removeSlide(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <input value={slide.content.chapter} onChange={e => updateSlide(idx, 'chapter', e.target.value)} className="w-full p-2 border border-stone-100 rounded text-xs bg-stone-50/30" placeholder="Capítulo" />
                                                <input value={slide.content.title} onChange={e => updateSlide(idx, 'title', e.target.value)} className="w-full p-2 border border-stone-200 rounded text-sm font-bold" placeholder="Título" />
                                                
                                                {slide.layout === 'timeline' && (
                                                    <div className="p-3 bg-white rounded border border-stone-200 shadow-inner">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-[10px] font-bold uppercase text-stone-500">Etapas Lógicas</span>
                                                            <button onClick={() => addTimelineEvent(idx)} className="p-1 bg-stone-100 rounded-full hover:bg-stone-200"><Plus size={14}/></button>
                                                        </div>
                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                            {slide.content.timelineEvents?.map((ev, eIdx) => (
                                                                <div key={ev.id} className="flex gap-2 items-start bg-stone-50 p-2 rounded">
                                                                    <input value={ev.year} onChange={e => updateTimelineEvent(idx, eIdx, 'year', e.target.value)} className="w-16 p-1 text-[10px] border rounded" />
                                                                    <input value={ev.label} onChange={e => updateTimelineEvent(idx, eIdx, 'label', e.target.value)} className="flex-1 p-1 text-[10px] border rounded" />
                                                                    <button onClick={() => removeTimelineEvent(idx, eIdx)} className="text-red-300 p-1"><Trash2 size={12}/></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {slide.content.text.map((p, pIdx) => (
                                                    <textarea key={pIdx} value={p} onChange={e => updateTextParagraph(idx, pIdx, e.target.value)} className="w-full p-3 border border-stone-200 rounded text-xs min-h-[120px]" placeholder="Conteúdo do slide..." />
                                                ))}
                                                {slide.layout === 'quote' && (
                                                    <textarea value={slide.content.highlight || ''} onChange={e => updateSlide(idx, 'highlight', e.target.value)} className="w-full p-3 border border-stone-200 rounded text-xs italic bg-stone-50" placeholder="Citação em destaque..." />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(initialSlidesData);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activePresentationId, setActivePresentationId] = useState<string | null>(null);
  const [meta, setMeta] = useState<PresentationMetadata>({
      title: "Lógica e Conversação",
      subtitle: "H.P. Grice e o Princípio da Cooperação",
      author: "Prof. Abraão"
  });

  const totalSlides = slides.length + 4;

  const nextSlide = () => { if (currentSlideIndex < totalSlides - 1) setCurrentSlideIndex(prev => prev + 1); };
  const prevSlide = () => { if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (showAdmin) return;
        if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'a' && e.ctrlKey) { e.preventDefault(); setShowAdmin(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, totalSlides, showAdmin]);

  const renderSlide = () => {
      if (currentSlideIndex === 0) return <HeroSlide formattedDate={new Date().toLocaleDateString('pt-BR')} meta={meta} />;
      const contentIndex = currentSlideIndex - 1;
      if (contentIndex < slides.length) {
          const slide = slides[contentIndex];
          switch (slide.layout) {
              case 'standard': return <StandardLayout content={slide.content} />;
              case 'timeline': return <TimelineLayout content={slide.content} />;
              case 'dark-orbit': return <DarkOrbitLayout content={slide.content} />;
              case 'chart': return <ChartLayout content={slide.content} />;
              case 'quote': return <QuoteLayout content={slide.content} />;
              default: return <StandardLayout content={slide.content} />;
          }
      }
      const endingIndex = contentIndex - slides.length;
      switch (endingIndex) {
          case 0: return <BibliographySlidePart1 />;
          case 1: return <BibliographySlidePart2 />;
          case 2: return <FooterSlide meta={meta} />;
          default: return null;
      }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-stone-100 relative">
      <AnimatePresence mode="wait">
        <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
            {renderSlide()}
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 right-6 flex gap-3 z-50">
        <div className="bg-white/90 border rounded-full shadow-xl p-1.5 flex items-center gap-1">
            <button onClick={() => setShowAdmin(true)} className="p-2 text-stone-500 hover:text-stone-900" title="Configurações (Ctrl+A)"><Settings size={18} /></button>
            <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="p-2 disabled:opacity-30"><ChevronLeft size={20} /></button>
            <span className="font-mono text-xs w-12 text-center">{currentSlideIndex + 1}/{totalSlides}</span>
            <button onClick={nextSlide} disabled={currentSlideIndex === totalSlides - 1} className="p-2 disabled:opacity-30"><ChevronRight size={20} /></button>
        </div>
      </div>
      {showAdmin && <AdminPanel currentSlides={slides} setSlides={setSlides} meta={meta} setMeta={setMeta} totalSlides={slides.length} close={() => setShowAdmin(false)} activePresentationId={activePresentationId} setActivePresentationId={setActivePresentationId} />}
    </div>
  );
};

export default App;