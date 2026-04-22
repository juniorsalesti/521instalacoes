/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Home, 
  Music, 
  ChevronRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Phone, 
  Instagram, 
  Facebook,
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    
    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-gold pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-16">
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gold uppercase tracking-[0.3em] text-xs font-medium mb-4 block"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="relative inline-block"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-ice text-left">
          {title}
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
          className="h-[1px] bg-gold mt-4"
        />
      </motion.div>
    </div>
  );
};

const Counter = ({ value, label, prefix = "", dark = false }: { value: number; label: string; prefix?: string; dark?: boolean }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={nodeRef} className="text-center p-4">
      <div className={`text-4xl md:text-5xl font-display mb-1 ${dark ? 'text-black' : 'text-gold'}`}>
        {prefix}{count}{value > 100 ? "+" : ""}
      </div>
      <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${dark ? 'text-black/60' : 'text-ice/60'}`}>{label}</div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-deep selection:bg-gold selection:text-black-deep">
      <CustomCursor />
      
      {/* HEADER */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black-deep/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8 border-b border-white/5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => scrollTo('hero')} className="group text-2xl md:text-3xl font-display font-bold text-ice tracking-tighter">
            521<span className="text-gold group-hover:pl-1 transition-all duration-300">Instalações</span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-10">
            {['Serviços', 'Diferenciais', 'Projetos', 'Contato'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-xs uppercase tracking-[0.2em] font-medium text-ice/70 hover:text-gold transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <a 
              href="https://wa.me/5519992225891" 
              className="bg-gold text-black-deep px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-500 shadow-lg shadow-gold/10"
            >
              Fale Conosco
            </a>
          </nav>

          <button 
            className="md:hidden text-ice focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 bg-black-deep z-[45] flex flex-col items-center justify-center space-y-8"
          >
            {['Serviços', 'Diferenciais', 'Projetos', 'Contato'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-3xl font-display text-ice hover:text-gold"
              >
                {item}
              </button>
            ))}
            <a 
              href="https://wa.me/5519992225891" 
              className="bg-gold text-black-deep px-10 py-4 text-sm uppercase tracking-widest font-bold"
            >
              Fale Conosco
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* BG GRID PATTERN FROM THEME */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

          <motion.div 
            style={{ opacity: heroOpacity }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[45vw] font-display font-black text-gold/5 pointer-events-none select-none z-0"
          >
            521
          </motion.div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              style={{ y: yRange }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block text-gold uppercase tracking-[0.5em] text-xs font-bold mb-6"
              >
                Premium Electrical Solutions
              </motion.span>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-display font-normal text-ice mb-6 md:mb-8 leading-tight tracking-tight px-4 md:px-0">
                Tecnologia. Precisão.<br />
                <span className="italic">Sofisticação.</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-ice/60 text-base md:text-xl mb-10 md:mb-12 font-light leading-relaxed px-4">
                Elétrica, automação e som para ambientes de alto padrão em Campinas e região. 
                Excelência técnica que valoriza sua arquitetura.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a 
                  href="https://wa.me/5519992225891" 
                  className="w-full sm:w-auto bg-gold text-black-deep px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-white transition-all duration-500 flex items-center justify-center group"
                >
                  Solicitar Orçamento
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={() => scrollTo('serviços')}
                  className="w-full sm:w-auto border border-white/20 text-ice px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-white/5 transition-all duration-500"
                >
                  Conheça Nossos Serviços
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-gold/50 to-gold animate-bounce-slow origin-top scale-y-0 animate-[grow_2s_ease-in-out_infinite]" />
          </motion.div>
        </section>

        {/* SERVICES SECTION */}
        <section id="serviços" className="py-24 md:py-32 bg-black-deep relative overflow-hidden">
          <div className="container mx-auto px-6">
            <SectionTitle title="Nossa Expertise" subtitle="Serviços Especializados" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Instalações Elétricas",
                  desc: "Projetos elétricos residenciais e comerciais com acabamento impecável e segurança certificada.",
                  icon: <Zap className="text-gold" size={32} />
                },
                {
                  title: "Automação Residencial",
                  desc: "Controle inteligente de iluminação, climatização e segurança na palma da sua mão.",
                  icon: <Home className="text-gold" size={32} />
                },
                {
                  title: "Som Ambiente",
                  desc: "Sistemas de áudio de alta fidelidade integrados discretamente à sua arquitetura.",
                  icon: <Music className="text-gold" size={32} />
                }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="p-8 md:p-10 bg-bg-card border border-white/5 hover:border-gold/50 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="mb-8 p-4 bg-black-deep inline-block border border-white/10 group-hover:border-gold/30 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-display text-ice mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-ice/50 font-light leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <div className="w-8 h-[1px] bg-gold group-hover:w-full transition-all duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIAIS SECTION */}
        <section id="diferenciais" className="py-24 md:py-32 bg-gray-dark/30 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-7xl font-display font-medium text-ice leading-tight mb-6 md:mb-8"
                >
                  Por que escolher <br />
                  <span className="text-gold italic">a 521?</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-ice/50 text-base md:text-lg font-light max-w-md mb-8 md:mb-12"
                >
                  Combinamos rigor técnico com uma visão estética apurada, garantindo que a tecnologia desapareça e o conforto prevaleça.
                </motion.p>
                <div className="hidden lg:block relative w-full aspect-video grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1000" 
                    alt="Luxury Interior" 
                    className="object-cover w-full h-full scale-110 hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black-deep/40" />
                </div>
              </div>
              
              <div className="space-y-8">
                {[
                  "Atendimento personalizado e consultivo",
                  "Parceria com marcas premium (Schneider, WEG, Sonance)",
                  "Projetos executados com rigor técnico e estético",
                  "Equipe treinada, uniformizada e pontual",
                  "Garantia em todos os serviços"
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start group"
                  >
                    <div className="mr-6 mt-1 text-gold text-[10px]">
                      ✦
                    </div>
                    <div>
                      <h4 className="text-xl text-ice font-medium group-hover:text-gold transition-colors">{item}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-10 bg-gold">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Counter value={200} label="Projetos Concluídos" prefix="+" dark />
            <Counter value={8} label="Anos de Experiência" prefix="+" dark />
            <Counter value={100} label="Satisfação Garantida" prefix="" dark />
            <Counter value={15} label="Cidades Atendidas" prefix="+" dark />
          </div>
        </section>

        {/* AREA OF ACTIVITY */}
        <section id="projetos" className="py-24 bg-black-deep relative">
          <div className="container mx-auto px-6 text-center">
            <SectionTitle title="Onde Atuamos" subtitle="Nossa Região" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl md:text-3xl font-display text-ice/80 mb-12 md:mb-16 leading-relaxed px-4"
            >
              Atendemos <span className="text-gold">Campinas</span>, Valinhos, Vinhedo, <br className="hidden md:block" />
              Indaiatuba, Paulínia e toda a região metropolitana.
            </motion.p>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left px-4 md:px-0">
              <div className="p-8 md:p-12 border border-white/5 bg-gray-dark/20 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={80} strokeWidth={0.5} className="md:w-[120px] md:h-[120px]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display text-ice mb-4 md:mb-6">Expertise Técnica</h3>
                <p className="text-ice/50 text-sm md:text-base font-light leading-relaxed">
                  Trabalhamos em estreita colaboração com arquitetos e engenheiros desde o início da obra para garantir que cada tomada, sensor ou caixa de som esteja perfeitamente posicionada.
                </p>
              </div>
              <div className="p-8 md:p-12 border border-white/5 bg-gray-dark/20 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity">
                  <Home size={80} strokeWidth={0.5} className="md:w-[120px] md:h-[120px]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display text-ice mb-4 md:mb-6">Suporte Platinum</h3>
                <p className="text-ice/50 text-sm md:text-base font-light leading-relaxed">
                  Não apenas instalamos. Oferecemos suporte contínuo para garantir que seu sistema de automação e som opere com performance máxima em todos os momentos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contato" className="py-32 bg-black-deep relative">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-dark/40 border border-gold/20 p-8 md:p-24 text-center relative overflow-hidden"
            >
              {/* Decorative circle */}
              <div className="absolute -top-24 -right-24 w-64 h-64 border border-gold/10 rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 border border-gold/10 rounded-full" />

              <h2 className="text-4xl md:text-7xl font-display text-ice mb-6 md:mb-8 leading-tight">
                Pronto para transformar <span className="text-gold italic">seu espaço?</span>
              </h2>
              <p className="text-ice/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 font-light px-4">
                Entre em contato e receba um orçamento personalizado, sem compromisso. 
                Nossa equipe está pronta para elevar o padrão do seu projeto.
              </p>
              <a 
                href="https://wa.me/5519992225891" 
                className="inline-flex w-full sm:w-auto items-center justify-center space-x-4 bg-gold text-black-deep px-8 md:px-12 py-5 md:py-6 text-xs md:text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20"
              >
                <Phone size={20} />
                <span>Chamar no WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 bg-black-footer border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
            <div>
              <div className="text-3xl font-display font-bold text-ice mb-6">
                521<span className="text-gold">Instalações</span>
              </div>
              <p className="text-ice/40 font-light leading-relaxed">
                Tecnologia com sofisticação. Transformando casas em lares inteligentes e espaços comerciais em ambientes de alta performance em Campinas e região.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">Contato</h4>
              <a href="tel:19992225891" className="text-ice/70 hover:text-gold transition-colors">(19) 99222-5891</a>
              <a href="mailto:contato@521instalacoes.com.br" className="text-ice/70 hover:text-gold transition-colors">contato@521instalacoes.com.br</a>
              <div className="pt-4 text-ice/40 text-sm">
                Rua Conceição, Campinas - SP
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">Siga-nos</h4>
              <div className="flex space-x-6">
                <a href="#" className="text-ice/50 hover:text-gold transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-ice/50 hover:text-gold transition-colors"><Facebook size={24} /></a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center text-ice/30 text-xs tracking-widest">
            <p>© 2025 521 INSTALAÇÕES — CAMPINAS, SP</p>
            <div className="mt-4 md:mt-0 flex space-x-8">
              <a href="#" className="hover:text-gold transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-gold transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.a
        href="https://wa.me/5519992225891"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center group"
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-widest leading-none">
          WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
