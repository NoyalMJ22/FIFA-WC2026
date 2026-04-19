"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/groups", label: "Groups", icon: "📊" },
  { href: "/knockout", label: "Knockout", icon: "⚔️" },
  { href: "/predict", label: "Predict", icon: "🔮" },
  { href: "/stats", label: "Stats", icon: "📈" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-fifa-border/50"
      style={{
        background: "rgba(5, 5, 16, 0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="font-heading text-lg font-bold tracking-wider gradient-text-gold">
                FIFA WC 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-fifa-green"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-fifa-green/10 border border-fifa-green/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu - simplified */}
          <div className="md:hidden flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-2 rounded-lg text-lg transition-colors ${
                    isActive ? "text-fifa-green bg-fifa-green/10" : "text-gray-500"
                  }`}
                >
                  {link.icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
