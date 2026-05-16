import { QRPreview } from "@/components/features/QRPreview";
import { ConfigPanel } from "@/components/features/ConfigPanel";
import { ExportButtons } from "@/components/features/ExportButtons";
import { AdminPanel } from "@/components/features/AdminPanel";
import { UserProfile } from "@/components/features/UserProfile";
import { AccessibilityMenu } from "@/components/features/AccessibilityMenu";
import { QRPresets } from "@/components/features/QRPresets";
import { 
  QrCode, 
  Sparkles, 
  Layout, 
  Download, 
  Settings2, 
  Info, 
  User, 
  ShieldCheck, 
  Home, 
  BookOpen, 
  HelpCircle, 
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'admin' | 'profile'>('generator');
  const { user, isAdmin } = useAuth();
  const { highContrast, fontSize } = useAccessibilityStore();

  useEffect(() => {
    // Apply font size class to html element for global rem scaling
    const html = document.documentElement;
    html.classList.remove('font-size-large', 'font-size-xl');
    if (fontSize === 'large') html.classList.add('font-size-large');
    if (fontSize === 'xl') html.classList.add('font-size-xl');
  }, [fontSize]);

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300 ${highContrast ? 'high-contrast' : ''}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold">
        Pular para o conteúdo principal
      </a>
      
      {/* Header */}
      <header className="h-20 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')} role="button" aria-label="Voltar para o Gerador">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-blue-200">
            <QrCode className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-foreground">QR Code Create</h1>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" aria-hidden="true" /> <span>Professional Generator</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-muted-foreground mr-4">
            <button 
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'generator' ? 'bg-secondary text-primary' : 'hover:text-primary'}`}
            >
              <Home className="w-4 h-4" /> Gerador
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'admin' ? 'bg-secondary text-primary' : 'hover:text-primary'}`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            )}
          </nav>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-1.5 py-1.5 rounded-full transition-all border-2 ${activeTab === 'profile' ? 'border-primary bg-secondary' : 'border-transparent hover:border-border focus-visible:border-primary'}`}
            aria-label="Meu Perfil"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Minha foto de perfil" className="w-8 h-8 rounded-full border border-border" referrerPolicy="no-referrer" />
            ) : (
              <div className="bg-secondary p-1.5 rounded-full">
                <User className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </button>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" aria-hidden="true" />
          
          <AccessibilityMenu />
        </div>
      </header>

      <main id="main-content" className="max-w-[1400px] mx-auto p-4 md:p-8 xl:p-12 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {activeTab === 'generator' && (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:auto-rows-[minmax(180px,auto)]"
              role="region"
              aria-label="Gerador de QR Code"
            >
              {/* Welcome Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-8 lg:col-span-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-end min-h-[320px]"
              >
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <QrCode className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-lg">
                  <span className="bg-white/20 text-white text-[10px] py-1 px-3 rounded-full font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
                    Rápido & Profissional
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
                    Crie códigos QR <br/>que as pessoas queiram <span className="text-blue-200 italic">escanear.</span>
                  </h2>
                  <p className="text-blue-100 text-lg font-medium opacity-90 max-w-sm">
                    Personalize cada detalhe, desde cores até o estilo dos pontos, com qualidade profissional.
                  </p>
                </div>
              </motion.div>

              {/* Quick Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-4 lg:col-span-4 bg-secondary rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-default border border-transparent hover:border-border transition-all"
              >
                <div className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Estilização em Tempo Real</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Feedback instantâneo enquanto você ajusta o design do seu código QR.
                  </p>
                </div>
              </motion.div>

              {/* Controls Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-5 lg:col-span-4 bg-card rounded-[2.5rem] border border-border shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden max-h-[600px]"
              >
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-foreground uppercase tracking-wider text-xs">Configurações</h3>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  <ConfigPanel />
                </div>
              </motion.div>

              {/* Preview Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-7 lg:col-span-5 bg-card rounded-[2.5rem] p-12 border border-border shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative group min-h-[400px]"
              >
                <div className="absolute top-8 left-10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Prévia ao Vivo</span>
                </div>
                
                <div className="w-full flex items-center justify-center">
                  <QRPreview />
                </div>

                <div className="absolute bottom-8 right-10 opacity-30 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                   <span className="text-[10px] font-bold text-muted-foreground capitalize">Atualização dinâmica ativa</span>
                </div>
              </motion.div>

              {/* Export Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-12 lg:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Download center</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Pronto para usar?</h3>
                  <ExportButtons />
                </div>
              </motion.div>

              {/* Tips Section */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="md:col-span-4 lg:col-span-4 bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100"
              >
                <div className="flex items-center gap-6 mb-4">
                  <div className="bg-amber-400/20 w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-amber-600">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground leading-tight">Como Escanear?</h4>
                    <p className="text-muted-foreground text-sm font-medium italic">Abra a câmera do seu celular e aponte para o código.</p>
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-amber-900/70 font-medium leading-relaxed">Certifique-se de que o contraste entre o fundo e os pontos seja alto.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-amber-900/70 font-medium leading-relaxed">EVITE colocar muitos dados para não deixar o código poluído.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="md:col-span-8 lg:col-span-8 bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-600">
                      <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-tight">Presets Expressos</h4>
                      <p className="text-muted-foreground text-sm font-medium leading-tight">Escolha um estilo pronto para acelerar seu trabalho.</p>
                    </div>
                  </div>
                  
                  <QRPresets />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-6"
            >
              <AdminPanel />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-6"
            >
              <UserProfile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-8 py-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-muted-foreground">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">QR Code Create</span>
          </div>
          <p className="text-sm font-medium">© 2026 Crafted with precision. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest">
          <Dialog>
            <DialogTrigger 
              render={
                <button className="hover:text-primary transition-colors flex items-center gap-2" />
              }
            >
              <Lock className="w-4 h-4" /> Privacidade
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle>Política de Privacidade</DialogTitle>
                <DialogDescription className="space-y-4 pt-4 leading-relaxed">
                  <p>Sua privacidade é nossa prioridade. Todos os QR Codes gerados aqui são processados localmente ou em nossos servidores seguros para garantir que seus dados nunca sejam expostos.</p>
                  <p>Não compartilhamos nenhuma informação pessoal com terceiros e seguimos as diretrizes da LGPD.</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger 
              render={
                <button className="hover:text-primary transition-colors flex items-center gap-2" />
              }
            >
              <BookOpen className="w-4 h-4" /> Termos
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle>Termos de Uso</DialogTitle>
                <DialogDescription className="space-y-4 pt-4 leading-relaxed">
                  <p>Ao utilizar este gerador, você concorda em não criar códigos QR para fins ilícitos, phishing ou spam.</p>
                  <p>O criador da ferramenta não se responsabiliza pelo uso indevido dos códigos gerados por terceiros.</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger 
              render={
                <button className="hover:text-primary transition-colors flex items-center gap-2" />
              }
            >
              <HelpCircle className="w-4 h-4" /> Suporte
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle>Ajuda & Suporte</DialogTitle>
                <DialogDescription className="space-y-4 pt-4 leading-relaxed">
                  <p>Precisa de ajuda? Entre em contato conosco através do e-mail oficial (exemplo@qrcodecreate.com).</p>
                  <p>Nossa equipe está disponível de Segunda a Sexta, das 9h às 18h.</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
}
