"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BarChart3,
  Briefcase,
  ChevronDown,
  FileText,
  FolderOpen,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./HeroScene";

const navItems = [
  { href: "#about", label: "About", icon: UserRound },
  { href: "#figures", label: "Figures", icon: BarChart3 },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#skills", label: "Skills", icon: Wrench },
  { href: "#projects", label: "Projects", icon: FolderOpen },
  { href: "#resume", label: "Resume", icon: FileText },
  { href: "#contact", label: "Contact", icon: MessageCircle }
];

const skillGroups = [
  {
    title: "Product & Growth",
    skills: [
      "Product Thinking",
      "Go-to-Market",
      "Growth Marketing",
      "Business Development",
      "Market Research",
      "Digital Strategy",
      "Stakeholder Coordination",
      "Technical Documentation",
      "Public Speaking",
      "Team Leadership",
      "Entrepreneurship"
    ]
  },
  {
    title: "Engineering",
    skills: [
      "Python",
      "FastAPI",
      "Flask",
      "REST API Integration",
      "Git Version Control",
      "Postman",
      "Schema Design",
      "System Optimization"
    ]
  },
  {
    title: "AI & Automation",
    skills: [
      "LangChain",
      "Langfuse",
      "n8n",
      "GitHub Actions",
      "Prompt Engineering",
      "LLM Fine-Tuning",
      "AI Agent Development",
      "Multi Agent Workflows",
      "Claude AI Suite",
      "RAG Pipelines"
    ]
  },
  {
    title: "Data, Cloud & DevOps",
    skills: [
      "Azure Cloud Services",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Blob Storage",
      "Docker",
      "RunPod",
      "Supabase",
      "Power BI",
      "ETL Pipelines",
      "CI/CD Pipelines",
      "DevOps Fundamentals"
    ]
  },
  {
    title: "Cybersecurity",
    skills: [
      "Burp Suite",
      "Penetration Testing",
      "Web Application Security",
      "OWASP Top 10",
      "SQL Injection Testing",
      "SIEM Monitoring",
      "SOC Alert Triage",
      "Log Analysis",
      "Threat Detection",
      "UNIX & Windows Testing",
      "Linux Security",
      "Windows Security",
      "Active Directory Exploitation",
      "Privilege Escalation",
      "Reconnaissance & Enumeration",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Vulnerability Assessment",
      "Security Testing"
    ]
  }
];

const projects = [
  {
    title: "Extensible Tool Calling During Runtime",
    category: "Developer platform architecture",
    description:
      "Designed a runtime-extensible isolated plugin architecture that supports dynamic tool registration, validation, and execution without FastAPI server restarts.",
    outcomes: ["Runtime extensibility", "Plugin validation", "Reduced operational friction"],
    tags: ["FastAPI", "Architecture", "Tooling"]
  },
  {
    title: "Rule-Based NLP Marketing Chatbot",
    category: "Marketing strategy automation",
    description:
      "Built a chatbot using Python, Flask, RAG, and Ollama to process product brochures and generate B2B/B2C marketing strategy using the AIDA framework.",
    outcomes: ["Brochure-to-strategy workflow", "AIDA-led messaging", "Product marketing support"],
    tags: ["Python", "Flask", "RAG"]
  },
  {
    title: "BloodBridge",
    category: "Emergency response product concept",
    description:
      "Developed an AI-based donor-recipient matching and route optimization system to improve emergency blood donation response.",
    outcomes: ["Matching logic", "Route optimization", "Healthcare impact framing"],
    tags: ["MongoDB", "scikit-learn", "OpenAI"]
  },
  {
    title: "Creative Axis Digital Launch",
    category: "Client website and business setup",
    description:
      "Designed and delivered a web presence for a UAE building maintenance company, including website creation, domain configuration, and business email setup.",
    outcomes: ["End-to-end launch ownership", "Business-ready digital presence", "Service-led positioning"],
    tags: ["Website Building", "Domains", "Client Delivery"]
  },
  {
    title: "SmartGuard SOC",
    category: "AI-powered security operations console",
    description:
      "Built a SOC simulation platform with Flask request logging, ML-based intrusion detection, rule-based scan overrides, automated firewall blocking, and a live Streamlit threat dashboard.",
    outcomes: ["Live alert feed", "Automated IP blocking", "Brute-force, scan, and web-attack detection"],
    tags: ["Flask", "Streamlit", "scikit-learn", "Cybersecurity"]
  },
  {
    title: "Power Grid Fault Intelligence",
    category: "Electrical fault detection and classification",
    description:
      "Developed a machine learning workflow to analyze current and voltage signals, detect grid faults, classify fault types, and visualize phase behavior across multiple line-fault scenarios.",
    outcomes: ["LSTM fault detection", "MLP fault classification", "Signal visualization and correlation analysis"],
    tags: ["Python", "TensorFlow", "scikit-learn", "Seaborn"]
  }
];

const profileStats = [
  { value: "500+", label: "connections across startup, student, and tech ecosystems" },
  { value: "4+", label: "leadership roles across entrepreneurship and business societies" },
  { value: "10", label: "certifications spanning cyber, finance, analytics, and technology" }
];

const experiences = [
  {
    role: "AI & Automation Engineer Intern",
    company: "SPARK XI AI Engineering & Consulting",
    date: "Jan 2026 - Present",
    location: "Dubai, United Arab Emirates",
    detail:
      "Built scalable orchestration workflows with n8n, Python, and API integrations, reducing operational overhead by 40% across client integrations."
  },
  {
    role: "Project Intern",
    company: "PLUSX Electric",
    date: "Jun 2024 - Aug 2024",
    location: "Dubai, United Arab Emirates",
    detail:
      "Developed AI-powered automation pipelines using Python, Flask, and n8n, improving operational efficiency by 35%."
  },
  {
    role: "Business Operations Intern",
    company: "Creative Axis Building Contracting",
    date: "Jun 2023 - Sep 2023",
    location: "Dubai, United Arab Emirates",
    detail:
      "Managed administrative operations and domain projects while coordinating cross-functional delivery to reduce manual work and improve efficiency by 20%."
  }
];

const universityRoles = [
  {
    role: "Ex Officio",
    company: "E-Cell BPDC",
    date: "Jun 2025 - Present",
    location: "Dubai, United Arab Emirates",
    detail:
      "Supporting continuity, strategic direction, and institutional memory for BPDC's entrepreneurship community."
  },
  {
    role: "Startup Coordinator - Institute Innovation Council",
    company: "Birla Institute of Technology and Science, Pilani",
    date: "Jun 2025 - Present",
    location: "Dubai, United Arab Emirates",
    detail:
      "Coordinating startup-focused initiatives that connect student ideas with structured innovation activity."
  },
  {
    role: "General Secretary - Entrepreneurship Cell",
    company: "E-Cell BPDC",
    date: "Jul 2024 - Jun 2025",
    location: "On-site",
    detail:
      "Led operational coordination, event planning, and team execution across entrepreneurship programming."
  },
  {
    role: "Head of Marketing",
    company: "The Wall Street Club",
    date: "Jun 2024 - Jun 2025",
    location: "Dubai, United Arab Emirates",
    detail:
      "Owned marketing direction for finance-focused student initiatives, improving event visibility and audience reach."
  },
  {
    role: "Core Team Member",
    company: "TEDx BITS Pilani Dubai",
    date: "Campus initiative",
    location: "Dubai, United Arab Emirates",
    detail:
      "Contributed to logistics, outreach, and speaker coordination while helping revive TEDx on campus after seven years."
  },
  {
    role: "Founding Secretary",
    company: "Youth Business Society",
    date: "School leadership",
    location: "Sharjah, United Arab Emirates",
    detail:
      "Co-founded a student entrepreneurship society to create a platform for budding entrepreneurs and business-minded students."
  }
];

const identityRoles = [
  "Product Thinker.",
  "Cybersecurity Enthusiast.",
  "Automation Builder.",
  "Startup Consultant.",
  "Growth Strategist.",
  "Human-Centered Technologist."
];

const figureStats = [
  {
    value: experiences.length,
    label: "Professional roles",
    icon: Briefcase
  },
  {
    value: universityRoles.length,
    label: "Leadership roles",
    icon: Award
  },
  {
    value: projects.length,
    label: "Selected projects",
    icon: FolderOpen
  },
  {
    value: 10,
    label: "Certifications",
    icon: BadgeCheck
  }
];

const resumeLastUpdated = "May 19, 2026";

const resumeSummary =
  "Computer Science student at BITS Pilani Dubai Campus with a focus on AI, cybersecurity, and project management. Skilled in AI applications, workflow automation, scalable solution development, and penetration testing, with leadership experience across technical projects and entrepreneurship initiatives. Member of the Claude Partner Network, with a strong interest in applying emerging technologies to build innovative, user-centric, and business-driven solutions.";

const resumeHighlights = [
  { value: "40%", label: "Operational overhead reduced" },
  { value: "93%", label: "Assistant accuracy achieved" },
  { value: "35%", label: "Automation efficiency improved" },
  { value: "10%", label: "Collaboration efficiency increased" }
];

const resumeSkillBlocks = [
  {
    title: "Technical Skills",
    skills: [
      "Python",
      "FastAPI",
      "LangChain",
      "Langfuse",
      "n8n",
      "GitHub Actions",
      "MCP",
      "LLM Fine-Tuning",
      "Prompt Engineering",
      "Azure Cloud Services",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Blob Storage",
      "Docker",
      "Git",
      "Postman",
      "Power BI",
      "Figma",
      "Claude AI Suite",
      "AI Agent Development",
      "Multi Agent Workflows",
      "ETL Pipelines",
      "Schema Design",
      "OCR",
      "Microsoft Excel",
      "REST API Integration",
      "CI/CD Pipelines",
      "DevOps Fundamentals",
      "Supabase",
      "OpenRouter",
      "RunPod",
      "System Optimization",
      "Burp Suite",
      "Penetration Testing",
      "Web Application Security",
      "OWASP Top 10",
      "SQL Injection Testing",
      "SIEM Monitoring",
      "SOC Alert Triage",
      "Log Analysis",
      "Threat Detection",
      "Linux Security",
      "Windows Security",
      "Active Directory Exploitation",
      "Privilege Escalation",
      "Reconnaissance & Enumeration",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Vulnerability Assessment"
    ]
  },
  {
    title: "Other Skills",
    skills: [
      "Product Thinking",
      "Web Design",
      "Photography",
      "Videography",
      "Public Speaking",
      "Cross-functional Communication",
      "Stakeholder Coordination",
      "Technical Documentation",
      "Team Leadership",
      "Problem Solving",
      "Entrepreneurship",
      "Project Management"
    ]
  }
];

const resumeExperience = [
  {
    role: "AI & Automation Engineer Intern",
    company: "SPARK XI AI Engineering & Consulting",
    date: "January 2026 - Present",
    location: "Dubai, UAE",
    bullets: [
      "Built scalable AI orchestration workflows with n8n, Python, and API integrations, streamlining business processes and cutting operational overhead by 40% for multiple client integrations.",
      "Managed cloud infrastructure, storage optimization, and CI/CD pipelines using GitHub Workflows, Docker, and RunPod to enable faster and more reliable deployments.",
      "Customized and fine-tuned GPT OSS 120B with RAG frameworks for intelligent assistants and automated data solutions, improving performance and contextual accuracy to achieve an accuracy of 93%."
    ]
  },
  {
    role: "Project Intern",
    company: "PLUSX Electric",
    date: "June 2024 - August 2024",
    location: "Dubai, UAE",
    bullets: [
      "Developed and deployed AI-powered automation pipelines using Python, Flask, and n8n, improving efficiency by 35%.",
      "Engineered an NLP-driven chatbot with RAG to simplify workforce training and skill development.",
      "Deployed intelligent reporting dashboards to enhance stakeholder insights, increasing collaboration efficiency by 10%."
    ]
  },
  {
    role: "Business Operations Intern",
    company: "Creative Axis Building Contracting",
    date: "June 2023 - September 2023",
    location: "Dubai, UAE",
    bullets: [
      "Managed administrative operations and domain projects, integrating AI-based design tools to optimize workflows.",
      "Coordinated cross-functional teams to streamline delivery, reducing manual tasks and improving efficiency by 20%."
    ]
  }
];

const resumeEducation = [
  {
    school: "Birla Institute of Technology and Science",
    location: "Dubai, UAE",
    degree: "B.E. Computer Science",
    date: "2022 - 2026"
  },
  {
    school: "RedTeam Hacker Academy",
    location: "Dubai, UAE",
    degree: "Cybersecurity Training",
    date: "2026"
  }
];

function TiltCard({ children, className = "" }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const smoothY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  function onMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--x", `${(px + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--y", `${(py + 0.5) * 100}%`);
    rotateX.set(py * -5);
    rotateY.set(px * 7);
  }

  return (
    <motion.div
      className={`tilt-card ${className}`}
      style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`section reveal ${className}`}>
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CountUpFigure({ figure, index }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const Icon = figure.icon;

  useEffect(() => {
    if (!hasEntered) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId;

    if (prefersReducedMotion) {
      setDisplayValue(figure.value);
      return undefined;
    }

    const start = performance.now();
    const duration = 950 + index * 130;
    const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.round(figure.value * easeOut(progress)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [figure.value, hasEntered, index]);

  return (
    <motion.article
      className="figure-item"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      onViewportEnter={() => setHasEntered(true)}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      <Icon size={38} strokeWidth={1.8} suppressHydrationWarning />
      <div>
        <strong>
          {displayValue.toLocaleString()}
          {figure.suffix || ""}
        </strong>
        <span>{figure.label}</span>
      </div>
    </motion.article>
  );
}

function ClientHeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="scene-fallback" />;
  }

  return <HeroScene />;
}

export default function CinematicPortfolio() {
  const [loading, setLoading] = useState(true);
  const [activeSkillGroup, setActiveSkillGroup] = useState(null);
  const [activeExperienceGroup, setActiveExperienceGroup] = useState(null);
  const [typedRole, setTypedRole] = useState(identityRoles[0]);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { stiffness: 450, damping: 35 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 450, damping: 35 });
  const haloX = useTransform(cursorXSpring, (value) => value - 18);
  const haloY = useTransform(cursorYSpring, (value) => value - 18);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTypedRole(identityRoles[0]);
      return undefined;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const currentRole = identityRoles[roleIndex];
      let delay = deleting ? 24 : 42 + Math.random() * 18;

      if (deleting) {
        charIndex -= 1;
        setTypedRole(currentRole.slice(0, charIndex));

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % identityRoles.length;
          delay = 180;
        }
      } else {
        charIndex += 1;
        setTypedRole(currentRole.slice(0, charIndex));

        if (charIndex === currentRole.length) {
          deleting = true;
          delay = 780;
        }
      }

      timeoutId = window.setTimeout(tick, delay);
    };

    setTypedRole("");
    timeoutId = window.setTimeout(tick, 260);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursorX, cursorY]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      gsap.utils.toArray("[data-depth]").forEach((element) => {
        const depth = Number(element.dataset.depth || 0.2);
        gsap.to(element, {
          yPercent: depth * -20,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            scrub: true
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveSkillGroup(null);
      if (event.key === "Escape") setActiveExperienceGroup(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <main className="site-shell">
      <motion.div
        className="loader"
        initial={false}
        animate={{ opacity: loading ? 1 : 0, pointerEvents: loading ? "auto" : "none" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <div className="loader-mark">AS</div>
        <div className="loader-copy">
          <span>Portfolio</span>
          <strong>Abhiram S. Smitha</strong>
        </div>
        <div className="loader-line" />
      </motion.div>

      <motion.div className="cursor-halo" style={{ x: haloX, y: haloY }} />

      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grid-field" />

      <nav className="nav">
        <div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a href={item.href} key={item.href}>
                <Icon size={15} suppressHydrationWarning />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-scene" data-depth="0.22">
          <ClientHeroScene />
        </div>
        <div className="hero-background-fx" aria-hidden="true">
          <span className="hero-beam hero-beam-a" />
          <span className="hero-beam hero-beam-b" />
          <span className="hero-ring hero-ring-a" />
          <span className="hero-ring hero-ring-b" />
          <span className="hero-data-line hero-data-line-a" />
          <span className="hero-data-line hero-data-line-b" />
          <span className="hero-sweep" />
        </div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.9, ease: "easeOut" }}
          >
            <span>Abhiram S. Smitha</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.7 }}
          >
            Product thinking, AI systems, cybersecurity, and startup execution.
          </motion.p>
          <motion.div
            className="hero-energy-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="hero-signals"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.75 }}
          >
            <span>Product</span>
            <span>AI Systems</span>
            <span>Cybersecurity</span>
            <span>Automation</span>
          </motion.div>
        </div>
        <a className="hero-scroll-cue" href="#about" aria-label="Scroll to about section">
          <ChevronDown size={18} suppressHydrationWarning />
          <ChevronDown size={18} suppressHydrationWarning />
          <ChevronDown size={18} suppressHydrationWarning />
        </a>
      </section>

      <Section id="about" eyebrow="About" title="Where product meets security">
        <div className="about-panel glass-card">
          <div className="about-copy about-hero-copy">
            <p className="about-name">Abhiram S. Smitha</p>
            <div className="identity-type" aria-live="polite">
              <span>I am a</span>
              <strong>
                {typedRole}
                <i aria-hidden="true" />
              </strong>
            </div>
            <p>
              I build where product instinct, security awareness, AI automation,
              and startup execution meet. My work is about taking loose energy,
              sharp problems, and early ideas, then shaping them into something
              people can understand, trust, and move with.
            </p>
          </div>
          <div className="profile-stats">
            {profileStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="figures" eyebrow="Figures" title="Figures" className="figures-section">
        <p className="figures-lede">
          A compact snapshot of the work, leadership, projects, and certifications.
        </p>
        <div className="figure-strip glass-card">
          {figureStats.map((figure, index) => (
            <CountUpFigure figure={figure} index={index} key={figure.label} />
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="Experience" title="Professional experience">
        <div className="experience-list">
          {experiences.map((item, index) => (
            <motion.article
              className="experience-card glass-card"
              key={`${item.role}-${item.company}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <div className="experience-date">{item.date}</div>
              <div>
                <h3>{item.role}</h3>
                <p className="experience-company">{item.company}</p>
                <p className="experience-location">{item.location}</p>
                <p>{item.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <motion.button
          type="button"
          className="experience-slat university-reveal"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          onClick={() =>
            setActiveExperienceGroup({
              title: "University Leadership",
              eyebrow: "Campus roles",
              items: universityRoles
            })
          }
        >
          <div>
            <span>Campus roles</span>
            <strong>University Leadership</strong>
            <small>Tap to expand</small>
          </div>
        </motion.button>
      </Section>

      {activeExperienceGroup ? (
        <motion.div
          className="skill-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setActiveExperienceGroup(null)}
        >
          <motion.div
            className="experience-modal glass-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close experience popup"
              onClick={() => setActiveExperienceGroup(null)}
            >
              <X size={18} />
            </button>
            <span>{activeExperienceGroup.eyebrow}</span>
            <h3>{activeExperienceGroup.title}</h3>
            <div className="experience-modal-list">
              {activeExperienceGroup.items.map((item) => (
                <article key={`${item.role}-${item.company}`}>
                  <div className="experience-date">{item.date}</div>
                  <div>
                    <h4>{item.role}</h4>
                    <p className="experience-company">{item.company}</p>
                    <p className="experience-location">{item.location}</p>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      <Section id="skills" eyebrow="Skills" title="Technical depth, grouped by how I use it">
        <div className="skill-slat-grid">
          {skillGroups.map((group, groupIndex) => (
            <motion.button
              type="button"
              className="skill-slat"
              key={group.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: groupIndex * 0.05, duration: 0.55 }}
              onClick={() => setActiveSkillGroup(group)}
            >
              <div>
                <span>0{groupIndex + 1}</span>
                <strong>{group.title}</strong>
                <small>{group.skills.length} skills</small>
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {activeSkillGroup ? (
        <motion.div
          className="skill-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveSkillGroup(null)}
        >
          <motion.div
            className="skill-modal glass-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close skills popup"
              onClick={() => setActiveSkillGroup(null)}
            >
              <X size={18} />
            </button>
            <span>Skills</span>
            <h3>{activeSkillGroup.title}</h3>
            <div className="modal-skill-list">
              {activeSkillGroup.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      <Section id="projects" eyebrow="Projects" title="Selected work with business context">
        <div className="projects-grid">
          {projects.map((project, index) => (
            <TiltCard key={project.title} className="project-card">
              <span className="project-index">0{index + 1}</span>
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul>
                {project.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <ArrowUpRight className="project-arrow" size={22} suppressHydrationWarning />
            </TiltCard>
          ))}
        </div>
      </Section>

      <Section id="resume" eyebrow="Resume" title="Resume" className="resume-section">
        <div className="resume-meta">Last updated on {resumeLastUpdated}</div>
        <div className="resume-highlights">
          {resumeHighlights.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="resume-layout">
          <aside className="resume-column">
            <article className="resume-block">
              <h3>Summary</h3>
              <div className="resume-timeline">
                <div className="resume-entry">
                  <h4>Abhiram S. Smitha</h4>
                  <p>{resumeSummary}</p>
                </div>
              </div>
            </article>

            <article className="resume-block">
              <h3>Education</h3>
              <div className="resume-timeline">
                {resumeEducation.map((item) => (
                  <div className="resume-entry" key={`${item.school}-${item.degree}`}>
                    <h4>{item.degree}</h4>
                    <span className="resume-date">{item.date}</span>
                    <p className="resume-place">
                      {item.school}, {item.location}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="resume-block">
              <h3>Skills</h3>
              <div className="resume-skill-blocks">
                {resumeSkillBlocks.map((block) => (
                  <div key={block.title}>
                    <h4>{block.title}</h4>
                    <div className="resume-skill-tags">
                      {block.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>

          <div className="resume-column">
            <article className="resume-block">
              <h3>Professional Experience</h3>
              <div className="resume-timeline">
                {resumeExperience.map((item) => (
                  <div className="resume-entry" key={`${item.company}-${item.role}`}>
                    <h4>{item.role}, {item.company}</h4>
                    <span className="resume-date">{item.date}</span>
                    <p className="resume-place">{item.location}</p>
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Let's innovate together">
        <div className="contact-layout">
          <div className="contact-copy glass-card">
            <p>
              Open to product, growth, founder's office, startup operations, and
              technology strategy opportunities in Dubai, hybrid, or remote settings.
            </p>
            <div className="contact-links">
              <a href="mailto:abhiramsalim@gmail.com"><Mail size={18} suppressHydrationWarning /> Email</a>
              <a href="https://www.linkedin.com/in/abhiram-s-smitha-749918185/" target="_blank" rel="noreferrer"><Linkedin size={18} suppressHydrationWarning /> LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={18} suppressHydrationWarning /> GitHub</a>
            </div>
          </div>

          <form
            className="contact-form glass-card"
            name="portfolio-contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="portfolio-contact" />
            <p className="hidden-field">
              <label>Do not fill this out: <input name="bot-field" /></label>
            </p>
            <label>
              <span>Email</span>
              <input type="email" name="email" placeholder="you@company.com" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" placeholder="Tell me about the role, product, or opportunity" rows={5} required />
            </label>
            <button className="button primary" type="submit">
              Send Message <Send size={18} suppressHydrationWarning />
            </button>
          </form>
        </div>
      </Section>
    </main>
  );
}
