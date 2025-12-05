/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { HistoryTimeline, FamilyConnectionDiagram, TeacherCompetencyChart, TimelineEvent, OrbitData, ChartData } from './components/Diagrams';
import { BookOpen, ChevronLeft, ChevronRight, FileText, Users, GraduationCap, Quote, X, LayoutGrid, List, Database, Search, FolderOpen, MoreVertical, CheckCircle2, CloudUpload, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown, Edit3, Settings, Save, Minus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration ---
const supabaseUrl = 'https://lbtaszuuwybbcuuzusdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxidGFzenV1d3liYmN1dXp1c2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzUyOTYsImV4cCI6MjA3OTc1MTI5Nn0.5MTOWx_OkvCcUZi0pAPaq6r2hcjyxYtiqEH_xPJp1wU';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- SQL SETUP SCRIPT ---
const SETUP_SQL_SCRIPT = `
-- ==========================================================
-- COPIE E EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- ==========================================================

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

-- 1.1 Migração: Garantir que a coluna 'meta' existe (para tabelas antigas)
alter table public.presentations add column if not exists meta jsonb;

-- 2. Habilitar Segurança a Nível de Linha (RLS)
alter table public.presentations enable row level security;

-- 3. Políticas de Acesso (CRUD para usuários anônimos - Demo)

-- Permitir leitura (SELECT)
create policy "Allow public read access"
on public.presentations for select
to anon
using (true);

-- Permitir inserção (INSERT)
create policy "Allow public insert access"
on public.presentations for insert
to anon
with check (true);

-- Permitir atualização (UPDATE)
create policy "Allow public update access"
on public.presentations for update
to anon
using (true);
`;

// --- Types & Interfaces ---

type SlideLayoutType = 'standard' | 'timeline' | 'dark-orbit' | 'chart' | 'quote';

interface SlideContent {
    chapter: string;
    title: string;
    text: string[];
    highlight?: string;
    // Optional data for specific layouts
    timelineEvents?: TimelineEvent[];
    diagramData?: OrbitData;
    chartData?: ChartData;
}

interface SlideData {
    id: string; // Added ID for key management in lists
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

// --- Reusable Layout Components ---

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
      <div className="md:col-span-8 text-xl md:text-2xl text-stone-700 leading-relaxed space-y-8 font-light">
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
                  <div className="text-xl md:text-2xl text-stone-700 mb-6 leading-relaxed space-y-6 font-light">
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
                  <div className="text-xl md:text-2xl text-stone-300 mb-6 leading-relaxed space-y-6 font-light">
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
                <div className="text-xl md:text-2xl text-stone-700 leading-relaxed text-justify max-w-4xl mx-auto space-y-6 font-light">
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
              <div className="text-xl md:text-2xl text-stone-700 mb-6 leading-relaxed space-y-6 font-light">
                   {content.text.map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                    ))}
              </div>
          </div>
       </div>
  </div>
);

// --- Slide Data Generation (Pure JSON compatible) ---

const initialSlidesData: SlideData[] = [
    {
        id: '1',
        layout: 'standard',
        content: {
            chapter: 'Introdução',
            title: 'Propósito Divino para o Casamento',
            text: [
                "Em uma cultura que redefine o casamento como um contrato para a felicidade individual, a Escritura nos chama de volta à sua origem e propósito. Este estudo examina o casamento não como uma invenção social, mas como uma instituição divina com fins teleológicos claros.",
                "Na teologia reformada, o casamento é a 'piscina seminal' da Igreja, o principal meio pelo qual Deus levanta uma descendência piedosa para Si mesmo, cumprindo Suas promessas pactuais de Gênesis a Apocalipse."
            ]
        }
    },
    {
        id: '2',
        layout: 'quote',
        content: {
            chapter: 'Introdução',
            title: 'Mais que Companhia',
            highlight: 'E se o propósito principal do seu casamento não for a sua felicidade, mas a expansão do Reino de Deus através da sua família?',
            text: [
                "Frequentemente buscamos no casamento a satisfação pessoal e a realização emocional. Embora sejam benefícios da união, não são seu fim último.",
                "Somos comissionados divinamente para uma tarefa maior que nós mesmos: a construção de um legado de fé que atravessa gerações e glorifica o Criador."
            ]
        }
    },
    {
        id: '3',
        layout: 'standard',
        content: {
            chapter: 'Ponto 1: Teleologia',
            title: 'A Ilegitimidade da Intenção Contra a Vida',
            text: [
                "O profeta Malaquias (2:15) estabelece a causa final da união de 'uma só carne': 'Ele buscava uma descendência para Deus'. Um casamento que decide, a priori e permanentemente, não ter filhos, atenta contra a própria definição do pacto.",
                "É um casamento que deseja os benefícios da união, como prazer e companhia, mas rejeita o seu fim primário, a frutificação, contradizendo a natureza pactual estabelecida por Deus."
            ]
        }
    },
    {
        id: '4',
        layout: 'dark-orbit',
        content: {
            chapter: 'Ponto 1: Teleologia',
            title: 'O Imperativo Criacional',
            text: [
                "'Frutificai e multiplicai-vos' (Gênesis 1:28) é o primeiro mandamento da Bíblia, o Mandato Cultural. Este mandamento foi dado antes da Queda, indicando que a procriação é parte da função do homem como Imagem de Deus.",
                "Negar a procriação é, em essência, negar a expansão da Imagem de Deus no mundo. Nossa vocação é encher a terra com reflexos da glória divina através de nossa descendência."
            ],
            diagramData: {
                center: "Cristo",
                orbit1: "Casal",
                orbit2: "Filhos",
                label1: "Aliança",
                label2: "Herança"
            }
        }
    },
    {
        id: '5',
        layout: 'quote',
        content: {
            chapter: 'Ponto 1: Teleologia',
            title: 'Bênção e Maldição',
            highlight: 'Por que transformaríamos voluntariamente uma bênção (Salmo 127) em um fardo a ser evitado?',
            text: [
                "Nas Escrituras, a madre aberta é invariavelmente descrita como bênção (Sl 127:3). A esterilidade, por outro lado, é frequentemente vista como uma maldição ou juízo (Oséias 9:14).",
                "Examine seu coração. Sua visão de casamento está alinhada com o desígnio do Criador ou com o dogma da autonomia do mundo? O propósito de Deus deve prevalecer sobre preferências pessoais."
            ]
        }
    },
    {
        id: '6',
        layout: 'standard',
        content: {
            chapter: 'Ponto 2: Ética Cristã',
            title: 'Intervenção e Mordomia',
            text: [
                "Se é lícito usar a medicina para restaurar a fertilidade, reconhecemos que a biologia é uma área de mordomia. Por coerência, a regulação da fertilidade para espaçamento não é intrinsecamente pecaminosa.",
                "O controle não deve ser para evitar a vida permanentemente por egoísmo, mas para gerenciar a família com prudência e responsabilidade diante de Deus."
            ]
        }
    },
    {
        id: '7',
        layout: 'timeline',
        content: {
            chapter: 'Ponto 2: Ética Cristã',
            title: 'Limites Legítimos',
            text: [
                "A Escritura ordena: 'Se alguém não tem cuidado dos seus... negou a fé' (1 Timóteo 5:8). Razões legítimas para o espaçamento incluem risco grave à vida da mãe, incapacidade severa de sustento ou crises de saúde.",
                "A paternidade exige responsabilidade. Não é um ato de fé cega, mas de mordomia consciente, onde cada decisão visa o bem-estar e a educação cristã da prole."
            ],
            timelineEvents: [
                { id: 0, year: "Gênesis 1:28", label: "Fundação", desc: "O Mandato Cultural: Sede fecundos e multiplicai-vos." },
                { id: 1, year: "Salmo 127", label: "Bênção", desc: "Os filhos são herança do Senhor, galardão divino." },
                { id: 2, year: "Hoje", label: "Missão", desc: "Criar uma descendência piedosa para a glória de Deus." }
            ]
        }
    },
    {
        id: '8',
        layout: 'quote',
        content: {
            chapter: 'Ponto 2: Ética Cristã',
            title: 'O Limite Absoluto',
            highlight: 'Devemos distinguir claramente entre contracepção e aborto. Métodos abortivos são inaceitáveis.',
            text: [
                "Métodos que impedem a nidação do embrião são microabortivos e violam o mandamento 'Não Matarás'. Eles atentam contra uma vida humana já concebida à imagem de Deus.",
                "Busque sabedoria. Suas decisões são motivadas pela mordomia fiel e desejo de glorificar a Deus, ou pelo medo e egoísmo?"
            ]
        }
    },
    {
        id: '9',
        layout: 'standard',
        content: {
            chapter: 'Ponto 3: Objeções',
            title: 'Economia e Providência',
            text: [
                "A mentalidade de escassez contradiz a promessa bíblica. Deus, que alimenta as aves e veste os lírios (Mateus 6), não daria 'bocas' sem prover o 'pão'.",
                "Frequentemente, a 'falta de dinheiro' é uma recusa em ajustar o padrão de vida e confiar na providência de Deus. A fé nos convida a depender do Pai celestial."
            ]
        }
    },
    {
        id: '10',
        layout: 'dark-orbit',
        content: {
            chapter: 'Ponto 3: Objeções',
            title: 'Pessimismo e Antítese',
            text: [
                "O mundo jaz no maligno desde Gênesis 3. Justamente por isso, precisamos de mais luz. Gerar filhos piedosos é um ato de guerra espiritual.",
                "É lançar 'flechas' (Sl 127:4) contra as portas do inferno, confiando na segurança do Pacto para os eleitos e na promessa de que a luz prevalece sobre as trevas."
            ],
            diagramData: {
                center: "Cristo",
                orbit1: "Luz",
                orbit2: "Trevas",
                label1: "Pacto",
                label2: "Antítese"
            }
        }
    },
    {
        id: '11',
        layout: 'chart',
        content: {
            chapter: 'Ponto 3: Objeções',
            title: 'Hedonismo e Kenosis',
            text: [
                "A recusa em sacrificar conforto, tempo e corpo por outrem é a antítese do Evangelho. A família é uma escola de santificação onde aprendemos a morrer para nós mesmos diariamente.",
                "Imitamos a Cristo, que se esvaziou (Kenosis) por Sua Noiva, a Igreja. A paternidade é um chamado ao sacrifício e ao amor que se doa."
            ],
            chartData: {
                title: "Investimento Eterno",
                leftLabel: "Conforto",
                rightLabel: "Legado",
                option1: "Mundana",
                option2: "Reino"
            }
        }
    },
    {
        id: '12',
        layout: 'standard',
        content: {
            chapter: 'Conclusão',
            title: 'Resgate do Propósito',
            text: [
                "Vimos que o casamento tem um propósito divino de gerar uma descendência para Deus, que a mordomia cristã guia nosso planejamento familiar, e que a fé em Cristo vence os medos e o egoísmo do mundo.",
                "Rejeite o espírito desta época. Não permita que o medo do mundo dite o tamanho da sua família, mas sim a esperança no Deus da Aliança."
            ]
        }
    },
    {
        id: '13',
        layout: 'quote',
        content: {
            chapter: 'Conclusão',
            title: 'Enchendo a Aljava',
            highlight: 'Tenham filhos. Confiem na Providência. Rejeitem a mentalidade estéril deste século.',
            text: [
                "Aos não casados, busquem um cônjuge para construir o Reino. Aos pais, criem seus filhos para o Pacto, não para o mercado. Aos casados, não sacrifiquem a bênção dos filhos no altar do conforto.",
                "Abracem a coragem de encher suas aljavas para a glória de Cristo, confiando que Ele capacitará aqueles a quem chama."
            ]
        }
    }
];


// --- Fixed Slide Components ---

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
      <p className="max-w-3xl mx-auto text-xl text-stone-700 font-light leading-relaxed mb-12">
        {meta.subtitle}
      </p>
    </div>
  </header>
);

const bibliographyData = [
    { id: 1, author: "A BÍBLIA SAGRADA.", title: "Livro de Gênesis.", details: "Capítulo 1:28 (O Mandato Cultural)." },
    { id: 2, author: "A BÍBLIA SAGRADA.", title: "Livro de Malaquias.", details: "Capítulo 2:15 (Descendência para Deus)." },
    { id: 3, author: "A BÍBLIA SAGRADA.", title: "Livro de Salmos.", details: "Salmo 127 (Filhos como herança e flechas)." },
    { id: 4, author: "A BÍBLIA SAGRADA.", title: "1 Timóteo.", details: "Capítulo 5:8 (O cuidado dos seus)." },
    { id: 5, author: "A BÍBLIA SAGRADA.", title: "Evangelho de Mateus.", details: "Capítulo 6:25-34 (A Providência Divina)." },
    { id: 6, author: "VAN TIL, Cornelius.", title: "A Estrutura da Aliança.", details: "Teologia Reformada e o Pacto." },
    { id: 7, author: "BAVINCK, Herman.", title: "A Família Cristã.", details: "Ética e Dogmática Reformada." },
    { id: 8, author: "SPROUL, R.C.", title: "O Propósito do Casamento.", details: "Ligonier Ministries." }
];

const BibliographySlidePart1 = () => {
    const references = bibliographyData.slice(0, 4);
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#F9F8F4] p-6 md:p-16">
             <div className="container mx-auto max-w-5xl h-full flex flex-col pt-10">
                  <h2 className="font-sans text-4xl text-stone-600 uppercase tracking-widest mb-10 border-b border-stone-300 pb-4 text-left">
                      Referências Bíblicas
                  </h2>
                  <div className="space-y-8 pr-4">
                      {references.map((ref) => (
                          <div key={ref.id} className="flex items-start gap-8 group">
                              <div className="mt-1 shrink-0 text-stone-400 group-hover:text-[#6B4C9A] transition-colors duration-300">
                                  <FileText size={40} strokeWidth={1.2} className="fill-stone-50/50" />
                              </div>
                              <div className="flex-1">
                                  <p className="text-[#6B4C9A] font-medium text-lg tracking-wide mb-1">{ref.author}</p>
                                  <p className="text-stone-800 font-serif font-bold italic text-2xl leading-snug mb-1">{ref.title}</p>
                                  <p className="text-[#6B4C9A] text-lg opacity-90">{ref.details}</p>
                              </div>
                          </div>
                      ))}
                  </div>
             </div>
        </div>
    )
}

const BibliographySlidePart2 = () => {
    const references = bibliographyData.slice(4);
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#F9F8F4] p-6 md:p-16">
             <div className="container mx-auto max-w-5xl h-full flex flex-col pt-10">
                  <h2 className="font-sans text-4xl text-stone-600 uppercase tracking-widest mb-10 border-b border-stone-300 pb-4 text-left">
                      Referências Teológicas
                  </h2>
                  <div className="space-y-8 pr-4">
                      {references.map((ref) => (
                          <div key={ref.id} className="flex items-start gap-8 group">
                              <div className="mt-1 shrink-0 text-stone-400 group-hover:text-[#6B4C9A] transition-colors duration-300">
                                  <FileText size={40} strokeWidth={1.2} className="fill-stone-50/50" />
                              </div>
                              <div className="flex-1">
                                  <p className="text-[#6B4C9A] font-medium text-lg tracking-wide mb-1">{ref.author}</p>
                                  <p className="text-stone-800 font-serif font-bold italic text-2xl leading-snug mb-1">{ref.title}</p>
                                  <p className="text-[#6B4C9A] text-lg opacity-90">{ref.details}</p>
                              </div>
                          </div>
                      ))}
                  </div>
             </div>
        </div>
    )
}

const FooterSlide: React.FC<{ meta: PresentationMetadata }> = ({ meta }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-6">
        <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-4xl mb-4">{meta.title}</div>
            <p className="text-xl">"{meta.subtitle}"</p>
        </div>
        <div className="text-center mt-16 text-sm text-stone-600">
            Baseado no estudo bíblico apresentado por {meta.author}.
        </div>
    </div>
);


// --- Admin Panel Component (With Editor) ---
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
    
    // Default Mock Database Data (Fallback)
    const mockPresentations: Presentation[] = [
        { id: '1', title: 'O Mandato Pactual', author: 'PROFESSOR ABRAÃO', date: 'Nov 2024', slides: 16, active: true },
    ];

    const [presentations, setPresentations] = useState<Presentation[]>(mockPresentations);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'library' | 'editor'>('library');

    // Helper for robust error handling
    const handleSupabaseError = (err: any, action: string) => {
        console.error(`Full Error Object (${action}):`, err);
        let userMessage = `Ocorreu um erro ao ${action}.`;
        
        // Safely stringify error for display
        const errDetails = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);

        if (err?.code === 'PGRST205' || err?.code === '42P01') {
             userMessage = `A tabela 'presentations' não existe no banco de dados.\n\nPor favor, copie o script SQL do console (F12) e execute-o no Editor SQL do Supabase.`;
             console.log(SETUP_SQL_SCRIPT);
        } else if (err?.code === '42501') {
             userMessage = `Permissão negada (Erro 42501). Verifique se as Políticas de Segurança (RLS) do Supabase permitem INSERT/SELECT para a role 'anon'.`;
        } else if (err?.code === '42703') {
             userMessage = `Erro de Coluna Ausente (42703). O banco de dados está desatualizado (faltando coluna 'meta').\n\nPor favor, execute o script SQL do console (F12) para corrigir.`;
             console.log(SETUP_SQL_SCRIPT);
        } else if (err?.message) {
             userMessage = `Erro: ${err.message}`;
        } else {
             userMessage = `Erro desconhecido:\n${errDetails}`;
        }
        alert(userMessage);
    };

    const fetchPresentations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
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
        } catch (err) {
            console.error("Connection error:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadPresentation = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('presentations')
                .select('*') // Select all to get metadata and content
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                // Smart Loading Logic
                let loadedSlides = data.content;
                let loadedMeta = data.meta;

                // Handle legacy format where content was array but no meta column
                if (Array.isArray(data.content)) {
                    // Check if subtitle is hidden inside content (old logic)
                    // or if this is just a plain array of slides
                    // For now, assume content is just slides if it's an array
                    loadedSlides = data.content;
                } 
                // Handle new format where content = { slides, meta } (if you switched to that)
                // But current schema has dedicated 'meta' column.
                
                if (loadedSlides) setSlides(loadedSlides);
                
                if (loadedMeta) {
                    setMeta(loadedMeta);
                } else {
                    // Fallback if meta column is missing/empty
                    setMeta({
                        title: data.title || "Sem Título",
                        subtitle: "",
                        author: data.author || "Autor Desconhecido"
                    });
                }
                
                setActivePresentationId(id);
                setPresentations(prev => prev.map(p => ({ ...p, active: p.id === id })));
                alert('Apresentação carregada com sucesso!');
                setActiveTab('editor'); 
            } else {
                alert('Nenhum conteúdo encontrado.');
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
            // Prepare payload matching the DB schema
            const presentationToSave = {
                title: meta.title,
                author: meta.author,
                date: new Date().toLocaleDateString('pt-BR'),
                slides: totalSlides,
                content: currentSlides, // Save slides JSON array to content column
                meta: meta,             // Save metadata JSON object to meta column
                active: true,
            };

            let result;
            let actionText = "";

            if (activePresentationId) {
                const { error, data } = await supabase
                    .from('presentations')
                    .update(presentationToSave)
                    .eq('id', activePresentationId)
                    .select();
                result = { error, data };
                actionText = "atualizada";
            } else {
                const { error, data } = await supabase
                    .from('presentations')
                    .insert([presentationToSave])
                    .select()
                    .single();
                result = { error, data };
                actionText = "salva";
                if (!error && data) setActivePresentationId(data.id);
            }

            if (result.error) throw result.error;
            await fetchPresentations();
            alert(`Apresentação ${actionText} com sucesso!`);
        } catch (err: any) {
            handleSupabaseError(err, "salvar apresentação");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresentations();
    }, [activePresentationId]);

    // --- Editor Helper Functions ---
    const updateSlide = (index: number, field: keyof SlideContent | 'layout', value: any) => {
        const newSlides = [...currentSlides];
        if (field === 'layout') {
            newSlides[index].layout = value;
        } else {
            newSlides[index].content = {
                ...newSlides[index].content,
                [field]: value
            };
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
        newSlides[slideIndex].content.timelineEvents = [...events, { id: Date.now(), year: '2025', label: 'Novo Evento', desc: 'Descrição' }];
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
        const defaultData = { center: 'Centro', orbit1: 'Orbita 1', orbit2: 'Orbita 2', label1: 'Label 1', label2: 'Label 2' };
        newSlides[slideIndex].content.diagramData = {
            ...(newSlides[slideIndex].content.diagramData || defaultData),
            [field]: value
        };
        setSlides(newSlides);
    };

    const updateChartData = (slideIndex: number, field: keyof ChartData, value: string) => {
         const newSlides = [...currentSlides];
         const defaultData = { title: 'Gráfico', leftLabel: 'Esq', rightLabel: 'Dir', option1: 'Op1', option2: 'Op2' };
         newSlides[slideIndex].content.chartData = {
             ...(newSlides[slideIndex].content.chartData || defaultData),
             [field]: value
         };
         setSlides(newSlides);
    };


    const addSlide = () => {
        const newSlide: SlideData = {
            id: Math.random().toString(36).substr(2, 9),
            layout: 'standard',
            content: {
                chapter: 'Novo Capítulo',
                title: 'Novo Slide',
                text: ['Adicione seu texto aqui...']
            }
        };
        setSlides([...currentSlides, newSlide]);
    };

    const removeSlide = (index: number) => {
        const newSlides = currentSlides.filter((_, i) => i !== index);
        setSlides(newSlides);
    };

    const moveSlide = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= currentSlides.length) return;
        const newSlides = [...currentSlides];
        const temp = newSlides[index];
        newSlides[index] = newSlides[index + direction];
        newSlides[index + direction] = temp;
        setSlides(newSlides);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#F9F8F4] w-full max-w-6xl h-[90vh] rounded-xl border border-nobel-gold shadow-2xl flex flex-col overflow-hidden text-stone-800">
                {/* Header */}
                <div className="p-4 border-b border-stone-300 flex justify-between items-center bg-white/80">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Settings className="text-nobel-gold" size={24} />
                            <h2 className="text-xl font-serif text-stone-900 font-bold">Painel de Controle</h2>
                        </div>
                        {/* Tabs */}
                        <div className="flex bg-stone-200 rounded-lg p-1 gap-1">
                            <button 
                                onClick={() => setActiveTab('library')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Biblioteca
                            </button>
                            <button 
                                onClick={() => setActiveTab('editor')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Editor
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={saveCurrentPresentation}
                            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-full transition-colors shadow-sm ${activePresentationId ? 'bg-stone-700 hover:bg-stone-900' : 'bg-nobel-gold hover:bg-[#b08d4b]'}`}
                        >
                            {loading ? <RefreshCw size={16} className="animate-spin"/> : <Save size={16} />}
                            <span>{activePresentationId ? 'Salvar Alterações' : 'Salvar Novo'}</span>
                        </button>
                        <button onClick={close} className="text-stone-400 hover:text-stone-800 transition-colors bg-stone-200/50 p-2 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-[#F9F8F4]">
                    
                    {/* LIBRARY TAB */}
                    {activeTab === 'library' && (
                         <div className="h-full overflow-y-auto p-8">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between px-6 py-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                                    <span className="w-1/2">Apresentação</span>
                                    <span className="w-1/6">Autor</span>
                                    <span className="w-1/6 text-center">Data</span>
                                    <span className="w-1/6 text-right">Ações</span>
                                </div>
                                {presentations.map((pres) => (
                                    <div key={pres.id} className={`group flex items-center justify-between p-6 rounded-lg border transition-all ${pres.active ? 'bg-white border-nobel-gold shadow-md' : 'bg-white/50 border-stone-200 hover:border-stone-300'}`}>
                                        <div className="w-1/2 flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${pres.active ? 'bg-nobel-gold text-white' : 'bg-stone-200 text-stone-500'}`}>
                                                {pres.active ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-serif font-bold leading-tight text-stone-900">{pres.title}</h3>
                                                <div className="text-xs text-stone-500 mt-1">{pres.slides} slides</div>
                                            </div>
                                        </div>
                                        <div className="w-1/6 text-sm text-stone-600 truncate pr-4">{pres.author}</div>
                                        <div className="w-1/6 text-center text-sm text-stone-500">{pres.date}</div>
                                        <div className="w-1/6 flex justify-end gap-2">
                                            <button 
                                                onClick={() => loadPresentation(pres.id)} 
                                                className="px-4 py-2 border border-stone-300 text-stone-600 text-sm font-medium rounded-md hover:bg-stone-100 hover:text-stone-900"
                                            >
                                                {pres.active ? 'Recarregar' : 'Carregar'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EDITOR TAB */}
                    {activeTab === 'editor' && (
                        <div className="h-full flex flex-col md:flex-row">
                            {/* Metadata Sidebar */}
                            <div className="w-full md:w-80 bg-white border-r border-stone-200 p-6 overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Metadados</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-stone-500 mb-1">Título da Apresentação</label>
                                        <input 
                                            type="text" 
                                            value={meta.title} 
                                            onChange={(e) => setMeta({...meta, title: e.target.value})}
                                            className="w-full p-2 border border-stone-300 rounded text-sm bg-white text-stone-900 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-stone-500 mb-1">Subtítulo</label>
                                        <input 
                                            type="text" 
                                            value={meta.subtitle} 
                                            onChange={(e) => setMeta({...meta, subtitle: e.target.value})}
                                            className="w-full p-2 border border-stone-300 rounded text-sm bg-white text-stone-900 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-stone-500 mb-1">Autor</label>
                                        <input 
                                            type="text" 
                                            value={meta.author} 
                                            onChange={(e) => setMeta({...meta, author: e.target.value})}
                                            className="w-full p-2 border border-stone-300 rounded text-sm bg-white text-stone-900 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="my-6 border-t border-stone-100"></div>
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Estrutura</h3>
                                <div className="text-sm text-stone-500 mb-4">
                                    Total de Slides: <span className="font-bold text-stone-900">{currentSlides.length}</span>
                                </div>
                                <button 
                                    onClick={addSlide}
                                    className="w-full py-2 bg-stone-100 text-stone-600 border border-stone-300 rounded-md text-sm font-medium hover:bg-stone-200 hover:text-stone-900 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Adicionar Slide
                                </button>
                            </div>

                            {/* Slides List & Editor */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F9F8F4] space-y-6">
                                {currentSlides.map((slide, index) => (
                                    <div key={slide.id || index} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden group">
                                        {/* Slide Header / Toolbar */}
                                        <div className="bg-stone-50 p-3 border-b border-stone-200 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-stone-200 text-stone-600 text-xs font-mono font-bold w-6 h-6 rounded flex items-center justify-center">{index + 1}</span>
                                                <select 
                                                    value={slide.layout}
                                                    onChange={(e) => updateSlide(index, 'layout', e.target.value)}
                                                    className="bg-white border border-stone-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-nobel-gold"
                                                >
                                                    <option value="standard">Standard</option>
                                                    <option value="timeline">Timeline</option>
                                                    <option value="dark-orbit">Dark Orbit</option>
                                                    <option value="chart">Chart</option>
                                                    <option value="quote">Quote</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveSlide(index, -1)} disabled={index === 0} className="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-30"><ArrowUp size={14}/></button>
                                                <button onClick={() => moveSlide(index, 1)} disabled={index === currentSlides.length - 1} className="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-30"><ArrowDown size={14}/></button>
                                                <div className="w-px h-4 bg-stone-300 mx-1"></div>
                                                <button onClick={() => removeSlide(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                                            </div>
                                        </div>

                                        {/* Content Form */}
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Capítulo / Seção</label>
                                                    <input 
                                                        type="text" 
                                                        value={slide.content.chapter}
                                                        onChange={(e) => updateSlide(index, 'chapter', e.target.value)}
                                                        className="w-full p-2 border border-stone-300 rounded text-sm bg-white text-stone-900 focus:ring-1 focus:ring-nobel-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Título do Slide</label>
                                                    <input 
                                                        type="text" 
                                                        value={slide.content.title}
                                                        onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                                        className="w-full p-2 border border-stone-300 rounded text-sm font-serif font-bold bg-white text-stone-900 focus:ring-1 focus:ring-nobel-gold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Destaque (Citação)</label>
                                                    <textarea 
                                                        rows={2}
                                                        value={slide.content.highlight || ''}
                                                        onChange={(e) => updateSlide(index, 'highlight', e.target.value)}
                                                        className="w-full p-2 border border-stone-300 rounded text-sm italic bg-white text-stone-900 focus:ring-1 focus:ring-nobel-gold outline-none resize-none"
                                                        placeholder="Opcional: Texto em destaque..."
                                                    />
                                                </div>

                                                {/* --- DIAGRAM SPECIFIC EDITORS --- */}
                                                
                                                {slide.layout === 'timeline' && (
                                                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-xs font-bold text-nobel-gold uppercase">Editor de Linha do Tempo</label>
                                                            <button onClick={() => addTimelineEvent(index)} className="text-xs text-stone-600 hover:text-stone-900 bg-white border border-stone-300 px-2 py-0.5 rounded flex items-center gap-1"><Plus size={10} /> Add Evento</button>
                                                        </div>
                                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                                            {slide.content.timelineEvents?.map((evt, eIdx) => (
                                                                <div key={eIdx} className="bg-white p-2 rounded border border-stone-200 relative">
                                                                    <button onClick={() => removeTimelineEvent(index, eIdx)} className="absolute top-1 right-1 text-red-300 hover:text-red-500"><X size={12} /></button>
                                                                    <input 
                                                                        className="w-full text-xs font-bold text-nobel-gold border-none p-0 focus:ring-0 mb-1 bg-white"
                                                                        value={evt.year} 
                                                                        onChange={(e) => updateTimelineEvent(index, eIdx, 'year', e.target.value)} 
                                                                        placeholder="Ano/Ref" 
                                                                    />
                                                                    <input 
                                                                        className="w-full text-xs font-serif text-stone-800 border-none p-0 focus:ring-0 mb-1 bg-white"
                                                                        value={evt.label} 
                                                                        onChange={(e) => updateTimelineEvent(index, eIdx, 'label', e.target.value)} 
                                                                        placeholder="Título" 
                                                                    />
                                                                    <textarea 
                                                                        className="w-full text-[10px] text-stone-500 border border-stone-100 p-1 rounded resize-none bg-white"
                                                                        value={evt.desc} 
                                                                        onChange={(e) => updateTimelineEvent(index, eIdx, 'desc', e.target.value)} 
                                                                        rows={2} 
                                                                        placeholder="Descrição"
                                                                    />
                                                                </div>
                                                            ))}
                                                            {(!slide.content.timelineEvents || slide.content.timelineEvents.length === 0) && <p className="text-xs text-stone-400 italic">Nenhum evento adicionado.</p>}
                                                        </div>
                                                    </div>
                                                )}

                                                {slide.layout === 'dark-orbit' && (
                                                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                                                        <label className="block text-xs font-bold text-nobel-gold uppercase mb-2">Editor de Diagrama (Órbitas)</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="col-span-2">
                                                                <input className="w-full text-xs p-1 border rounded bg-white text-stone-900" placeholder="Centro (Ex: Cristo)" value={slide.content.diagramData?.center || ''} onChange={(e) => updateDiagramData(index, 'center', e.target.value)} />
                                                            </div>
                                                            <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Órbita 1" value={slide.content.diagramData?.orbit1 || ''} onChange={(e) => updateDiagramData(index, 'orbit1', e.target.value)} />
                                                            <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Órbita 2" value={slide.content.diagramData?.orbit2 || ''} onChange={(e) => updateDiagramData(index, 'orbit2', e.target.value)} />
                                                            <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Legenda 1" value={slide.content.diagramData?.label1 || ''} onChange={(e) => updateDiagramData(index, 'label1', e.target.value)} />
                                                            <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Legenda 2" value={slide.content.diagramData?.label2 || ''} onChange={(e) => updateDiagramData(index, 'label2', e.target.value)} />
                                                        </div>
                                                    </div>
                                                )}

                                                {slide.layout === 'chart' && (
                                                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                                                        <label className="block text-xs font-bold text-nobel-gold uppercase mb-2">Editor de Gráfico</label>
                                                        <div className="space-y-2">
                                                            <input className="w-full text-xs p-1 border rounded bg-white text-stone-900" placeholder="Título do Gráfico" value={slide.content.chartData?.title || ''} onChange={(e) => updateChartData(index, 'title', e.target.value)} />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Barra Esq (Label)" value={slide.content.chartData?.leftLabel || ''} onChange={(e) => updateChartData(index, 'leftLabel', e.target.value)} />
                                                                <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Barra Dir (Label)" value={slide.content.chartData?.rightLabel || ''} onChange={(e) => updateChartData(index, 'rightLabel', e.target.value)} />
                                                                <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Opção 1 (Botão)" value={slide.content.chartData?.option1 || ''} onChange={(e) => updateChartData(index, 'option1', e.target.value)} />
                                                                <input className="text-xs p-1 border rounded bg-white text-stone-900" placeholder="Opção 2 (Botão)" value={slide.content.chartData?.option2 || ''} onChange={(e) => updateChartData(index, 'option2', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Conteúdo (Parágrafos)</label>
                                                <div className="space-y-2">
                                                    {slide.content.text.map((paragraph, pIdx) => (
                                                        <textarea
                                                            key={pIdx}
                                                            rows={3}
                                                            value={paragraph}
                                                            onChange={(e) => updateTextParagraph(index, pIdx, e.target.value)}
                                                            className="w-full p-2 border border-stone-300 rounded text-sm bg-white text-stone-900 focus:ring-1 focus:ring-nobel-gold outline-none resize-none"
                                                        />
                                                    ))}
                                                    <button 
                                                        onClick={() => {
                                                            const newText = [...slide.content.text, ""];
                                                            updateSlide(index, 'text', newText);
                                                        }}
                                                        className="text-xs text-nobel-gold hover:underline font-medium flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> Adicionar Parágrafo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center pt-4 pb-12">
                                     <button 
                                        onClick={addSlide}
                                        className="px-6 py-3 bg-white border border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-nobel-gold hover:text-nobel-gold transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <Plus size={20} /> Adicionar Novo Slide ao Final
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Presentation Data
  const [slides, setSlides] = useState<SlideData[]>(initialSlidesData);
  const [meta, setMeta] = useState<PresentationMetadata>({
      title: "O Mandato Pactual",
      subtitle: "Abertura à Vida e a Glória de Deus na Família",
      author: "PROFESSOR ABRAÃO GUIMARÃES SOUSA"
  });
  
  const [activePresentationId, setActivePresentationId] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString('pt-BR'));
  }, []);

  // Helper to render content slides based on current slides state
  const renderContentSlide = (index: number) => {
    // Adjust index to account for HeroSlide (index 0)
    const dataIndex = index - 1;
    const data = slides[dataIndex];
    
    if (!data) return null;

    switch (data.layout) {
        case 'standard': return <StandardLayout content={data.content} />;
        case 'timeline': return <TimelineLayout content={data.content} />;
        case 'dark-orbit': return <DarkOrbitLayout content={data.content} />;
        case 'chart': return <ChartLayout content={data.content} />;
        case 'quote': return <QuoteLayout content={data.content} />;
        default: return <StandardLayout content={data.content} />;
    }
  };

  const totalSlides = 1 + slides.length + 2 + 1; 

  const paginate = (newDirection: number) => {
    const newSlideIndex = currentSlide + newDirection;
    if (newSlideIndex >= 0 && newSlideIndex < totalSlides) {
      setSlide([newSlideIndex, newDirection]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin Toggle Shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          setShowAdmin(prev => !prev);
          return;
      }
      if (showAdmin) return;
      if (e.key === 'ArrowRight') {
        setSlide(([cs, d]) => {
          const newIndex = cs + 1;
          if (newIndex < totalSlides) return [newIndex, 1];
          return [cs, d];
        });
      } else if (e.key === 'ArrowLeft') {
        setSlide(([cs, d]) => {
          const newIndex = cs - 1;
          if (newIndex >= 0) return [newIndex, -1];
          return [cs, d];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, showAdmin]);

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: '0%', opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  let slideContent;
  if (currentSlide === 0) {
      slideContent = <HeroSlide formattedDate={formattedDate} meta={meta} />;
  } else if (currentSlide > 0 && currentSlide <= slides.length) {
      slideContent = renderContentSlide(currentSlide);
  } else if (currentSlide === slides.length + 1) {
      slideContent = <BibliographySlidePart1 />;
  } else if (currentSlide === slides.length + 2) {
      slideContent = <BibliographySlidePart2 />;
  } else {
      slideContent = <FooterSlide meta={meta} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F9F8F4] text-stone-800 selection:bg-nobel-gold selection:text-white">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 150, damping: 25 }, opacity: { duration: 0.4 } }}
          className="absolute w-full h-full pb-8"
        >
          {slideContent}
        </motion.div>
      </AnimatePresence>
      
      {showAdmin && (
          <AdminPanel 
             currentSlides={slides}
             setSlides={setSlides}
             meta={meta}
             setMeta={setMeta}
             totalSlides={totalSlides} 
             close={() => setShowAdmin(false)}
             activePresentationId={activePresentationId}
             setActivePresentationId={setActivePresentationId}
          />
      )}

      <div className="absolute bottom-0 left-0 w-full z-50 flex h-8 text-xs font-sans shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-stone-300/20">
         <button 
            className="flex-1 basis-0 flex items-center px-4 bg-[#E8DEC0] text-stone-800 truncate border-r border-stone-400/20 hover:bg-[#ded2b0] transition-colors text-left justify-start"
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
         >
             <span className="truncate font-medium opacity-90">{meta.author}</span>
         </button>
         <div className="flex-1 basis-0 flex items-center justify-center px-4 bg-[#C5A059] text-white truncate">
             <span className="truncate font-semibold tracking-wide">{meta.title}</span>
         </div>
         <button 
            className="flex-1 basis-0 flex items-center justify-between px-4 bg-[#8C7035] text-white/90 hover:bg-[#7a612e] transition-colors"
            onClick={() => paginate(1)}
            disabled={currentSlide === totalSlides - 1}
         >
             <span className="mr-4 opacity-80 hidden sm:inline truncate">{formattedDate}</span>
             <span className="font-mono font-bold ml-auto shrink-0">{currentSlide + 1} / {totalSlides}</span>
         </button>
      </div>
    </div>
  );
};

export default App;