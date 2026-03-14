"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Box, Activity, Layers, Menu, X, ExternalLink, Newspaper } from "lucide-react";
"use client";
import { motion } from "framer-motion";

interface HoloCardProps {
  title: string;
  value: string;
  trend: string;
}

function HoloCard({ title, value, trend }: HoloCardProps) {  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative p-6 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-xl group cursor-pointer"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-blue-400 to-purple-500 transition-opacity duration-500 ease-in-out pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </p>
      </div>
    </motion.div>
  );
}
// --- 1. YOUR CONTENT DATABASE ---
const INSIGHTS_DATA = [
  {
    category: "Institutional",
    title: "BlackRock's BUIDL Fund Crosses $300M",
    source: "Bloomberg",
    date: "24h ago",
    link: "#",
    tagColor: "text-[#00FFFF]",
    borderColor: "border-[#00FFFF]/30"
  },
  {
    category: "RWA",
    title: "Real Estate Tokenization Protocol Surges 40%",
    source: "CoinDesk",
    date: "2 days ago",
    link: "#",
    tagColor: "text-[#FF10F0]",
    borderColor: "border-[#FF10F0]/30"
  },
  {
    category: "Prediction Markets",
    title: "Election Betting Volume Hits All-Time High",
    source: "Reuters",
    date: "3 days ago",
    link: "#",
    tagColor: "text-[#39FF14]",
    borderColor: "border-[#39FF14]/30"
  }
];

const INDEX_TRACKERS = [
  { title: "RWA Sector", value: "$4.28B", trend: "+12.4%" },
  { title: "AI Compute", value: "$8.91B", trend: "+5.2%" },
  { title: "Prediction Mkts", value: "$940M", trend: "+24.8%" }
];

// --- 2. PARTICLE FIELD COMPONENT ---
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    const colors = ["#00FFFF", "#39FF14", "#FF10F0"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; color: string;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};

// --- 3. MAIN PAGE COMPONENT ---
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="min-h-screen bg-[#0A1628] relative overflow-x-hidden font-rajdhani selection:bg-[#00FFFF] selection:text-[#0A1628]">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1F23]/90 backdrop-blur-lg border-b border-[#00FFFF]/20 h-20 flex items-center justify-between px-6 lg:px-12">
        <div className="font-michroma text-xl tracking-widest bg-gradient-to-r from-[#00FFFF] to-[#39FF14] bg-clip-text text-transparent uppercase">
          CryptoIndex<span className="text-white">.Live</span>
        </div>
        
        <div className="hidden md:flex gap-6 lg:gap-8">
          {['RWA', 'AI', 'Prediction', 'Gaming', 'Institutional'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="relative text-slate-300 hover:text-white font-rajdhani font-semibold tracking-wider uppercase text-sm group transition-colors">
              {item}
              <span className="absolute -bottom-7 left-0 w-full h-[2px] bg-[#00FFFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center shadow-[0_0_10px_#00FFFF]" />
            </a>
          ))}
        </div>

        <a href="#newsletter" className="hidden md:flex items-center gap-2 px-6 py-2 border border-[#00FFFF] text-[#00FFFF] font-azeret text-xs font-bold uppercase tracking-widest hover:bg-[#00FFFF]/10 transition-all duration-300">
          Get Intel
        </a>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#00FFFF]">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 bg-[radial-gradient(circle_at_center,_#2C3539_0%,_#0A1628_100%)]">
        <ParticleField />
        
        {/* Spinning Rings */}
        <motion.div style={{ y: y1 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#00FFFF]/20 rounded-full shadow-[0_0_60px_rgba(0,255,255,0.1)] pointer-events-none" />
        <motion.div style={{ y: y2 }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#39FF14]/20 rounded-full shadow-[0_0_60px_rgba(57,255,20,0.1)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#00FFFF]/50 bg-[#00FFFF]/5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]" />
            <span className="font-azeret text-xs font-bold tracking-[0.2em] text-[#00FFFF] uppercase">Navigating The Great Wealth Transfer</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-michroma text-5xl md:text-7xl leading-tight mb-8 uppercase">
            <span className="text-white">The Monumental</span><br />
            <span className="bg-gradient-to-r from-[#00FFFF] via-[#39FF14] to-[#FF10F0] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              Shift is Here
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="font-rajdhani text-xl text-slate-400 max-w-3xl mb-12 tracking-wide leading-relaxed">
            Institutions are quietly absorbing the infrastructure of tomorrow. We track the smart money across Real World Assets, AI compute protocols, and decentralized Prediction Markets. Stay ahead of the curve.
          </motion.p>
        </div>
      </section>

      {/* Live Market Indices Section */}
      <section className="relative py-12 px-6 lg:px-12 bg-[#0A1628] z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <Activity className="text-[#39FF14] w-6 h-6" />
            <h2 className="font-michroma text-xl uppercase text-white tracking-widest">Live Sector Tracking</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INDEX_TRACKERS.map((item, index) => (
              <HoloCard 
                key={index} 
                title={item.title} 
                value={item.value} 
                trend={item.trend} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* Institutional Intel Section */}
      <section id="institutional" className="relative py-24 px-6 lg:px-12 bg-[#0A1628] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4 mb-12">
            <Newspaper className="text-[#00FFFF] w-8 h-8" />
            <h2 className="font-michroma text-3xl uppercase text-white tracking-widest">Institutional Intel</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00FFFF]/50 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSIGHTS_DATA.map((item, index) => (
              <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" 
                className={`group relative bg-[#1A1F23]/80 backdrop-blur-sm border ${item.borderColor} p-6 rounded-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between min-h-[200px]`}>
                
                {/* Background Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`font-azeret text-xs font-bold uppercase tracking-widest ${item.tagColor}`}>{item.category}</span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-rajdhani text-2xl text-white font-bold leading-tight mb-4 group-hover:text-[#00FFFF] transition-colors">{item.title}</h3>
                </div>
                
                <div className="relative z-10 flex justify-between items-center text-sm font-azeret text-slate-500 uppercase tracking-wider">
                  <span>{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </a>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}