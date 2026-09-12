import { useEffect, useRef, useState } from "react";
import profileImg from "@/profile.jpg";

// ─── Canvas Background ──────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const binaryChars = "01";

    type Stream = {
      x: number;
      y: number;
      text: string;
      speed: number;
      direction: 1 | -1;
      opacity: number;
    };

    const makeStream = (): Stream => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const length = 14 + Math.floor(Math.random() * 12);
      const text = Array.from({ length }, () => binaryChars[Math.floor(Math.random() * binaryChars.length)]).join(" ");

      return {
        x: direction === 1 ? -600 : canvas.width + 600,
        y: 30 + Math.random() * (canvas.height - 60),
        text,
        speed: 0.45 + Math.random() * 0.35,
        direction,
        opacity: 0.04 + Math.random() * 0.1,
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight || window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const streams: Stream[] = Array.from({ length: 24 }, () => makeStream());

    let raf = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "13px 'JetBrains Mono', monospace";

      for (const stream of streams) {
        const textWidth = ctx.measureText(stream.text).width;

        const blueViolet = Math.random() > 0.5 ? "rgba(96, 165, 250, " : "rgba(139, 92, 246, ";

        ctx.strokeStyle = `${blueViolet}${stream.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();

        const lineStart = stream.direction === 1 ? stream.x - 80 : stream.x + textWidth + 80;
        const lineEnd = stream.direction === 1 ? stream.x + textWidth + 80 : stream.x - 80;

        ctx.moveTo(lineStart, stream.y);
        ctx.lineTo(lineEnd, stream.y);
        ctx.stroke();

        ctx.fillStyle = `${blueViolet}${stream.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(96, 165, 250, 0.18)";
        ctx.fillText(stream.text, stream.x, stream.y);
        ctx.shadowBlur = 0;

        stream.x += stream.speed * stream.direction;

        if (stream.direction === 1 && stream.x > canvas.width + textWidth + 160) {
          Object.assign(stream, makeStream());
          stream.x = -textWidth - 160;
          stream.direction = 1;
        } else if (stream.direction === -1 && stream.x < -textWidth - 160) {
          Object.assign(stream, makeStream());
          stream.x = canvas.width + 160;
          stream.direction = -1;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
    />
  );
}

// ─── Shared tokens ───────────────────────────────────────────────────────────

// thin blue-violet bordered glass
const glass =
  "backdrop-blur-md bg-black/40 border border-blue-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)]";

const glassCard =
  "backdrop-blur-md bg-black/50 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.06)] rounded-xl";

const sectionTitle = (label: string) => (
  <div className="mb-12">
    <div className="font-mono text-indigo-400/60 text-xs tracking-[0.3em] mb-2 uppercase">
      // {label}
    </div>
    <h2
      className="text-3xl md:text-4xl font-bold text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {label}
    </h2>
    <div className="mt-3 h-px w-16 bg-gradient-to-r from-blue-500 via-violet-500 to-transparent" />
  </div>
);

// ─── Nav ─────────────────────────────────────────────────────────────────────

const navLinks = ["Home", "About", "Education", "Skills", "Experience", "Projects", "Contact"];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2 " + glass : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="font-mono text-blue-400 text-sm tracking-widest">
          &lt;portfolio/&gt;
        </span>

        <div className="hidden md:flex gap-8">
          {navLinks.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="font-mono text-xs text-white/50 hover:text-blue-300 transition-colors tracking-widest uppercase"
            >
              {l}
            </button>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px w-6 bg-blue-400 transition-all duration-300 ${
                open && i === 0
                  ? "translate-y-2.5 rotate-45"
                  : open && i === 1
                  ? "opacity-0"
                  : open && i === 2
                  ? "-translate-y-2.5 -rotate-45"
                  : ""
              }`}
            />
          ))}
        </button>
      </div>

      {open && (
        <div className={`md:hidden mt-2 mx-4 rounded-xl p-6 ${glass} flex flex-col gap-4`}>
          {navLinks.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="font-mono text-xs text-white/60 hover:text-blue-300 text-left tracking-widest uppercase transition-colors"
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero horizontal code stream canvas ──────────────────────────────────────

function HeroCodeStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();

    // Each stream flows left→right or right→left across a fixed Y band
    const fragments = [
      "model.fit(X_train, y_train)",
      "accuracy_score(y_test, preds)",
      "df.dropna(inplace=True)",
      "pipeline = Pipeline(steps)",
      "loss.backward()",
      "optimizer.step()",
      "nn.Linear(512, 256)",
      "train_test_split(X, y)",
      "StandardScaler().fit_transform",
      "cross_val_score(clf, X)",
      "010110100101 110010",
      "00110101 10010011",
      "10101010 01100110",
      "F1={:.4f}  AUC={:.3f}",
      "epoch=12  loss=0.0312",
      "layers=[128,64,32]",
    ];

    interface Stream {
      x: number;
      y: number;
      text: string;
      speed: number;
      dir: 1 | -1;
      opacity: number;
      size: number;
      hue: "blue" | "violet";
    }

    const W = () => canvas.width;
    const H = () => canvas.height;

    const makeStream = (forceY?: number): Stream => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      return {
        x: dir === 1 ? -600 : W() + 600,
        y: forceY ?? Math.random() * H(),
        text: fragments[Math.floor(Math.random() * fragments.length)],
        speed: 0.3 + Math.random() * 0.5,
        dir: dir as 1 | -1,
        opacity: 0.06 + Math.random() * 0.14,
        size: 10 + Math.floor(Math.random() * 3),
        hue: Math.random() > 0.5 ? "blue" : "violet",
      };
    };

    // Seed streams spread across Y
    const streams: Stream[] = Array.from({ length: 18 }, (_, i) =>
      makeStream((i / 18) * (canvas.height || 600) + Math.random() * 30)
    );

    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, W(), H());

      for (const s of streams) {
        ctx!.font = `${s.size}px 'JetBrains Mono', monospace`;
        const color =
          s.hue === "blue"
            ? `rgba(99,168,255,${s.opacity})`
            : `rgba(167,139,250,${s.opacity})`;
        ctx!.fillStyle = color;
        ctx!.fillText(s.text, s.x, s.y);

        // draw a faint horizontal line extending the stream
        ctx!.strokeStyle =
          s.hue === "blue"
            ? `rgba(59,130,246,${s.opacity * 0.4})`
            : `rgba(139,92,246,${s.opacity * 0.35})`;
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        const lineX = s.dir === 1 ? s.x - 80 : s.x + ctx!.measureText(s.text).width + 80;
        const lineEnd = s.dir === 1 ? s.x : lineX;
        ctx!.moveTo(Math.min(lineX, lineEnd), s.y - 4);
        ctx!.lineTo(Math.max(lineX, lineEnd), s.y - 4);
        ctx!.stroke();

        s.x += s.speed * s.dir;

        // respawn when fully off-screen
        const tw = ctx!.measureText(s.text).width;
        if (s.dir === 1 && s.x > W() + tw + 80) {
          Object.assign(s, makeStream());
          s.x = -tw - 80;
          s.dir = 1;
        } else if (s.dir === -1 && s.x < -tw - 80) {
          Object.assign(s, makeStream());
          s.x = W() + 80;
          s.dir = -1;
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Technical grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.018) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Horizontal code stream layer */}
      <HeroCodeStream />

      {/* Atmospheric glow blobs */}
      <div
        className="absolute top-1/4 right-1/3 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 65%)",
          filter: "blur(70px)",
          zIndex: 0,
        }}
      />

      {/* Content — above streams */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-[1fr_1.15fr] gap-8 lg:gap-12 items-center">
        {/* ── Text column ── */}
        <div>
          <div className="font-mono text-indigo-400/65 text-xs tracking-[0.25em] mb-6 uppercase">
            &gt; initializing_portfolio.py
          </div>

          <p className="font-mono text-blue-400/75 text-sm mb-2">Hi, I'm</p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "Inter, sans-serif" , fontSize: "53px" }}
          >
            Omnia Nasser
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-blue-500/50 via-violet-500/30 to-transparent mb-6" />

          <div className="font-mono text-blue-300 text-base md:text-lg mb-6 tracking-wide" style={{ fontSize: "15px" }}>
            Data Scientist | Machine Learning Engineer | Deep Learning Enthusiast | AI Researcher
            
          </div>

          <p
            className="text-white/42 text-sm leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: "Inter, sans-serif" ,  }}
          >
            I use Data Science & AI with business understanding to turn data into practical solutions that create real impact
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {["[FIELD 1]", "[FIELD 2]", "[FIELD 3]", "[FIELD 4]"].map((t) => (
              <span
                key={t}
                className="font-mono text-xs text-blue-300/65 border border-blue-500/18 px-3 py-1 rounded-full bg-blue-500/5"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-mono font-semibold text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] tracking-wider"
            >
              View Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 border border-blue-500/40 hover:border-violet-400/60 text-blue-300 hover:text-violet-300 font-mono font-semibold text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-sm bg-blue-500/5 tracking-wider"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* ── Profile image — large, frameless, cinematic ── */}
        <div className="flex justify-center md:justify-end relative">
          {/* Deep atmospheric halo behind the subject */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-15%",
              background:
                "radial-gradient(ellipse 65% 75% at 52% 48%, rgba(20,24,32,0.90) 0%, rgba(10,12,18,0.55) 35%, transparent 68%)",
              filter: "blur(38px)",
            }}
          />

          {/* Image container — no border, no frame */}
          <div
            className="relative"
            style={{ width: "min(520px, 90vw)", aspectRatio: "4/5" }}
          >
            <img
              src={profileImg}
              alt="Profile photo"
              className="w-full h-full object-cover object-top"
              style={{
                filter: "saturate(0.8) contrast(1.0) brightness(0.65)",
                maskImage:
                  "radial-gradient(ellipse 82% 86% at 50% 42%, black 46%, rgba(0,0,0,0.80) 66%, transparent 64%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 82% 86% at 50% 42%, black 46%, rgba(0,0,0,0.80) 66%, transparent 64%)",
              }}
            />

            {/* Bottom dissolve */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 35%, rgba(4,4,10,0.55) 68%, rgba(4,4,10,0.95) 88%, rgba(4,4,10,1) 100%)",
              }}
            />
            {/* Left dissolve */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(4,4,10,0.85) 0%, rgba(4,4,10,0.3) 18%, transparent 38%)",
              }}
            />
            {/* Right dissolve */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, rgba(4,4,10,0.75) 0%, rgba(4,4,10,0.2) 18%, transparent 38%)",
              }}
            />
            {/* Top dissolve */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(4,4,10,0.6) 0%, transparent 22%)",
              }}
            />

            {/* Subtle blue cinematic hint only */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 30% 65%, rgba(30,41,59,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 72% 28%, rgba(17,24,39,0.08) 0%, transparent 50%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Horizontal data stream overlay — thin lines crossing the image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[18, 34, 52, 67, 80].map((pct, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ top: `${pct}%`, opacity: 0.18 + (i % 3) * 0.06 }}
                >
                  <div
                    className="h-px flex-1"
                    style={{
                      background: i % 2 === 0
                        ? "linear-gradient(to right, transparent, rgba(99,168,255,0.5), transparent)"
                        : "linear-gradient(to right, transparent, rgba(167,139,250,0.4), transparent)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Faint code fragment crossing the image */}
            <div
              className="absolute pointer-events-none font-mono text-[10px] text-blue-300/20 select-none hidden md:block"
              style={{ top: "28%", left: "-6%", whiteSpace: "nowrap" }}
            >
              model.predict(X_test)
            </div>
            <div
              className="absolute pointer-events-none font-mono text-[10px] text-violet-300/18 select-none hidden md:block"
              style={{ top: "58%", right: "-4%", whiteSpace: "nowrap" }}
            >
              loss=0.0247  acc=0.961
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ zIndex: 10 }}>
        <span className="font-mono text-xs text-white/22 tracking-widest">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-blue-500/35 to-transparent" />
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {sectionTitle("About")}

        <div className="grid md:grid-cols-3 gap-6">
          <div className={`md:col-span-2 ${glassCard} p-8`}>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-blue-500/15">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-4 font-mono text-xs text-white/25">about_me.py</span>
            </div>

            <div className="font-mono text-sm leading-loose">
              <div className="text-violet-400/70 mb-1"># About Me</div>
              {/* <div className="text-white/25 mb-4"></div> */}
              <div className="text-white/45 text-sm leading-relaxed italic">
               
                <br /><br />
                 I’m Omnia Nasser, a Data Science and AI enthusiast passionate about using data, machine learning, and AI to solve real-world problems.

                 I combine technical skills with business understanding to explore data, build intelligent models, and turn complex information into practical solutions that create real impact.  
              </div>
              <div className="text-white/25 mt-4">#</div>
              <div className="text-white/25">#</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: "Focus Area", value: "[Data Science | Artificial Intelligence | Machine Learning]" },
              { label: "Status", value: "Available for Internships & Opportunities" },
              { label: "Location", value: "[Egypt]" },
              { label: "Languages", value: "[Arabic | English]" },
            ].map((item) => (
              <div key={item.label} className={`${glassCard} p-5`}>
                <div className="font-mono text-xs text-indigo-400/50 mb-1 tracking-widest uppercase">
                  {item.label}
                </div>
                <div className="font-mono text-sm text-white/65">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Education ───────────────────────────────────────────────────────────────

const educationItems = [
  { degree: "[Bachelor’s Degree ]", institution: "[SAMS / (MIS)]", years: "[2024 – 2027]", desc: "[MIS with a growing specialization in Data Science, Artificial Intelligence, and Machine Learning. My studies combine business and technology, while my practical training and projects focus on data analysis, machine learning, AI, and building data-driven solutions.]" },
  { degree: "[Intern Data Science]", institution: "[Digital Egypt Pioneers Initiative - DEPI]", years: "[6 MONTHS-2027]", desc: "[A 6-month intensive training program focused on Artificial Intelligence and Data Science, covering data analysis, machine learning, deep learning, AI concepts, and hands-on projects using real-world datasets.]" },
  { degree: "[Artificial Intelligence Trainee]", institution: "[Information Technology Institute (ITI)]", years: "[120 HOURS]", desc: "[Hands-on AI training focused on machine learning and deep learning concepts, model development, data preprocessing, and applying AI techniques to practical problems.]" },
];

function Education() {
  return (
    <section id="education" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {sectionTitle("Education")}

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/25 to-transparent hidden md:block" />

          <div className="flex flex-col gap-10">
            {educationItems.map((item, i) => (
              <div key={i} className="md:pl-16 relative">
                <div className="absolute left-0 top-4 w-8 h-8 rounded-full border-2 border-blue-500/50 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.35)] hidden md:flex">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>

                <div className={`${glassCard} p-6 hover:border-violet-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-300`}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-lg font-semibold text-white" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item.degree}
                      </div>
                      <div className="font-mono text-blue-300/80 text-sm mt-1">{item.institution}</div>
                    </div>
                    <div className="font-mono text-xs text-white/35 border border-blue-500/20 px-3 py-1 rounded-full bg-blue-500/5">
                      {item.years}
                    </div>
                  </div>
                  <p className="text-white/35 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────

const skillCategories = [
  { category: "[SKILL CATEGORY 1]", skills: ["[Data Preprocessing]", "[Machine Learning]", "[Model Evaluation]", "[Deep Learning]", "[Statistics]"] },
  { category: "[SKILL CATEGORY 2]", skills: ["[Data Science]", "[Feature Engineering]", "[Computer Vision|NLP]", "[Visualization]", "[Python|SQL]", "[Pandas|NumPy]"] },
  { category: "[SKILL CATEGORY 4]", skills: ["[Communication]", "[Teamwork]", "[Problem Solving]", "[Leadership]"] },
];

function Skills() {
  return (
    <section id="skills" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {sectionTitle("Skills")}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, i) => (
            <div key={i} className={`${glassCard} p-6`}>
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-blue-500/15">
                <div className="w-2 h-2 rounded-sm bg-violet-500/60" />
                <span className="font-mono text-xs text-blue-300/70">{cat.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s, j) => (
                  <span
                    key={j}
                    className="font-mono text-xs text-white/55 border border-blue-500/15 px-3 py-1.5 rounded bg-blue-500/5 hover:border-violet-500/40 hover:text-blue-200 transition-all duration-200 cursor-default"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Work Experience ─────────────────────────────────────────────────────────

const workItems = [
  {
    title: "[Bank Intern]", company: "[ABE Bank]", date: "[2026]",
    description: "[Practical training across operational departments, gaining exposure to banking systems, digital processes, and day-to-day banking operations.]",
    responsibilities: ["[Gained practical exposure to banking information systems and digital processes.]", "[Observed and supported daily operational workflows across different banking departments.]", "[Developed an understanding of how technology and information systems support banking operations.]"],
  },
  {
    title: "[Data Analysis Trainee]", company: "[National Telecommunication Institute (NTI)]", date: "[2026]",
    description: "[Completed a 120-hour practical training program in data analysis, focusing on data preparation, analysis, visualization, and extracting meaningful insights from real-world datasets.]",
    responsibilities: ["[Performed data cleaning and preprocessing using Python and SQL.]", "[Conducted exploratory data analysis and created data visualizations to identify patterns and trends]", "[Built analytical reports and dashboards using Power BI and applied data-driven insights to practical projects.]"],
  },
  // {
  //   title: "[JOB TITLE]", company: "[COMPANY]", date: "[DATE]",
  //   description: "[DESCRIPTION OF YOUR ROLE AND RESPONSIBILITIES]",
  //   responsibilities: ["[RESPONSIBILITY 1]", "[RESPONSIBILITY 2]"],
  // },
];

function WorkExperience() {
  return (
    <section id="experience" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {sectionTitle("Work Experience")}

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/15 to-transparent hidden md:block" />

          <div className="flex flex-col gap-10">
            {workItems.map((item, i) => (
              <div key={i} className="md:pl-16 relative">
                <div className="absolute left-0 top-4 w-8 h-8 rounded-full border-2 border-violet-500/45 bg-black flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)] hidden md:flex">
                  <div className="w-2 h-2 rounded-full bg-violet-400/80" />
                </div>

                <div className={`${glassCard} p-6 hover:border-blue-500/40 transition-all duration-300`}>
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-blue-500/15">
                    <span className="font-mono text-xs text-indigo-400/45">
                      experience_{String(i + 1).padStart(2, "0")}.py
                    </span>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-lg font-semibold text-white" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item.title}
                      </div>
                      <div className="font-mono text-blue-300/75 text-sm mt-1">{item.company}</div>
                    </div>
                    <div className="font-mono text-xs text-white/35 border border-blue-500/20 px-3 py-1 rounded-full bg-blue-500/5">
                      {item.date}
                    </div>
                  </div>

                  <p className="text-white/38 text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item.description}
                  </p>

                  <div className="font-mono text-xs text-violet-400/50 mb-2"># Responsibilities</div>
                  <ul className="space-y-1.5">
                    {item.responsibilities.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/38" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span className="text-blue-400/60 mt-0.5 font-mono">▸</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const projects = [
  {
    number: "Project 1",
    file: "imdb_analysis.py",
    url: "https://github.com/omnianasser212005-ship-it/IMDB.git",
    description: "This dataset contains **50,000 movie reviews** extracted from IMDB, specifically curated for binary sentiment classification tasks in Natural Language Processing (NLP).",
  },
  {
    number: "Project 2",
    file: "spam_classifier.py",
    url: "https://github.com/omnianasser212005-ship-it/Spam.git/",
    description: "This Jupyter Notebook implements a complete machine learning pipeline to classify text messages (SMS or Emails) as **Spam** or **Ham** (legitimate) using Natural Language Processing (NLP).",
  },
  {
    number: "Project 3",
    file: "summarize_dataset.py",
    url: "https://github.com/omnianasser212005-ship-it/summarizdataset.git/",
    description: "Arabic Text Classification pipeline utilizing PyArabic, NLTK, TF-IDF vectorization, and Scikit-Learn models (Naïve Bayes, Logistic Regression, LinearSVC) for processing and categorizing Arabic news/articles.",
  },
];

const CODE_IMPORTS = [
  { kw: "import", lib: "torch" },
  { kw: "import", lib: "numpy", alias: "as np" },
  { kw: "import", lib: "pandas", alias: "as pd" },
  { kw: "import", lib: "nltk" },
];

function ProjectCard({ project, offset }: { project: typeof projects[0]; offset: number }) {
  return (
    <div
      className="group relative rounded-xl border border-blue-500/18 bg-black/65 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/40 hover:shadow-[0_0_50px_rgba(99,102,241,0.18),0_0_80px_rgba(139,92,246,0.08)]"
      style={{ marginTop: offset }}
    >
      {/* Scanning light on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div
          className="absolute inset-x-0 h-40 -top-40 group-hover:top-full transition-all duration-1000"
          style={{ background: "linear-gradient(transparent, rgba(99,102,241,0.04), transparent)" }}
        />
      </div>

      {/* Subtle violet corner glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at top right, rgba(139,92,246,0.12), transparent 70%)",
        }}
      />

      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-blue-500/12 bg-blue-500/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/45" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/45" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/45" />
        <span className="ml-3 font-mono text-xs text-blue-300/55">{project.file}</span>
      </div>

      {/* Code imports */}
      <div className="px-6 pt-6 pb-2 font-mono text-sm leading-loose">
        {CODE_IMPORTS.map((line, i) => (
          <div key={i}>
            <span className="text-violet-400/80">{line.kw} </span>
            <span className="text-blue-200/85">{line.lib}</span>
            {line.alias && <span className="text-white/35"> {line.alias}</span>}
          </div>
        ))}
      </div>

      <div className="mx-6 h-px bg-blue-500/10 my-2" />

      {/* Click here button — centered */}
      <div className="flex justify-center items-center py-8">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative px-8 py-3 border border-blue-500/40 rounded-lg font-mono text-sm text-blue-300 bg-black/50 backdrop-blur-sm hover:border-violet-400/60 hover:text-violet-200 hover:shadow-[0_0_25px_rgba(99,102,241,0.4),inset_0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300 hover:scale-105"
        >
          Click here
          <span
            className="absolute inset-0 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07), transparent 70%)" }}
          />
        </a>
      </div>

      {/* Description */}
      <div className="px-6 pb-2 font-mono text-sm leading-loose">
        <div className="text-violet-400/40 mb-2"># Description</div>
        <div className="text-white/65">{project.description}</div>
        <div className="text-violet-400/40 mb-2">df = pd.read_csv("data/asl_data/sign_mnist_train.csv")</div>
        <div className="text-violet-400/40 mb-2">df.head()</div>
      </div>

      {/* Project number */}
      <div className="px-6 pt-4 pb-5 mt-auto border-t border-blue-500/10 flex items-center justify-between">
        <span className="text-white/65 font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          {project.number}
        </span>
        <span className="font-mono text-xs text-blue-400/40">→</span>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-24 px-6">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(59,130,246,0.04) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(139,92,246,0.04) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {sectionTitle("Projects")}

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} offset={i === 1 ? 32 : i === 2 ? 16 : 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {sectionTitle("Contact")}

        <div className={`${glassCard} p-8 md:p-12`}>
          <div className="flex items-center gap-2 mb-8 pb-5 border-b border-blue-500/15">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/45" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/45" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/45" />
            <span className="ml-3 font-mono text-xs text-blue-300/55">contact.py</span>
          </div>

          <div className="font-mono text-sm leading-loose mb-10">
            <div className="text-violet-400/70">const</div>
            <div className="text-white/75 ml-4">contact <span className="text-white/35">=</span> {"{"}</div>
            <div className="ml-8">
              <span className="text-blue-200/70">email</span>
              <span className="text-white/35">: </span>
              <span className="text-green-400/60">"[omnianasser2121@gmail.com]"</span>
              <span className="text-white/35">,</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-200/70">github</span>
              <span className="text-white/35">: </span>
              <span className="text-green-400/60">"[omnianasser212005-ship-it]"</span>
              <span className="text-white/35">,</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-200/70">linkedin</span>
              <span className="text-white/35">: </span>
              <span className="text-green-400/60">"[linkedin.com/in/omnia-nasser-122a80299]"</span>
            </div>
            <div className="text-white/75">{"}"}</div>
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            {[
              { label: "Email", icon: "✉", href: "mailto:[omnianasser2121@gmail.com]" },
              { label: "GitHub", icon: "⌥", href: "https://github.com/omnianasser212005-ship-it" },
              { label: "LinkedIn", icon: "⧉", href: "https://linkedin.com/in/omnia-nasser-122a80299" },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className="flex items-center gap-2 px-5 py-3 border border-blue-500/25 text-blue-300/75 hover:text-violet-200 hover:border-violet-400/50 font-mono text-sm rounded-lg bg-blue-500/5 hover:bg-violet-500/8 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300"
              >
                <span>{btn.icon}</span>
                {btn.label}
              </a>
            ))}
          </div>

          <div className="text-center">
            <div className="font-mono text-xs text-white/25 mb-4 tracking-widest">
              // ready to connect
            </div>
            <a
              href="mailto:omnianasser2121@gmail.com"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-mono font-bold text-sm rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] tracking-wider"
            >
              Let's Connect
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-blue-500/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-white/25">
          © 2026 <span className="text-blue-300/55">[YOUR NAME]</span>
        </div>
        <div className="font-mono text-xs text-white/18 italic">[YOUR TAGLINE]</div>
        <div className="font-mono text-xs text-white/18">&lt;/portfolio&gt;</div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="relative min-h-screen text-white"
      style={{ background: "#020305", fontFamily: "Inter, sans-serif" }}
    >
      <ParticleCanvas />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <About />
        <Education />
        <Skills />
        <WorkExperience />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
