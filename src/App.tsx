import { motion, useMotionValue, animate, useMotionValueEvent } from 'motion/react';
import { getSupabase } from './lib/supabase';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Zap, 
  BarChart3, 
  Globe, 
  Menu, 
  X,
  Building2,
  ShoppingBag,
  Database,
  Smartphone,
  AlertCircle,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';

// --- Components ---

const Counter = ({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, { 
      duration: 2,
      ease: "easeOut"
    });
    return controls.stop;
  }, [value, count]);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplayValue(latest.toFixed(decimals));
  });

  return <span>{displayValue}{suffix}</span>;
};

const WHATSAPP_LINK = "https://wa.me/5511961759438";
const API_DOCS_LINK = "https://api.liberadoapp.com/docs";

const PromoBanner = ({ onClick }: { onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-brand-deep text-white py-2 px-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-white/10 cursor-pointer hover:bg-brand-deep/90 transition-colors"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
      <span className="bg-brand-electric text-white px-2 py-0.5 rounded text-[9px]">PROMO</span>
      <span>Semana do Consumidor: Clientes Gupy têm 15% OFF em qualquer plano durante Março!</span>
    </div>
  </div>
);

const PromoModal = ({ isOpen, onClose, onClaim }: { isOpen: boolean; onClose: () => void; onClaim: () => void }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-deep/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh] relative pointer-events-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-brand-deep transition-colors z-[10000] cursor-pointer p-2"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <div className="h-36 bg-brand-electric flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white flex flex-col items-center"
            >
              <ShoppingBag size={48} strokeWidth={1.5} />
              <div className="mt-2 font-black text-xl tracking-tighter">SEMANA DO CONSUMIDOR</div>
            </motion.div>
          </div>

          <div className="p-8 text-center relative z-20">
            <h3 className="text-2xl font-bold text-brand-deep mb-3">Oportunidade Exclusiva!</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Durante todo o mês de Março, clientes <span className="font-bold text-brand-electric">Gupy</span> garantem um desconto especial de <span className="text-xl font-black text-brand-deep">15%</span> em qualquer um de nossos planos.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Como aproveitar?</p>
              <p className="text-xs text-slate-600">Basta informar que é cliente Gupy ao solicitar sua demonstração.</p>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onClaim(); }}
              className="w-full bg-brand-deep text-white py-4 rounded-xl font-bold text-base hover:bg-brand-electric transition-all shadow-xl shadow-brand-deep/20 flex items-center justify-center gap-3 cursor-pointer relative z-30"
            >
              Quero meu desconto <ArrowRight size={18} />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="mt-4 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors cursor-pointer relative z-30"
            >
              Continuar navegando
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose, initialGupy = false }: { isOpen: boolean; onClose: () => void; initialGupy?: boolean }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    fone: '',
    isGupy: false
  });

  const formatPhone = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    if (phoneNumberLength < 11) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, isGupy: initialGupy }));
    }
  }, [isOpen, initialGupy]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      return;
    }
    setEmailError('');
    
    setIsSubmitting(true);

    try {
      // Salvar no Supabase
      const supabase = getSupabase();
      const { error } = await supabase
        .from('leads_evento_gupy')
        .insert([
          {
            nome_completo: formData.nome,
            empresa: formData.empresa,
            email: formData.email,
            telefone: formData.fone,
            cliente_gupy: formData.isGupy ? true : null
          }
        ]);

      if (error) {
        console.error('Erro Supabase:', error);
        alert(`Erro ao salvar no banco: ${error.message}\n\nVerifique se a tabela 'leads_evento_gupy' existe e se o RLS permite inserção.`);
        setIsSubmitting(false);
        return; // Interrompe para não abrir o WhatsApp se falhar a gravação (opcional, mas ajuda a debugar)
      }

      const promoText = formData.isGupy ? "\n\n🎁 *CLIENTE GUPY - DESCONTO 15% APLICADO*" : "";
      const message = `Olá! Gostaria de solicitar uma demonstração do Liberado App.${promoText}\n\n*Dados do Contato:*\nNome: ${formData.nome}\nEmpresa: ${formData.empresa}\nE-mail: ${formData.email}\nTelefone: ${formData.fone}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `${WHATSAPP_LINK}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-deep/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh] relative custom-scrollbar"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-brand-deep transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-electric/10 rounded-2xl flex items-center justify-center text-brand-electric mx-auto mb-4">
              <Smartphone size={32} />
            </div>
            <h3 className="text-2xl font-bold text-brand-deep">Solicitar Demonstração</h3>
            <p className="text-slate-500 text-sm mt-2">Preencha os dados abaixo para falar com um consultor via WhatsApp.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Nome Completo</label>
              <input 
                required
                type="text" 
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-electric focus:ring-2 focus:ring-brand-electric/20 outline-none transition-all text-sm"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Empresa</label>
              <input 
                required
                type="text" 
                placeholder="Nome da sua empresa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-electric focus:ring-2 focus:ring-brand-electric/20 outline-none transition-all text-sm"
                value={formData.empresa}
                onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">E-mail</label>
                <input 
                  required
                  type="email" 
                  placeholder="seu@email.com"
                  className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-brand-electric focus:ring-brand-electric/20'} outline-none transition-all text-sm`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (emailError) setEmailError('');
                  }}
                />
                {emailError && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{emailError}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Telefone / WhatsApp</label>
                <input 
                  required
                  type="tel" 
                  placeholder="(00) 0 0000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-electric focus:ring-2 focus:ring-brand-electric/20 outline-none transition-all text-sm"
                  value={formData.fone}
                  onChange={(e) => setFormData({...formData, fone: formatPhone(e.target.value)})}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isGupy"
                className="w-5 h-5 rounded border-slate-300 text-brand-electric focus:ring-brand-electric"
                checked={formData.isGupy}
                onChange={(e) => setFormData({...formData, isGupy: e.target.checked})}
              />
              <label htmlFor="isGupy" className="text-xs font-bold text-slate-600 cursor-pointer">
                Sou cliente <span className="text-brand-electric">Gupy</span> (15% de desconto)
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-brand-electric text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-electric/20 flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-deep'}`}
            >
              {isSubmitting ? 'Enviando...' : 'Falar com Consultor'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onOpenModal, onOpenPromo }: { onOpenModal: () => void; onOpenPromo: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <PromoBanner onClick={onOpenPromo} />
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenModal}
              className="bg-brand-deep text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-electric transition-all shadow-lg shadow-brand-deep/10"
            >
              Solicitar demonstração
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

const PlatformPreview = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
      {/* Browser Header */}
      <div className="bg-slate-50 border-bottom border-slate-200 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 w-1/2 text-center">
          app.liberado.com.br/dashboard
        </div>
      </div>
      
      {/* App Content */}
      <div className="flex flex-col md:flex-row min-h-[400px] md:h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-16 lg:w-56 bg-brand-deep p-4 flex md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible">
          <div className="flex items-center px-2 shrink-0">
            <img 
              src="/logo-branco-liberado.png" 
              alt="Liberado Logo" 
              className="h-5 md:h-6 w-auto" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex md:flex-col gap-2">
            {[Search, Users, FileText, BarChart3, Lock].map((Icon, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg shrink-0 ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
                <Icon size={18} />
                <span className="text-sm font-medium hidden lg:block">{['Consultar', 'Candidatos', 'Relatórios', 'Analytics', 'Config'].map(t => t)[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-brand-deep">Dashboard de Verificação</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Bem-vindo de volta, Milton Epelboin</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Sistema Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            {[
              { label: 'Consultas Hoje', val: '142', color: 'text-brand-electric' },
              { label: 'Alertas de Risco', val: '03', color: 'text-red-500' },
              { label: 'Tempo Médio', val: '1.2s', color: 'text-slate-700' }
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="p-3 md:p-4 border-b border-slate-100 flex justify-between items-center bg-brand-deep/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-brand-electric rounded-full" />
                  <div className="w-1 h-1 bg-brand-electric rounded-full" />
                </div>
                <span className="text-xs md:text-sm font-bold text-brand-deep">Análise de Risco IA</span>
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Processado</span>
            </div>
            <div className="p-4 md:p-6 bg-brand-deep/90">
              <div className="flex items-center gap-2 mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5 text-brand-electric" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span className="text-white text-xs md:text-sm font-bold">Análise de Risco</span>
              </div>
              
              <div className="relative h-2 w-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-green-500 rounded-full mb-6">
                <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-2 border-white rounded-full shadow-lg" />
              </div>

              <div className="bg-green-600/90 text-white py-2 md:py-3 rounded-lg text-center font-bold text-xs md:text-sm tracking-wider uppercase">
                Baixo Risco
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-brand-deep">Últimas Verificações</span>
              <button className="text-[10px] font-bold text-brand-electric uppercase bg-brand-electric/5 px-2 py-1 rounded hover:bg-brand-electric/10 transition-colors">Ver Tudo</button>
            </div>
            <div className="p-4">
              {[
                { name: 'Ricardo Silva', doc: '452.***.***-09', status: 'Aprovado', risk: 'Baixo' },
                { name: 'Ana Oliveira', doc: '129.***.***-44', status: 'Em Análise', risk: 'Médio' },
                { name: 'Marcos Souza', doc: '883.***.***-12', status: 'Alerta', risk: 'Alto' }
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {row.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{row.name}</p>
                      <p className="text-[10px] text-slate-400">{row.doc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                      row.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                      row.status === 'Alerta' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {row.status}
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Risco</p>
                      <p className={`text-[10px] font-bold ${
                        row.risk === 'Baixo' ? 'text-green-600' : row.risk === 'Alto' ? 'text-red-600' : 'text-yellow-600'
                      }`}>{row.risk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img 
      src="/LOGO-LIBERADO-AZUL.png" 
      alt="Liberado Logo" 
      className="h-8 w-auto" 
      referrerPolicy="no-referrer"
    />
  </div>
);

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isGupyFromPromo, setIsGupyFromPromo] = useState(false);

  useEffect(() => {
    // Show promo after 2 seconds if not already seen in this session
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsPromoModalOpen(true);
        sessionStorage.setItem('hasSeenPromo', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimPromo = () => {
    setIsPromoModalOpen(false);
    setIsGupyFromPromo(true);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen selection:bg-brand-electric selection:text-white">
      <Navbar 
        onOpenModal={() => { setIsGupyFromPromo(false); setIsContactModalOpen(true); }} 
        onOpenPromo={() => setIsPromoModalOpen(true)}
      />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        initialGupy={isGupyFromPromo}
      />
      <PromoModal 
        isOpen={isPromoModalOpen} 
        onClose={() => setIsPromoModalOpen(false)}
        onClaim={handleClaimPromo}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-electric/10 text-brand-electric px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              <span>Background Check em Tempo Real</span>
            </div>
            <h1 className="text-5xl md:text-7xl text-brand-deep leading-[1.1] mb-6">
              Contrate com <span className="text-brand-electric">confiança</span>. Verifique antes de confiar.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              O Liberado App ajuda empresas a verificar antecedentes, identidade e riscos de candidatos, colaboradores e parceiros em segundos. A infraestrutura de confiança para o RH e Varejo moderno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-brand-deep text-white px-10 py-4 rounded-full font-bold hover:bg-brand-electric transition-all shadow-xl shadow-brand-deep/20 flex items-center justify-center gap-2 group"
              >
                Solicitar demonstração
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand-deep">
                  +<Counter value={400} />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Clientes<br/>Atendidos</span>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand-deep">
                  +<Counter value={5} /> Milhões
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Consultas<br/>Realizadas</span>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand-deep">
                  <Counter value={100} suffix="%" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Segurança no seu processo<br/>de decisão</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-black">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/tj6YdSd1DZ4?autoplay=0" 
                title="Liberado App Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view" 
                allowFullScreen
              ></iframe>
            </div>
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Identidade Validada</p>
                  <p className="text-[10px] text-slate-400">Consulta via API Federal</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-brand-deep mb-4">Conheça nossa Plataforma</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Uma interface intuitiva com inteligência artificial para facilitar sua tomada de decisão em segundos.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <PlatformPreview />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="solucao" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl text-brand-deep mb-6">Faça seu RH focar no que é estratégico</h2>
            <p className="text-slate-600 text-lg">
              Contratar errado custa caro. O Liberado App automatiza a burocracia para que sua equipe foque nas pessoas e no crescimento do negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: AlertCircle, title: 'Fraudes Internas', desc: 'Prejuízos causados por má conduta e falta de verificação de histórico.' },
              { icon: ShieldCheck, title: 'Danos Reputacionais', desc: 'Sua marca exposta por parcerias ou contratações de alto risco.' },
              { icon: FileText, title: 'Riscos Jurídicos', desc: 'Processos trabalhistas e criminais que poderiam ser evitados com KYC.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-deep mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-electric/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-brand-deep mb-10 text-center">O real impacto de uma contratação errada</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Custo de Substituição', val: '50% a 200%', sub: 'do salário anual' },
                  { label: 'Rotatividade no Brasil', val: '51,3%', sub: 'turnover médio ao ano' },
                  { label: 'Fraudes Corporativas', val: '63%', sub: 'das empresas detectaram' },
                  { label: 'Custo Extra Turnover', val: '1.4x', sub: 'do salário-base' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl font-bold text-brand-electric mb-2">{stat.val}</p>
                    <p className="text-sm font-bold text-brand-deep uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-xs text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex bg-brand-electric/10 text-brand-electric px-8 py-4 rounded-full font-bold hover:bg-brand-electric hover:text-white transition-all items-center gap-2 mx-auto"
            >
              Recrutamento sem dor de cabeça <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="max-w-3xl mb-16">
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              O Liberado App reúne diversas fontes de dados para gerar uma visão completa sobre candidatos, colaboradores e parceiros. Em poucos segundos é possível verificar:
            </p>
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-left mx-auto">
              {[
                'Processo de KYC completo',
                'Prova de Vida (Liveness Detection)',
                'Dossiê Comprobatório Detalhado',
                'Análise de Documentos com IA (OCR)',
                'Módulo Pessoa Física (CPF)',
                'Módulo Pessoa Jurídica (CNPJ)',
                'Antecedentes Criminais',
                'Processos Judiciais',
                'Validação de Identidade',
                'Restrições de Crédito',
                'Vínculos Empresariais',
                'Sanções Internacionais'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-electric/10 text-brand-electric rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full max-w-4xl">
            <img 
              src="/KYC.jpeg" 
              alt="KYC" 
              className="rounded-3xl shadow-2xl object-cover w-full aspect-[21/9]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-deep text-white p-8 rounded-3xl shadow-2xl w-64 text-left"
            >
              <p className="text-4xl font-bold mb-2">
                <Counter value={99.9} decimals={1} suffix="%" />
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Precisão nos dados</p>
              <div className="h-1.5 w-full bg-white/10 mt-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "99.9%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-brand-electric"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 px-6 bg-brand-deep text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl mb-6">Como funciona</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Processo simplificado para que você foque no que importa: a tomada de decisão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-white/10 z-0" />
            
            {[
              { step: '01', icon: Smartphone, title: 'KYC & Onboarding', desc: 'Entrada de dados via auto-cadastro com prova de vida e validação facial.' },
              { step: '02', icon: Database, title: 'Consulta Multi-Base', desc: 'Consultas de antecedentes criminais, judiciais e financeiros em segundos.' },
              { step: '03', icon: Zap, title: 'Automação com IA', desc: 'Nossa IA processa os riscos e entrega decisões rápidas e assertivas.' },
              { step: '04', icon: FileText, title: 'Dossiê Comprobatório', desc: 'Relatório completo com certidões automáticas direto dos portais oficiais.' },
              { step: '05', icon: ShieldCheck, title: 'Decisão Segura', desc: 'Segurança e rastreabilidade total com data, hora e CPF do usuário.' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-brand-electric rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-brand-electric/20 group hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <span className="text-brand-electric font-display font-bold text-xl mb-2">{item.step}</span>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Scenarios Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-electric font-bold text-xs uppercase tracking-widest mb-2">Nossa Plataforma</p>
            <h2 className="text-3xl md:text-5xl text-brand-deep">Como você pode usar?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {[
              { id: '01', title: 'Consultas unitárias', desc: 'Utilize nossa interface WEB intuitiva para realizar o cadastro e pesquisas sempre que necessário.' },
              { id: '02', title: 'Consultas em massa', desc: 'Faça consultas em massa através de upload de arquivos (CSV ou JSON).' },
              { id: '03', title: 'Análise de Documentos', desc: 'Nossa IA identifica RG/CNH, extrai dados via OCR e valida biometria facial.' },
              { id: '04', title: 'Convites externos', desc: 'Envie convites seguros para permitir que as pessoas façam seu auto-cadastro (SMS ou e-mail)' },
              { id: '05', title: 'Dossiê Comprobatório', desc: 'Exporte relatórios em PDF consolidando dados e atestados de todos os sistemas consultados.' },
              { id: '06', title: 'API REST / ATS', desc: 'Integre seus atuais sistemas de RH e ATS com o Liberado através de API REST.' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-5xl font-display font-bold text-brand-electric mb-6">{item.id}</span>
                <h3 className="text-xl font-bold text-brand-deep mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-slate-500 text-sm mb-8 italic">Liberadoapp emite certidões oficiais dos antecedentes criminais.</p>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-electric text-white px-10 py-4 rounded-full font-bold hover:bg-brand-deep transition-all shadow-lg"
            >
              Fale com o Consultor <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segmentos" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-electric font-bold text-xs uppercase tracking-widest mb-2">Segmentos que usam Liberado</p>
            <h2 className="text-3xl md:text-5xl text-brand-deep">A quem interessa contratar a <span className="text-brand-electric">Plataforma</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { 
                title: 'Recursos humanos', 
                desc: 'Facilite processos de seleção e minimize riscos em admissões. Saiba quem está contratando!',
                img: '/FOTO RH.png'
              },
              { 
                title: 'Transporte e Delivery', 
                desc: 'Garanta a confiabilidade de seus motoristas, motoboys e agregados com verificação completa!',
                img: '/FOTO DELIVERY.png'
              },
              { 
                title: 'Varejo e Supermercados', 
                desc: 'Proteja sua operação de varejo contra perdas e garanta a segurança de seus colaboradores!',
                img: '/FOTO VAREJO.png'
              },
              { 
                title: 'Vigilância e Facilities', 
                desc: 'Proteja condomínios, hospitais e empresas com prestadores de serviços verificados!',
                img: '/FOTO SEGURANÇA.png'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="h-[280px] overflow-hidden relative">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-brand-deep mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Fintech & Onboarding', desc: 'Onboarding completo com KYC, prova de vida (liveness) e verificação de identidade para transações seguras.', icon: <ShieldCheck size={20}/> },
              { title: 'Gig Economy', desc: 'Empresas de aplicativos com terceiros atendendo clientes finais com total segurança.', icon: <Zap size={20}/> },
              { title: 'Compliance & Due Diligence', desc: 'Due Diligence e compliance para mitigação de riscos em parcerias e fusões.', icon: <CheckCircle2 size={20}/> },
              { title: 'Homologação de Parceiros', desc: 'Qualificação de fornecedores e homologação de parceiros estratégicos.', icon: <Users size={20}/> },
              { title: 'Instituições de Ensino', desc: 'Verificação de antecedentes criminais para escolas e instituições de ensino.', icon: <ShoppingBag size={20}/> },
              { title: 'Mercado Imobiliário', desc: 'Verificação de histórico para transações de crédito, locação, fiança e imobiliário.', icon: <ArrowRight size={20}/> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-brand-electric/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-electric/10 flex items-center justify-center text-brand-electric shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-brand-deep text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-electric font-bold text-xs uppercase tracking-widest mb-2">Escolha seu plano</p>
            <h2 className="text-3xl md:text-5xl text-brand-deep">Qual o melhor <span className="text-brand-electric">plano</span> para você?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: 'Start',
                price: 'R$397,00',
                features: ['Acesso na plataforma', 'Consulta básica online'],
                not: ['Sem consulta via API', 'Não possui relatório', 'Usuários limitados']
              },
              {
                name: 'Basic',
                price: 'R$797,00',
                recommended: true,
                features: ['Acesso na plataforma', 'Consulta básica online', 'Consulta avançada', 'Relatório Dossiê'],
                not: ['Sem consulta via API']
              },
              {
                name: 'Standard',
                price: 'R$1.797,00',
                features: ['Acesso na plataforma', 'Consulta básica online', 'Consulta avançada', 'Integração via API', 'Relatório Dossiê']
              },
              {
                name: 'Enterprise',
                price: 'Consulte-nos',
                features: ['Acesso na plataforma', 'Consulta básica online', 'Consulta avançada', 'Integração via API', 'Relatório Dossiê', 'Suporte dedicado']
              }
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border ${plan.recommended ? 'border-brand-electric shadow-xl ring-1 ring-brand-electric' : 'border-slate-100 shadow-sm'} flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-electric text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Recomendamos!
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-deep mb-2">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-brand-deep">{plan.price}</span>
                  {plan.price !== 'Consulte-nos' && <span className="text-slate-400 text-sm">/mês</span>}
                  {plan.price !== 'Consulte-nos' && (
                    <div className="mt-2 text-[10px] font-bold text-brand-electric bg-brand-electric/5 py-1 px-2 rounded-lg inline-block">
                      Clientes Gupy: 15% OFF
                    </div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                      <CheckCircle2 className="text-brand-electric shrink-0" size={14} />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.not?.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs font-medium text-slate-400">
                      <X className="text-red-400 shrink-0" size={14} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className={`w-full py-3 rounded-full font-bold text-sm text-center transition-all ${plan.recommended ? 'bg-brand-electric text-white shadow-lg shadow-brand-electric/20' : 'border border-brand-electric text-brand-electric hover:bg-brand-electric/5'}`}
                >
                  Fale com o consultor
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl text-brand-deep mb-6">Por que escolher o Liberado?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Plataforma Completa', desc: 'Background check e análise de risco em um único sistema intuitivo.' },
              { title: 'API para Integração', desc: 'Conecte com seu ATS, CRM ou ERP de forma simples e rápida.' },
              { title: 'Monitoramento Contínuo', desc: 'Receba alertas quando ocorrer mudanças no histórico de pessoas.' },
              { title: 'Escalabilidade', desc: 'Processamos milhares de verificações por dia com alta performance.' }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-brand-deep mb-4">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="inline-block bg-brand-deep text-white px-10 py-4 rounded-full font-bold hover:bg-brand-electric transition-all shadow-xl shadow-brand-deep/20"
            >
              Conhecer todos os diferenciais
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-brand-deep text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl mb-6">O que dizem nossos clientes</h2>
              <p className="text-slate-400">Líderes de RH e Compliance que já transformaram seus processos com o Liberado.</p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Juliana Costa', role: 'Diretora de RH', text: 'Hoje conseguimos validar candidatos em poucos segundos. O processo seletivo ficou muito mais seguro e ágil.' },
                { name: 'Felipe Mendes', role: 'Head de Risco', text: 'O Liberado se tornou parte fundamental do nosso processo de compliance. A precisão dos dados é impressionante.' }
              ].map((t, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <p className="text-lg italic mb-6 text-slate-300">"{t.text}"</p>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-brand-electric font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security & LGPD */}
      <section id="seguranca" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-20 h-20 bg-brand-electric/10 text-brand-electric rounded-3xl flex items-center justify-center shrink-0">
            <Lock size={40} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl text-brand-deep mb-4">Segurança de dados e Compliance LGPD</h2>
            <p className="text-slate-600 leading-relaxed">
              Tratamos a segurança como prioridade máxima. Toda a nossa infraestrutura é criptografada e operamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD), garantindo que as consultas sejam feitas de forma ética e legal.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-brand-electric rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-electric/30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-40 h-40 border-4 border-white rounded-full -ml-24 -mt-24" />
            <div className="absolute bottom-0 right-0 w-60 h-60 border-4 border-white rounded-full -mr-40 -mb-40" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl mb-8">Tome decisões com mais segurança agora.</h2>
            <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que utilizam o Liberado App para construir equipes e parcerias de confiança.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-brand-deep text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-brand-deep/90 transition-all shadow-xl flex items-center gap-3"
              >
                Solicitar demonstração <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-20 pb-10 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <Logo className="mb-6" />
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                Facilite processos de seleção e minimize riscos em admissões. Saiba quem está contratando!
              </p>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/liberadoapp/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-electric hover:text-white transition-all">
                  <Linkedin size={20} />
                </a>
                <a href="https://www.instagram.com/liberadoapp/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-electric hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://www.youtube.com/@Liberadoapp-ts4tn" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-electric hover:text-white transition-all">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-brand-deep mb-6">Produto</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#solucao" className="hover:text-brand-electric">Funcionalidades</a></li>
                <li><a href={API_DOCS_LINK} target="_blank" rel="noreferrer" className="hover:text-brand-electric">API Docs</a></li>
                <li><a href="#precos" className="hover:text-brand-electric">Preços</a></li>
                <li><a href="#como-funciona" className="hover:text-brand-electric">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-deep mb-6">Segmentos</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-electric">RH & Recrutamento</a></li>
                <li><a href="#" className="hover:text-brand-electric">Varejo</a></li>
                <li><a href="#" className="hover:text-brand-electric">Logística</a></li>
                <li><a href="#" className="hover:text-brand-electric">Fintechs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-deep mb-6">Empresa</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-electric">Sobre nós</a></li>
                <li><a href="#" className="hover:text-brand-electric">Carreiras</a></li>
                <li><a href="#" className="hover:text-brand-electric">Contato</a></li>
                <li><a href="#" className="hover:text-brand-electric">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <p>© 2026 Liberado App. Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <a href="https://www.liberadoapp.com/termos-de-uso/" target="_blank" rel="noreferrer" className="hover:text-brand-deep">Termos de Uso</a>
              <a href="https://www.liberadoapp.com/politica-e-privacidade/" target="_blank" rel="noreferrer" className="hover:text-brand-deep">Privacidade</a>
              <a href="https://www.liberadoapp.com/politica-e-privacidade/" target="_blank" rel="noreferrer" className="hover:text-brand-deep">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
