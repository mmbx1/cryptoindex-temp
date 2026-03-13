"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Box, Activity, Layers, Menu, X } from "lucide-react";

// --- 1. PARTICLE FIELD COMPONENT (Canvas) ---
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize Particles
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Connections
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

// --- 2. HOLO-CARD COMPONENT ---
const HoloCard = ({ title, value, label, color, icon: Icon }: any) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group bg-[#1A1F23]/80 backdrop-blur-md border border-white/10 rounded-lg p-8 overflow-hidden transition-all duration-300 hover:border-[#00FFFF]/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-xs font-azeret uppercase tracking-widest text-slate-400">{label}</div>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="font-michroma text-4xl mb-2 text-white">{value}</div>
        <div className={`text-sm font-rajdhani font-bold uppercase tracking-wide ${color}`}>{title}</div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-rajdhani selection:bg-[#00FFFF] selection:text-[#0A1628]">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1F23]/90 backdrop-blur-lg border-b border-[#00FFFF]/20 h-20 flex items-center justify-between px-6 lg:px-12">
        <div className="font-michroma text-xl tracking-widest bg-gradient-to-r from-[#00FFFF] to-[#39FF14] bg-clip-text text-transparent uppercase">
          CryptoIndex<span className="text-white">.Live</span>
        </div>
        
        <div className="hidden md:flex gap-8">
          {['Protocol', 'Indices', 'Governance', 'Docs'].map((item) => (
            <a key={item} href="#" className="relative text-slate-300 hover:text-white font-rajdhani font-semibold tracking-wider uppercase text-sm group transition-colors">
              {item}
              <span className="absolute -bottom-7 left-0 w-full h-[2px] bg-[#00FFFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center shadow-[0_0_10px_#00FFFF]" />
            </a>
          ))}
        </div>

        <button className="hidden md:flex items-center gap-2 px-6 py-2 border border-[#00FFFF] text-[#00FFFF] font-azeret text-xs font-bold uppercase tracking-widest hover:bg-[#00FFFF]/10 transition-all duration-300">
          Connect Wallet
        </button>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#00FFFF]">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-[radial-gradient(circle_at_center,_#2C3539_0%,_#0A1628_100%)]">
        
        <ParticleField />
        
        <motion.div style={{ y: y1 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#00FFFF]/20 rounded-full shadow-[0_0_60px_rgba(0,255,255,0.1)] pointer-events-none" />
        <motion.div style={{ y: y2 }} animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#39FF14]/20 rounded-full shadow-[0_0_60px_rgba(57,255,20,0.1)] pointer-events-none" />
        
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#00FFFF] blur-[100px] opacity-20 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#FF10F0] blur-[120px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#00FFFF]/50 bg-[#00FFFF]/5 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]" />
            <span className="font-azeret text-xs font-bold tracking-[0.2em] text-[#00FFFF] uppercase">System Operational v2.4</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-michroma text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 uppercase"
          >
            <span className="bg-gradient-to-r from-[#00FFFF] via-[#39FF14] to-[#FF10F0] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              AI-Driven
            </span><br />
            <span className="text-white">Crypto Index</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="font-rajdhani text-lg md:text-xl text-slate-400 max-w-2xl mb-12 tracking-wide"
          >
            Harnessing neural networks and quantum algorithms to navigate decentralized markets.
            Real-world asset tokenization meets bleeding-edge artificial intelligence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16"
          >
            <HoloCard title="Index Performance" value="+12.4%" label="24H CHANGE" color="text-[#00FFFF]" icon={Activity} />
            <HoloCard title="RWA Volume" value="$2.3B" label="LIQUIDITY" color="text-[#FF10F0]" icon={Layers} />
            <HoloCard title="Active Nodes" value="47" label="NETWORK" color="text-[#39FF14]" icon={Box} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <button className="group relative px-10 py-4 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] text-[#0A1628] font-bold font-rajdhani text-lg uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(0,255,255,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                Launch App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-10 py-4 border border-[#00FFFF] text-[#00FFFF] font-bold font-rajdhani text-lg uppercase tracking-widest hover:bg-[#00FFFF]/10 transition-colors duration-300">
              Read Whitepaper
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}