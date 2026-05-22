import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Home,
  Heart,
  Church,
} from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";
import { useAuthActions } from "@convex-dev/auth/react";

export default function AdminLayout() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const currentUser = useQuery(api.users.getCurrentUser);

  const menuItems = [
    { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
    { to: "/admin/devotionals", label: "Dévotions", icon: BookOpen },
    { to: "/admin/users", label: "Membres", icon: Users },
    { to: "/admin/testimonials", label: "Témoignages", icon: Heart },
    { to: "/admin/prayers", label: "Prières", icon: Church },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--sacred-dark)" }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col py-8 px-4 sticky top-0 h-screen"
        style={{
          background: "var(--gradient-sacred)",
          borderRight: "1px solid rgba(var(--gold-rgb),0.1)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <CrossIcon size={22} color="var(--gold)" />
          <div>
            <p className="font-display text-lg leading-none gold-text">
              Daily Bread
            </p>
            <p className="font-sans" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(var(--gold-rgb),0.5)", textTransform: "uppercase" }}>
              Administration
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-sans text-sm ${
                  isActive
                    ? "bg-gold-dark/30 text-gold-DEFAULT border border-gold-dark/50"
                    : "text-parchment-200/85 hover:text-parchment-100 hover:bg-gold-DEFAULT/[0.06]"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + actions */}
        <div className="mt-auto pt-6 border-t border-white/5">
          {currentUser && (
            <div className="flex items-center gap-3 px-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-text-on-gold" style={{ background: "var(--gradient-gold)" }}>
                {currentUser.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans text-parchment-100 truncate">{currentUser.name}</p>
                <p className="text-xs font-sans" style={{ color: "rgba(var(--gold-rgb),0.6)" }}>{currentUser.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-sm font-sans text-parchment-200/75 hover:text-parchment-100 transition-colors"
          >
            <Home size={15} /> Site public
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-sm font-sans text-red-400/60 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
