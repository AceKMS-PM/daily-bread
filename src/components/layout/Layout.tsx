import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";

export default function Layout() {
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/archives", label: "Archives" },
    { to: "/mur-de-priere", label: "Mur de Prière" },
  ];

  return (
    <div className="min-h-screen noise-overlay" style={{ background: "linear-gradient(180deg, #0D0A06 0%, #110D07 100%)" }}>
      {/* Background stars/particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(201,168,76,${Math.random() * 0.4 + 0.1})`,
              animation: `glowPulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-20"
        style={{
          background: "linear-gradient(180deg, rgba(13,10,6,0.98) 0%, rgba(13,10,6,0.85) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center" style={{ filter: "drop-shadow(0 0 8px rgba(201,168,76,0.5))" }}>
            <CrossIcon size={28} color="#C9A84C" />
          </div>
          <div>
            <p className="font-display text-xl leading-none" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Daily Bread
            </p>
            <p className="font-sans text-xs tracking-widest" style={{ color: "rgba(201,168,76,0.5)", fontSize: "0.6rem" }}>
              PAIN QUOTIDIEN
            </p>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <NavLink to="/admin" className="btn-ghost" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>
              Tableau de bord
            </NavLink>
          ) : (
            <button onClick={() => navigate("/connexion")} className="btn-gold" style={{ padding: "0.5rem 1.5rem", fontSize: "0.8rem" }}>
              Se Connecter
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-parchment-200 hover:text-gold-DEFAULT transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-24 pb-8 px-8 gap-6"
          style={{ background: "rgba(13,10,6,0.98)", backdropFilter: "blur(20px)" }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `font-display text-3xl ${isActive ? "text-gold-DEFAULT" : "text-parchment-200"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-auto">
            {isAuthenticated ? (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="btn-ghost block text-center">
                Tableau de bord
              </NavLink>
            ) : (
              <button onClick={() => { navigate("/connexion"); setMobileOpen(false); }} className="btn-gold w-full">
                Se Connecter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="relative pt-20" style={{ zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative py-16 px-6 mt-24 text-center" style={{ borderTop: "1px solid rgba(201,168,76,0.1)", zIndex: 1 }}>
        <div className="flex flex-col items-center gap-4">
          <CrossIcon size={24} color="rgba(201,168,76,0.4)" />
          <p className="font-display text-2xl text-gradient-gold">Daily Bread</p>
          <p className="font-serif text-sm" style={{ color: "rgba(249,241,224,0.35)" }}>
            « Donne-nous aujourd'hui notre pain quotidien » — Matthieu 6:11
          </p>
          <p className="font-sans text-xs tracking-widest mt-4" style={{ color: "rgba(249,241,224,0.2)" }}>
            © {new Date().getFullYear()} • Pour la gloire de Dieu
          </p>
        </div>
      </footer>
    </div>
  );
}
