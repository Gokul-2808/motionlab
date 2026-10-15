import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  Code2,
  Command,
  Copy,
  Globe2,
  Layers3,
  Menu,
  Moon,
  MousePointer2,
  Palette,
  Search,
  Send,
  Sun,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

const projects = [
  { id: "aura", number: "01", title: "AURA", category: "Digital", year: "2026", descriptor: "A quieter kind of digital wellness.", role: "Digital experience · Art direction · Interaction", palette: "aura", challenge: "Make a wellness product feel calm, considered, and genuinely useful in a world full of noise.", concept: "A soft, responsive interface built around breathing space, tactile controls, and a visual rhythm that follows the user rather than competing for attention.", details: ["Art direction", "Interface design", "Motion system"] },
  { id: "nova", number: "02", title: "NØVA", category: "Experimental", year: "2026", descriptor: "A launch experience for what comes next.", role: "Campaign · Creative development · Motion", palette: "nova", challenge: "Turn a product launch into a digital moment people want to explore instead of a page they simply scroll past.", concept: "A high-contrast visual world, playful transitions, and a project reveal that gives every interaction a clear purpose.", details: ["Campaign concept", "Web animation", "Creative coding"] },
  { id: "form", number: "03", title: "FORM", category: "Branding", year: "2025", descriptor: "Architecture, reduced to its essentials.", role: "Identity system · Editorial · Digital", palette: "form", challenge: "Create a flexible identity for a contemporary architecture practice without relying on predictable building imagery.", concept: "A typographic system inspired by plans, grids, light, and material. The website becomes a gallery for the spaces rather than a frame around them.", details: ["Brand identity", "Digital art direction", "Editorial system"] },
  { id: "afterhours", number: "04", title: "AFTERHOURS", category: "Digital", year: "2025", descriptor: "A home for sound after dark.", role: "Culture platform · Experience design", palette: "afterhours", challenge: "Give an independent music community a digital home with the energy of a live venue.", concept: "Oversized type, shifting gradients, live-event modules, and a modular layout that feels different every time you visit.", details: ["Experience strategy", "UI design", "Motion direction"] },
  { id: "orbit", number: "05", title: "ORBIT", category: "Experimental", year: "2026", descriptor: "Complex information. Clear direction.", role: "Data experience · Product design", palette: "orbit", challenge: "Make dense information feel approachable without stripping away the details that make it valuable.", concept: "A data-led interface that uses hierarchy, restrained colour, and responsive panels to turn exploration into a clear journey.", details: ["Product strategy", "Dashboard UI", "Data visualisation"] },
  { id: "earthform", number: "06", title: "EARTHFORM", category: "Branding", year: "2025", descriptor: "A more thoughtful material future.", role: "Sustainability · Identity · Digital", palette: "earthform", challenge: "Communicate sustainability with confidence and clarity, without leaning on the usual visual clichés.", concept: "A tactile identity using earthy tones, material-led imagery, and a clear editorial system to make a complex subject feel human.", details: ["Visual identity", "Digital design", "Storytelling"] },
];

const categories = ["All", "Digital", "Branding", "Experimental"];
const navItems = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];
const processSteps = [
  { number: "01", title: "Discover", kicker: "Understand the why", description: "We ask better questions, find the real opportunity, and align the team around a shared direction.", icon: Search },
  { number: "02", title: "Design", kicker: "Make the idea visible", description: "We explore art direction, prototypes, and interaction patterns until the experience feels unmistakably right.", icon: Palette },
  { number: "03", title: "Build", kicker: "Bring it to life", description: "We turn the chosen direction into a responsive, accessible, and carefully engineered digital product.", icon: Code2 },
  { number: "04", title: "Launch", kicker: "Put it into the world", description: "We test the details, refine the experience, and prepare the work to perform in the real world.", icon: Zap },
];

function MagneticButton({ children, className = "", onClick, href, variant = "primary", type = "button" }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const handleMove = (event) => {
    if (reduceMotion || !ref.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.12}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0px, 0px)"; };
  const props = { ref, className: `button button--${variant} ${className}`, onMouseMove: handleMove, onMouseLeave: reset, onClick, type };
  return href ? <a {...props} href={href}>{children}</a> : <button {...props}>{children}</button>;
}

function CustomCursor({ enabled }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const isCoarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (!enabled || isCoarsePointer) return undefined;
    const move = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
      setHovering(Boolean(event.target.closest("a, button, [data-cursor='interactive']")));
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled, isCoarsePointer]);

  if (!enabled || isCoarsePointer) return null;
  return <div className={`custom-cursor ${visible ? "is-visible" : ""} ${hovering ? "is-hovering" : ""}`} style={{ left: position.x, top: position.y }} aria-hidden="true"><span /></div>;
}

function ProjectArtwork({ project }) {
  return (
    <div className={`project-art project-art--${project.palette}`}>
      <div className="art-grain" />
      {project.palette === "aura" && <>
        <div className="aura-orb aura-orb--one" /><div className="aura-orb aura-orb--two" />
        <div className="aura-ring aura-ring--one" /><div className="aura-ring aura-ring--two" />
        <span className="art-caption">FIND YOUR<br />OWN RHYTHM</span>
      </>}
      {project.palette === "nova" && <>
        <div className="nova-sun" /><div className="nova-orbit nova-orbit--one" /><div className="nova-orbit nova-orbit--two" />
        <span className="nova-type">NØVA<span>®</span></span><span className="nova-coordinate">37° 33' 12.8" N</span>
      </>}
      {project.palette === "form" && <>
        <div className="form-block form-block--one" /><div className="form-block form-block--two" /><div className="form-block form-block--three" /><div className="form-line" />
        <span className="form-number">F—014<br />STUDY IN SPACE</span>
      </>}
      {project.palette === "afterhours" && <>
        <div className="after-disc after-disc--one" /><div className="after-disc after-disc--two" /><div className="after-disc after-disc--three" />
        <span className="after-type">STAY<br />A LITTLE<br /><em>LONGER.</em></span><span className="after-label">INDEPENDENT SOUND / VOL. 06</span>
      </>}
      {project.palette === "orbit" && <>
        <div className="orbit-planet" /><div className="orbit-line orbit-line--one" /><div className="orbit-line orbit-line--two" /><div className="orbit-dot orbit-dot--one" /><div className="orbit-dot orbit-dot--two" />
        <span className="orbit-label">SIGNAL / 0084</span>
      </>}
      {project.palette === "earthform" && <>
        <div className="earth-shape earth-shape--one" /><div className="earth-shape earth-shape--two" /><div className="earth-shape earth-shape--three" />
        <span className="earth-type">MADE OF<br /><i>tomorrow.</i></span><span className="earth-label">MATERIALS FOR A BETTER WORLD</span>
      </>}
      <span className="art-index">{project.number} / 06</span><span className="art-arrow"><ArrowUpRight size={19} /></span>
    </div>
  );
}

function ProjectCard({ project, onOpen, index }) {
  return <motion.article className="project-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, delay: (index % 3) * 0.06 }}>
    <button className="project-card__trigger" onClick={() => onOpen(project)} aria-label={`View ${project.title} project`}>
      <ProjectArtwork project={project} />
      <div className="project-card__meta"><div><span className="eyebrow">{project.category} / {project.year}</span><h3>{project.title}</h3><p>{project.descriptor}</p></div><span className="project-card__open"><ArrowUpRight size={20} /></span></div>
    </button>
  </motion.article>;
}

function ProjectModal({ project, onClose, onChange }) {
  useEffect(() => {
    if (!project) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange(1);
      if (event.key === "ArrowLeft") onChange(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [project, onClose, onChange]);

  return <AnimatePresence>
    {project && <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.99 }} transition={{ duration: 0.28 }}>
        <div className="project-modal__top"><span className="eyebrow">SELECTED PROJECT / {project.number}</span><button className="icon-button" onClick={onClose} aria-label="Close project details"><X size={20} /></button></div>
        <div className="project-modal__art"><ProjectArtwork project={project} /></div>
        <div className="project-modal__content">
          <div className="project-modal__heading"><div><span className="eyebrow">{project.category} · {project.year}</span><h2 id="modal-title">{project.title}</h2></div><p>{project.role}</p></div>
          <p className="project-modal__intro">{project.descriptor} This concept explores how a carefully designed digital experience can make the ordinary feel memorable.</p>
          <div className="project-modal__description"><div><span className="eyebrow">01 / THE CHALLENGE</span><p>{project.challenge}</p></div><div><span className="eyebrow">02 / THE IDEA</span><p>{project.concept}</p></div></div>
          <div className="project-modal__snapshot">
            <div className="project-modal__snapshot-head"><span className="eyebrow">INSIDE THE PROJECT</span><span className="eyebrow">WHAT WENT INTO IT ↘</span></div>
            <div className="project-modal__deliverables">{project.details.map((detail, index) => <div className="project-modal__deliverable" key={detail}><span>0{index + 1}</span><div><strong>{detail}</strong><p>{index === 0 ? "A clear direction built around the core idea." : index === 1 ? "A visual system shaped for consistency and character." : "Thoughtful details that make the experience feel alive."}</p></div><ArrowUpRight size={16} /></div>)}</div>
          </div>
          <div className="project-modal__bottom"><div className="tag-list">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div><div className="modal-arrows"><button className="icon-button" onClick={() => onChange(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button><button className="icon-button" onClick={() => onChange(1)} aria-label="Next project"><ArrowRight size={18} /></button></div></div>
          <button className="project-modal__next" onClick={() => onChange(1)}>EXPLORE NEXT PROJECT <ArrowUpRight size={16} /></button>
        </div>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}

function CommandPalette({ open, onClose, onNavigate, onTheme, theme, onProject }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const actions = useMemo(() => [
    ...navItems.map((item) => ({ label: `Go to ${item.label}`, detail: item.href, action: () => onNavigate(item.href) })),
    { label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, detail: "Appearance", action: onTheme },
    ...projects.map((project) => ({ label: `Open ${project.title}`, detail: `Project · ${project.category}`, action: () => onProject(project) })),
  ], [theme, onNavigate, onTheme, onProject]);
  const filtered = actions.filter((action) => `${action.label} ${action.detail}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return <AnimatePresence>
    {open && <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}>
        <div className="command-search"><Search size={19} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What would you like to do?" aria-label="Search commands" /><kbd>ESC</kbd></div>
        <div className="command-results"><span className="eyebrow">QUICK ACTIONS</span>
          {filtered.length ? filtered.slice(0, 9).map((action) => <button className="command-result" key={action.label} onClick={() => { action.action(); onClose(); }}><span>{action.label}</span><small>{action.detail}</small><ArrowUpRight size={16} /></button>) : <p className="command-empty">No matching actions. Try another search.</p>}
        </div>
        <div className="command-footer"><span><kbd>↵</kbd> Select an action</span><span><kbd>ESC</kbd> Close</span></div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

function App() {
  const systemReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("motionlab-theme") || "dark"; } catch { return "dark"; }
  });
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [reducedEffects, setReducedEffects] = useState(Boolean(systemReduceMotion));
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState({ type: "idle", message: "" });
  const [copied, setCopied] = useState(false);
  const galleryRef = useRef(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, reducedEffects ? 0 : 80]);
  const visibleProjects = projects.filter((project) => activeCategory === "All" || project.category === activeCategory);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("motionlab-theme", theme); } catch { /* local storage may be disabled */ }
  }, [theme]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") { setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = useCallback((href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: reducedEffects ? "auto" : "smooth", block: "start" });
  }, [reducedEffects]);

  const changeProject = useCallback((direction) => {
    if (!activeProject) return;
    const index = projects.findIndex((item) => item.id === activeProject.id);
    setActiveProject(projects[(index + direction + projects.length) % projects.length]);
  }, [activeProject]);

  const moveGallery = (direction) => {
    if (!galleryRef.current) return;
    const card = galleryRef.current.querySelector(".project-card");
    const amount = card ? card.getBoundingClientRect().width + 22 : 420;
    galleryRef.current.scrollBy({ left: amount * direction, behavior: reducedEffects ? "auto" : "smooth" });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormState({ type: "error", message: "Please complete all three fields." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormState({ type: "error", message: "Enter a valid email address." });
      return;
    }
    setFormState({ type: "success", message: "Looks good! This is a frontend demo, so your message has not been sent." });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@motionlab.studio");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:hello@motionlab.studio";
    }
  };

  return <div className={`app-shell ${reducedEffects ? "motion-reduced" : ""}`}>
    <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />
    <CustomCursor enabled={cursorEnabled && !reducedEffects} />

    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="MotionLab home" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reducedEffects ? "auto" : "smooth" }); }}><span className="wordmark__symbol"><Asterisk size={28} strokeWidth={2.5} /></span><span>MOTION<span>LAB</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}<span /></a>)}</nav>
      <div className="header-actions">
        <button className="header-shortcut" onClick={() => setCommandOpen(true)} aria-label="Open command palette"><Command size={15} /><kbd>K</kbd></button>
        <button className="theme-toggle" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
        <MagneticButton href="#contact" className="header-cta">Let's talk <ArrowUpRight size={15} /></MagneticButton>
        <button className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} aria-label="Mobile navigation">
      {navItems.map((item, index) => <motion.a key={item.href} href={item.href} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} onClick={(event) => { event.preventDefault(); navigate(item.href); }}>{item.label}<ArrowUpRight size={18} /></motion.a>)}
      <button onClick={() => { setCommandOpen(true); setMenuOpen(false); }}><Command size={17} /> Open command menu</button>
    </motion.nav>}</AnimatePresence>

    <main id="top">
      <section className="hero section-wrap">
        <motion.div className="hero-copy" style={{ y: heroY }}>
          <motion.div className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><span className="status-dot" /> INDEPENDENT DIGITAL STUDIO <span className="eyebrow-divider">/</span> EST. 2026</motion.div>
          <h1 aria-label="We make digital feel different">
            <span className="hero-line"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>WE MAKE</motion.span></span>
            <span className="hero-line"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}>DIGITAL</motion.span><span className="hero-star"><Asterisk /></span></span>
            <span className="hero-line hero-line--last"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>FEEL <em>DIFFERENT.</em></motion.span></span>
          </h1>
          <div className="hero-bottom"><p>We build digital experiences with a point of view — where thoughtful design meets meaningful interaction.</p><MagneticButton href="#work" className="hero-cta">Explore our work <ArrowDownRight size={18} /></MagneticButton></div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.92, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
          <div className="hero-art__grid" /><div className="hero-orbit hero-orbit--outer" /><div className="hero-orbit hero-orbit--inner" /><div className="hero-core"><Asterisk size={94} strokeWidth={1.1} /></div>
          <div className="hero-art__label hero-art__label--top">IDEAS IN MOTION <span>↗</span></div><div className="hero-art__label hero-art__label--bottom">DESIGN / CODE / CULTURE</div><span className="hero-art__cross hero-art__cross--one">+</span><span className="hero-art__cross hero-art__cross--two">+</span>
        </motion.div>
        <div className="hero-footer"><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span><span>CHENNAI · EVERYWHERE</span><span>01 — 06</span></div>
      </section>

      <section className="ticker" aria-label="Studio capabilities"><div className="ticker-track">{Array.from({ length: 2 }, (_, group) => <div className="ticker-group" key={group} aria-hidden={group === 1}>{["DIGITAL EXPERIENCES", "INTERACTION DESIGN", "CREATIVE DEVELOPMENT", "MOTION SYSTEMS"].map((item) => <span key={item}>{item}<Asterisk size={22} /></span>)}</div>)}</div></section>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading"><div><span className="eyebrow"><span className="section-index">01</span> / SELECTED WORK</span><h2>Ideas made<br /><em>tangible.</em></h2></div><div className="section-heading__aside"><p>A selection of concepts, experiments, and digital worlds built to make people feel something.</p><span className="project-count">06 PROJECTS <ArrowDownRight size={15} /></span></div></div>
        <div className="gallery-toolbar"><div className="filter-list" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter-chip is-active" : "filter-chip"} onClick={() => setActiveCategory(category)}>{category}<span>{category === "All" ? projects.length : projects.filter((project) => project.category === category).length}</span></button>)}</div><div className="gallery-controls"><span>DRAG TO EXPLORE</span><button className="icon-button" onClick={() => moveGallery(-1)} aria-label="Scroll projects left"><ArrowLeft size={18} /></button><button className="icon-button" onClick={() => moveGallery(1)} aria-label="Scroll projects right"><ArrowRight size={18} /></button></div></div>
        <div className="project-gallery" ref={galleryRef} data-cursor="interactive"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            dragState.current = { active: true, startX: event.clientX, scrollLeft: galleryRef.current.scrollLeft, moved: false };
          }}
          onPointerMove={(event) => {
            if (!dragState.current.active || !galleryRef.current) return;
            const delta = event.clientX - dragState.current.startX;
            if (Math.abs(delta) > 5) dragState.current.moved = true;
            if (dragState.current.moved) galleryRef.current.scrollLeft = dragState.current.scrollLeft - delta;
          }}
          onPointerUp={() => { dragState.current.active = false; }}
          onPointerLeave={() => { dragState.current.active = false; }}
          onPointerCancel={() => { dragState.current.active = false; }}
          onClickCapture={(event) => {
            if (dragState.current.moved) { event.preventDefault(); event.stopPropagation(); dragState.current.moved = false; }
          }}>
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={setActiveProject} />)}
        </div>
        <div className="gallery-footnote"><span><MousePointer2 size={15} /> CLICK + DRAG TO EXPLORE</span><span>USE ARROWS TO NAVIGATE <ArrowRight size={13} /></span></div>
      </section>

      <section className="studio-section" id="studio"><div className="studio-inner section-wrap">
        <div className="studio-top"><span className="eyebrow"><span className="section-index">02</span> / THE STUDIO</span><span className="studio-index">A DIFFERENT<br />POINT OF VIEW.</span></div>
        <div className="studio-statement"><span>GOOD DESIGN</span><span>GETS <em>ATTENTION.</em></span><span>GREAT INTERACTION</span><span>MAKES IT <em>MATTER.</em></span><Asterisk className="studio-asterisk" /></div>
        <div className="studio-bottom"><p>We bring strategy, design, and technology together to make digital feel less like a screen — and more like an experience worth remembering.</p><a href="#process" className="text-link">How we work <ArrowDownRight size={17} /></a></div>
        <div className="studio-orbit" aria-hidden="true"><div /><div /><div /><Asterisk /></div>
      </div></section>

      <section className="capabilities-section section-wrap"><div className="capabilities-heading"><span className="eyebrow">WHAT WE BRING TO THE TABLE</span><p>Curiosity first.<br />Craft always.</p></div>
        <div className="capability-list">{[
          ["01", "Digital experiences", "Websites, platforms, and products with purpose.", Globe2],
          ["02", "Interaction & motion", "Interfaces that respond, guide, and surprise.", MousePointer2],
          ["03", "Creative development", "Design-led code built to perform in the real world.", Code2],
          ["04", "Visual identities", "Distinctive systems made to move across mediums.", Layers3],
        ].map(([number, title, description, Icon]) => <div className="capability-row" key={number}><span className="capability-number">{number}</span><h3>{title}</h3><p>{description}</p><Icon size={20} /></div>)}</div>
      </section>

      <section className="playground-section section-wrap" id="playground">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow"><span className="section-index">03</span> / INTERACTION LAB</span><h2>Play with<br /><em>the details.</em></h2></div><div className="section-heading__aside"><p>A little sandbox for the small details that make an interface feel alive.</p></div></div>
        <div className="playground-grid">
          <div className="playground-card playground-card--controls"><div className="playground-card__top"><span className="eyebrow">CONTROL ROOM / 001</span><Zap size={16} /></div><h3>Make it<br /><em>your own.</em></h3><p>Change the behaviour of this experience. Your preferences stay on this device.</p>
            <div className="setting-row"><div><span>Cursor effects</span><small>Interactive pointer feedback</small></div><button className={`switch ${cursorEnabled ? "is-on" : ""}`} role="switch" aria-checked={cursorEnabled} onClick={() => setCursorEnabled((value) => !value)}><span /></button></div>
            <div className="setting-row"><div><span>Reduced motion</span><small>Keep movement to a minimum</small></div><button className={`switch ${reducedEffects ? "is-on" : ""}`} role="switch" aria-checked={reducedEffects} onClick={() => setReducedEffects((value) => !value)}><span /></button></div>
            <div className="setting-row"><div><span>Colour theme</span><small>Change the whole canvas</small></div><button className="theme-text-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")}>{theme === "dark" ? "Dark" : "Light"} <ArrowUpRight size={14} /></button></div>
            <button className="settings-reset" onClick={() => { setCursorEnabled(true); setReducedEffects(Boolean(systemReduceMotion)); setTheme("dark"); }}>Reset preferences <ArrowRight size={14} /></button>
          </div>
          <div className="playground-card playground-card--demo"><div className="playground-card__top"><span className="eyebrow">MICRO-INTERACTION / 002</span><span className="live-label"><span /> LIVE DEMO</span></div>
            <div className="demo-canvas"><div className="demo-cross demo-cross--one">+</div><div className="demo-cross demo-cross--two">+</div><motion.div className="demo-orb" animate={reducedEffects ? {} : { y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><Asterisk size={62} /></motion.div><div className="demo-label demo-label--left">MOTION<br />STUDY 01</div><div className="demo-label demo-label--right">X: 042<br />Y: 018</div></div>
            <div className="demo-bottom"><div><span className="eyebrow">MOVE YOUR CURSOR</span><p>Small details. Different feeling.</p></div><MagneticButton variant="outline" onClick={() => setCommandOpen(true)}>Open command menu <Command size={15} /></MagneticButton></div>
          </div>
        </div>
        <div className="command-hint"><Command size={14} /> PRESS <kbd>CTRL</kbd> + <kbd>K</kbd> TO OPEN THE COMMAND PALETTE <span>TRY IT ↗</span></div>
      </section>

      <section className="process-section" id="process"><div className="section-wrap">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow"><span className="section-index">04</span> / THE PROCESS</span><h2>From first thought<br />to <em>full feeling.</em></h2></div><div className="section-heading__aside"><p>Good work rarely happens by accident. Here's how we get from a question to an experience.</p></div></div>
        <div className="process-layout"><div className="process-step-list">{processSteps.map((step, index) => <button key={step.number} className={`process-step ${activeStep === index ? "is-active" : ""}`} onClick={() => setActiveStep(index)}><span>{step.number}</span><strong>{step.title}</strong><ArrowUpRight size={18} /></button>)}</div>
          <AnimatePresence mode="wait"><motion.div className="process-detail" key={activeStep} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reducedEffects ? 0 : 0.25 }}>
            {(() => { const step = processSteps[activeStep]; const Icon = step.icon; return <><div className="process-detail__icon"><Icon size={29} /></div><span className="eyebrow">STEP {step.number} / 04</span><h3>{step.kicker}</h3><p>{step.description}</p><div className="process-progress"><span style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }} /></div><div className="process-detail__footer"><span>0{activeStep + 1} — 04</span><div><button className="icon-button" disabled={activeStep === 0} onClick={() => setActiveStep((value) => value - 1)} aria-label="Previous step"><ArrowLeft size={17} /></button><button className="icon-button" disabled={activeStep === processSteps.length - 1} onClick={() => setActiveStep((value) => value + 1)} aria-label="Next step"><ArrowRight size={17} /></button></div></div></>; })()}
          </motion.div></AnimatePresence>
        </div>
      </div></section>

      <section className="contact-section section-wrap" id="contact">
        <div className="contact-kicker"><span className="eyebrow"><span className="section-index">05</span> / YOUR TURN</span><span className="live-label"><span /> OPEN TO GOOD IDEAS</span></div>
        <div className="contact-heading"><h2>HAVE A GOOD<br />IDEA? LET'S<br /><em>MAKE IT MOVE.</em></h2><Asterisk className="contact-asterisk" /></div>
        <div className="contact-grid"><div className="contact-copy"><p>Have a project, a question, or an idea that won't leave you alone? We'd love to hear about it.</p><button className="email-copy" onClick={copyEmail}><span>hello@motionlab.studio</span>{copied ? <Check size={17} /> : <Copy size={16} />}</button><span className="demo-note">DEMO ADDRESS · NO EMAIL IS SENT FROM THIS SITE</span></div>
          <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
            <label>Your name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="How should we call you?" autoComplete="name" /></label>
            <label>Your email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" autoComplete="email" /></label>
            <label>Tell us a little about it<textarea rows="3" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="A little context goes a long way..." /></label>
            <div className="form-submit-row"><button type="submit" className="button button--primary">Check message <Send size={16} /></button><span>FRONTEND DEMO ONLY</span></div>
            {formState.type !== "idle" && <p className={`form-feedback form-feedback--${formState.type}`} role="status">{formState.message}</p>}
          </form>
        </div>
      </section>
    </main>

    <footer className="site-footer"><a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reducedEffects ? "auto" : "smooth" }); }}><span className="wordmark__symbol"><Asterisk size={27} /></span><span>MOTION<span>LAB</span></span></a><span className="footer-center">DESIGNED WITH INTENTION. BUILT WITH CURIOSITY.</span><div className="footer-right"><span>© 2026 MOTIONLAB</span><button onClick={() => window.scrollTo({ top: 0, behavior: reducedEffects ? "auto" : "smooth" })}>BACK TO TOP ↑</button></div></footer>

    <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} onChange={changeProject} />
    <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={navigate} onTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} theme={theme} onProject={(project) => setActiveProject(project)} />
  </div>;
}

export default App;
