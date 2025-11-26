/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { HistoryTimeline, FamilyConnectionDiagram, TeacherCompetencyChart } from './components/Diagrams';
import { BookOpen, ChevronLeft, ChevronRight, FileText, Users, GraduationCap, Quote, X, LayoutGrid, List, Database, Search, FolderOpen, MoreVertical, CheckCircle2, CloudUpload, RefreshCw } from 'lucide-react';
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
  active boolean default false
);

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
    text: string[]; // Changed from React.ReactNode[] to string[] for JSON serialization
    highlight?: string;
}

interface SlideData {
    layout: SlideLayoutType;
    content: SlideContent;
}

interface Presentation {
    id: string;
    title: string;
    author: string;
    date: string;
    slides: number;
    active: boolean;
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
            <div className="mt-8 p-4 bg-stone-50 border-l-2 border-nobel-gold text-stone-600 italic text-sm text-justify">
                "{content.highlight}"
            </div>
        )}
      </div>
      <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed space-y-6">
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
                  <div className="text-lg text-stone-600 mb-6 leading-relaxed space-y-4">
                    {content.text.map((paragraph, idx) => (
                        <p key={idx} className="text-justify">{paragraph}</p>
                    ))}
                  </div>
              </div>
              <div>
                  <HistoryTimeline />
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
                  <FamilyConnectionDiagram />
               </div>
               <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-nobel-gold text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-700">
                      {content.chapter}
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">{content.title}</h2>
                  <div className="text-lg text-stone-400 mb-6 leading-relaxed space-y-4">
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
            <div className="max-w-4xl mx-auto text-center mb-8">
                <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">{content.chapter}</div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">{content.title}</h2>
                <div className="text-lg text-stone-600 leading-relaxed text-justify max-w-3xl mx-auto space-y-4">
                     {content.text.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
            <div className="max-w-3xl mx-auto">
                <TeacherCompetencyChart />
            </div>
        </div>
    </div>
);

const QuoteLayout: React.FC<{ content: SlideContent }> = ({ content }) => (
  <div className="w-full h-full flex items-center justify-center bg-white border-t border-stone-200 p-6">
       <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative">
              <div className="aspect-square bg-[#F5F4F0] rounded-xl overflow-hidden relative border border-stone-200 shadow-inner flex items-center justify-center">
                   <div className="text-center p-8">
                      <Quote size={64} className="mx-auto text-nobel-gold mb-4" strokeWidth={1} />
                      {content.highlight && <p className="font-serif italic text-stone-500 text-xl text-center">"{content.highlight}"</p>}
                   </div>
              </div>
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">{content.chapter}</div>
              <h2 className="font-serif text-4xl mb-6 text-stone-900">{content.title}</h2>
              <div className="text-lg text-stone-600 mb-6 leading-relaxed space-y-4">
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
    // SECTION 1: INTRODUCTION
    {
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

    // SECTION 2: POINT 1 - TELEOLOGY (Malachi 2:15, Genesis 1:28, Psalm 127)
    {
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
        layout: 'dark-orbit',
        content: {
            chapter: 'Ponto 1: Teleologia',
            title: 'O Imperativo Criacional',
            text: [
                "'Frutificai e multiplicai-vos' (Gênesis 1:28) é o primeiro mandamento da Bíblia, o Mandato Cultural. Este mandamento foi dado antes da Queda, indicando que a procriação é parte da função do homem como Imagem de Deus.",
                "Negar a procriação é, em essência, negar a expansão da Imagem de Deus no mundo. Nossa vocação é encher a terra com reflexos da glória divina através de nossa descendência."
            ]
        }
    },
    {
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

    // SECTION 3: POINT 2 - ETHICS (1 Timothy 5:8)
    {
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
        layout: 'timeline',
        content: {
            chapter: 'Ponto 2: Ética Cristã',
            title: 'Limites Legítimos',
            text: [
                "A Escritura ordena: 'Se alguém não tem cuidado dos seus... negou a fé' (1 Timóteo 5:8). Razões legítimas para o espaçamento incluem risco grave à vida da mãe, incapacidade severa de sustento ou crises de saúde.",
                "A paternidade exige responsabilidade. Não é um ato de fé cega, mas de mordomia consciente, onde cada decisão visa o bem-estar e a educação cristã da prole."
            ]
        }
    },
    {
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

    // SECTION 4: POINT 3 - OBJECTIONS (Matthew 6:25-34)
    {
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
        layout: 'dark-orbit',
        content: {
            chapter: 'Ponto 3: Objeções',
            title: 'Pessimismo e Antítese',
            text: [
                "O mundo jaz no maligno desde Gênesis 3. Justamente por isso, precisamos de mais luz. Gerar filhos piedosos é um ato de guerra espiritual.",
                "É lançar 'flechas' (Sl 127:4) contra as portas do inferno, confiando na segurança do Pacto para os eleitos e na promessa de que a luz prevalece sobre as trevas."
            ]
        }
    },
    {
        layout: 'chart',
        content: {
            chapter: 'Ponto 3: Objeções',
            title: 'Hedonismo e Kenosis',
            text: [
                "A recusa em sacrificar conforto, tempo e corpo por outrem é a antítese do Evangelho. A família é uma escola de santificação onde aprendemos a morrer para nós mesmos diariamente.",
                "Imitamos a Cristo, que se esvaziou (Kenosis) por Sua Noiva, a Igreja. A paternidade é um chamado ao sacrifício e ao amor que se doa."
            ]
        }
    },

    // SECTION 5: CONCLUSION
    {
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

const HeroSlide: React.FC<{ formattedDate: string }> = ({ formattedDate }) => (
  <header className="relative h-full flex items-center justify-center overflow-hidden">
    <HeroScene />
    <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.92)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)]" />
    <div className="relative z-10 container mx-auto px-6 text-center">
      <div className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30">
        PROFESSOR ABRAÃO GUIMARÃES SOUSA • {formattedDate}
      </div>
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-stone-900 drop-shadow-sm">
        O Mandato Pactual <br/><span className="italic font-normal text-stone-600 text-2xl md:text-4xl block mt-4">Abertura à Vida e a Glória de Deus na Família</span>
      </h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12">
        O casamento como uma aliança divina cujo propósito primário é a geração de uma descendência piedosa para a glória de Deus.
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
                                  <p className="text-stone-800 font-serif font-bold italic text-xl leading-snug mb-1">{ref.title}</p>
                                  <p className="text-[#6B4C9A] text-base opacity-90">{ref.details}</p>
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
                                  <p className="text-stone-800 font-serif font-bold italic text-xl leading-snug mb-1">{ref.title}</p>
                                  <p className="text-[#6B4C9A] text-base opacity-90">{ref.details}</p>
                              </div>
                          </div>
                      ))}
                  </div>
             </div>
        </div>
    )
}

const FooterSlide = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 p-6">
        <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-4xl mb-4">O Mandato Pactual</div>
            <p className="text-lg">"Abertura à Vida e a Glória de Deus na Família"</p>
        </div>
        <div className="text-center mt-16 text-sm text-stone-600">
            Baseado no estudo bíblico apresentado por PROFESSOR ABRAÃO GUIMARÃES SOUSA.
        </div>
    </div>
);


// --- Invisible Admin Panel Component ---
const AdminPanel: React.FC<{ 
    currentSlides: SlideData[], 
    setSlides: (slides: SlideData[]) => void,
    totalSlides: number, 
    close: () => void,
    activePresentationId: string | null,
    setActivePresentationId: (id: string | null) => void
}> = ({ currentSlides, setSlides, totalSlides, close, activePresentationId, setActivePresentationId }) => {
    
    // Default Mock Database Data (Fallback)
    const mockPresentations: Presentation[] = [
        { id: '1', title: 'O Mandato Pactual: Família e Glória de Deus', author: 'PROFESSOR ABRAÃO GUIMARÃES SOUSA', date: 'Nov 2024', slides: 16, active: true },
    ];

    const [presentations, setPresentations] = useState<Presentation[]>(mockPresentations);
    const [loading, setLoading] = useState(false);

    // Helper for robust error handling
    const handleSupabaseError = (err: any, action: string) => {
        console.error(`Full Error Object (${action}):`, err);
        
        let userMessage = `Ocorreu um erro ao ${action}.`;
        
        // Handle Missing Table (PGRST205 or 42P01)
        if (err?.code === 'PGRST205' || err?.code === '42P01') {
             userMessage = `A tabela 'presentations' não existe no banco de dados.\n\nPor favor, copie o script SQL do console (F12) e execute-o no Editor SQL do Supabase para corrigir isso.`;
             console.log("%c COPIE E EXECUTE O SEGUINTE SQL NO SUPABASE:", "background: #C5A059; color: #fff; padding: 6px; font-weight: bold; font-size: 14px;");
             console.log(SETUP_SQL_SCRIPT);
        } 
        // Handle RLS Permission Denied
        else if (err?.code === '42501') {
             userMessage = `Permissão negada (Erro 42501). Verifique se as Políticas de Segurança (RLS) do Supabase permitem INSERT/SELECT para a role 'anon'.`;
        } 
        // Standard Message
        else if (err?.message) {
             userMessage = `Erro: ${err.message}`;
        } 
        // Fallback for object-only errors
        else if (typeof err === 'object') {
             userMessage = `Erro inesperado: ${JSON.stringify(err)}`;
        }

        alert(userMessage);
    };

    const fetchPresentations = async () => {
        setLoading(true);
        try {
            // Fetch from Supabase 'presentations' table
            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                 const mappedData = data.map((item: any) => ({
                     id: item.id,
                     title: item.title,
                     author: item.author,
                     date: item.date || new Date(item.created_at).toLocaleDateString('pt-BR'),
                     slides: item.slides || 0,
                     active: item.id === activePresentationId // Check against prop
                 }));
                 setPresentations(mappedData);
            } else if (error) {
                // Do not alert on fetch error on init, just log/fallback
                if (error.code !== 'PGRST205') {
                    console.warn("Supabase fetch error (using fallback data):", error.message);
                }
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
                .select('content')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data && data.content) {
                // IMPORTANT: Ensure the loaded content is set as the active slides
                setSlides(data.content);
                
                // Set the global active ID
                setActivePresentationId(id);
                
                // Update local list to show active checkmark
                setPresentations(prev => prev.map(p => ({
                    ...p,
                    active: p.id === id
                })));
                
                alert('Apresentação carregada com sucesso!');
                close();
            } else {
                alert('Nenhum conteúdo encontrado para esta apresentação.');
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
            const presentationToSave = {
                title: 'O Mandato Pactual: Abertura à Vida',
                author: 'PROFESSOR ABRAÃO GUIMARÃES SOUSA',
                date: new Date().toLocaleDateString('pt-BR'),
                slides: totalSlides,
                content: currentSlides, // Save the actual slides data (JSON)
                active: true,
            };

            let result;
            let actionText = "";

            if (activePresentationId) {
                // UPDATE existing
                const { error, data } = await supabase
                    .from('presentations')
                    .update(presentationToSave)
                    .eq('id', activePresentationId)
                    .select();
                
                result = { error, data };
                actionText = "atualizada";
            } else {
                // INSERT new
                const { error, data } = await supabase
                    .from('presentations')
                    .insert([presentationToSave])
                    .select()
                    .single(); // Use single to get the one created object
                
                result = { error, data };
                actionText = "salva";

                // If successful insert, set this as the active ID
                if (!error && data) {
                    setActivePresentationId(data.id);
                }
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
    }, [activePresentationId]); // Refetch when active ID changes

    return (
        <div className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-[#F9F8F4] w-full max-w-5xl h-[85vh] rounded-xl border border-nobel-gold shadow-2xl flex flex-col overflow-hidden text-stone-800">
                {/* Header */}
                <div className="p-6 border-b border-stone-300 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-3">
                        <Database className="text-nobel-gold" size={24} />
                        <h2 className="text-2xl font-serif text-stone-900 font-bold">Base de Conhecimento {loading && <span className="text-sm font-normal text-stone-500 animate-pulse ml-2">(Sincronizando...)</span>}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                            <input type="text" placeholder="Buscar apresentação..." className="pl-9 pr-4 py-2 rounded-full border border-stone-300 bg-white text-sm focus:outline-none focus:border-nobel-gold focus:ring-1 focus:ring-nobel-gold w-64" />
                         </div>
                        
                        <button 
                            onClick={saveCurrentPresentation}
                            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-full transition-colors shadow-sm ${activePresentationId ? 'bg-stone-700 hover:bg-stone-900' : 'bg-nobel-gold hover:bg-[#b08d4b]'}`}
                        >
                            {activePresentationId ? <RefreshCw size={16} /> : <CloudUpload size={16} />}
                            <span>{activePresentationId ? 'Atualizar Atual' : 'Salvar Novo'}</span>
                        </button>

                        <button onClick={close} className="text-stone-400 hover:text-stone-800 transition-colors bg-stone-200/50 p-2 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Main Content: Database List */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#F9F8F4]">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between px-6 py-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                            <span className="w-1/2">Título da Apresentação</span>
                            <span className="w-1/6">Autor</span>
                            <span className="w-1/6 text-center">Data</span>
                            <span className="w-1/6 text-right">Ações</span>
                        </div>

                        {presentations.map((pres) => (
                            <div 
                                key={pres.id}
                                className={`group flex items-center justify-between p-6 rounded-lg border transition-all duration-200 ${pres.active ? 'bg-white border-nobel-gold shadow-md' : 'bg-white/50 border-stone-200 hover:border-stone-300 hover:shadow-sm'}`}
                            >
                                <div className="w-1/2 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${pres.active ? 'bg-nobel-gold text-white' : 'bg-stone-200 text-stone-500'}`}>
                                        {pres.active ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-serif font-bold leading-tight ${pres.active ? 'text-stone-900' : 'text-stone-700'}`}>{pres.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                                            <span className="flex items-center gap-1"><LayoutGrid size={10}/> {pres.slides} slides</span>
                                            {pres.active && <span className="text-nobel-gold font-bold px-2 py-0.5 bg-nobel-gold/10 rounded-full">ATIVO</span>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-1/6 text-sm text-stone-600 font-medium truncate pr-4">
                                    {pres.author}
                                </div>
                                
                                <div className="w-1/6 text-center text-sm text-stone-500">
                                    {pres.date}
                                </div>
                                
                                <div className="w-1/6 flex justify-end gap-2">
                                    {pres.active ? (
                                        <button onClick={close} className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 transition-colors shadow-sm">
                                            Editar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => loadPresentation(pres.id)}
                                            className="px-4 py-2 border border-stone-300 text-stone-600 text-sm font-medium rounded-md hover:bg-stone-100 hover:text-stone-900 transition-colors"
                                        >
                                            Carregar
                                        </button>
                                    )}
                                    <button className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-white border-t border-stone-200 text-center text-xs text-stone-400 font-mono flex justify-between items-center px-8">
                    <span>Sistema de Gestão de Conteúdo Acadêmico v2.4.0</span>
                    <span>Conectado a: <strong className="text-stone-700">Supabase</strong></span>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Initialize slides state with the static data
  const [slides, setSlides] = useState<SlideData[]>(initialSlidesData);
  
  // Track the ID of the presentation currently being edited
  const [activePresentationId, setActivePresentationId] = useState<string | null>(null);
  
  // Use a state to hold the formatted date to ensure client-side consistency
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

  // Total slides = 1 Hero + dynamic content slides + 2 Biblio + 1 Footer
  const totalSlides = 1 + slides.length + 2 + 1; 

  const paginate = (newDirection: number) => {
    const newSlideIndex = currentSlide + newDirection;
    if (newSlideIndex >= 0 && newSlideIndex < totalSlides) {
      setSlide([newSlideIndex, newDirection]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin Toggle Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          setShowAdmin(prev => !prev);
          return;
      }

      if (showAdmin) return; // Disable navigation if admin panel is open

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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalSlides, showAdmin]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: '0%',
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Determine which component to render
  let slideContent;
  if (currentSlide === 0) {
      slideContent = <HeroSlide formattedDate={formattedDate} />;
  } else if (currentSlide > 0 && currentSlide <= slides.length) {
      slideContent = renderContentSlide(currentSlide);
  } else if (currentSlide === slides.length + 1) {
      slideContent = <BibliographySlidePart1 />;
  } else if (currentSlide === slides.length + 2) {
      slideContent = <BibliographySlidePart2 />;
  } else {
      slideContent = <FooterSlide />;
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
          transition={{
            x: { type: "spring", stiffness: 150, damping: 25 },
            opacity: { duration: 0.4 }
          }}
          className="absolute w-full h-full pb-8"
        >
          {slideContent}
        </motion.div>
      </AnimatePresence>
      
      {/* Hidden Admin Panel */}
      {showAdmin && (
          <AdminPanel 
             currentSlides={slides}
             setSlides={setSlides}
             totalSlides={totalSlides} 
             close={() => setShowAdmin(false)}
             activePresentationId={activePresentationId}
             setActivePresentationId={setActivePresentationId}
          />
      )}

      {/* LaTeX Beamer Style Footer Bar */}
      <div className="absolute bottom-0 left-0 w-full z-50 flex h-8 text-xs font-sans shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-stone-300/20">
         {/* Author / Institution - Left (Lightest) - Click for Prev */}
         <button 
            className="flex-1 basis-0 flex items-center px-4 bg-[#E8DEC0] text-stone-800 truncate border-r border-stone-400/20 hover:bg-[#ded2b0] transition-colors text-left justify-start"
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
         >
             <span className="truncate font-medium opacity-90">PROFESSOR ABRAÃO GUIMARÃES SOUSA</span>
         </button>
         
         {/* Title - Center (Medium) */}
         <div className="flex-1 basis-0 flex items-center justify-center px-4 bg-[#C5A059] text-white truncate">
             <span className="truncate font-semibold tracking-wide">O Mandato Pactual</span>
         </div>
         
         {/* Date / Progress - Right (Darkest) - Click for Next */}
         <button 
            className="flex-1 basis-0 flex items-center justify-between px-4 bg-[#8C7035] text-white/90 hover:bg-[#7a612e] transition-colors"
            onClick={() => paginate(1)}
            disabled={currentSlide === totalSlides - 1}
            aria-label="Next slide"
         >
             <span className="mr-4 opacity-80 hidden sm:inline truncate">{formattedDate}</span>
             <span className="font-mono font-bold ml-auto shrink-0">{currentSlide + 1} / {totalSlides}</span>
         </button>
      </div>

    </div>
  );
};

export default App;