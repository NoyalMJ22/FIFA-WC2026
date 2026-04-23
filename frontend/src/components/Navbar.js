"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BarChart3, Swords, Brain, LineChart, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/groups", label: "Groups", icon: BarChart3 },
  { href: "/knockout", label: "Knockout", icon: Swords },
  { href: "/predict", label: "Predict", icon: Brain },
  { href: "/stats", label: "Stats", icon: LineChart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#020617] to-[#020617]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group z-10">
            <div className="relative h-7 w-7">
              <Image
                src="/trophy.png"
                alt="FIFA WC Trophy"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
              />
            </div>
            <span className="font-heading text-lg font-bold tracking-wider gradient-text-gold drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]">
              FIFA WC 2026
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-2xl flex items-center gap-2 transition-all duration-300 ease-out group hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-emerald-400/10 border border-emerald-400/30 shadow-[0_0_20px_rgba(0,255,135,0.15)]"
                      : "text-white/60 hover:text-white hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.15)] pointer-events-none" />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#020617]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}