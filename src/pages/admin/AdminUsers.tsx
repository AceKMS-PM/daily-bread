import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Shield, Ban, CheckCircle } from "lucide-react";

export default function AdminUsers() {
  const users = useQuery(api.users.getAllUsers);
  const setRole = useMutation(api.users.setUserRole);
  const banUser = useMutation(api.users.banUser);
  const unbanUser = useMutation(api.users.unbanUser);

  const handleRoleToggle = async (userId: any, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    if (!confirm(`Changer le rôle en "${newRole}" ?`)) return;
    await setRole({ targetUserId: userId, role: newRole as any });
  };

  const handleBan = async (userId: any, userName: string) => {
    if (!confirm(`Bannir "${userName}" ? Il/elle ne pourra plus publier de prières ni de témoignages.`)) return;
    await banUser({ targetUserId: userId });
  };

  const handleUnban = async (userId: any, userName: string) => {
    if (!confirm(`Réactiver "${userName}" ?`)) return;
    await unbanUser({ targetUserId: userId });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-parchment-100">Membres</h1>
        <p className="font-sans text-sm mt-1" style={{ color: "rgba(249,241,224,0.4)" }}>
          {users?.length ?? 0} membres inscrits
        </p>
      </div>

      <div className="space-y-2">
        {users?.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-4 p-5 rounded-xl"
            style={{
              background: "rgba(26,19,8,0.7)",
              border: `1px solid ${u.isBanned ? "rgba(139,32,32,0.3)" : "rgba(201,168,76,0.08)"}`,
              opacity: u.isBanned ? 0.6 : 1,
            }}
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sacred-dark"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}
            >
              {u.name?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-serif text-parchment-100">{u.name}</p>
                {u.role === "admin" && (
                  <Shield size={13} style={{ color: "#C9A84C" }} />
                )}
                {u.isBanned && (
                  <span className="font-sans text-[10px] uppercase tracking-widest text-crimson-light px-2 py-0.5 rounded-full" style={{ background: "rgba(139,32,32,0.15)", border: "1px solid rgba(139,32,32,0.3)" }}>
                    Banni
                  </span>
                )}
              </div>
              <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(249,241,224,0.35)" }}>
                {u.email} · Inscrit le {format(new Date(u.createdAt ?? 0), "d MMM yyyy", { locale: fr })}
              </p>
            </div>

            {/* Role badge */}
            <span
              className="font-sans text-xs px-3 py-1 rounded-full flex-shrink-0"
              style={{
                background: u.role === "admin" ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${u.role === "admin" ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: u.role === "admin" ? "#C9A84C" : "rgba(249,241,224,0.35)",
              }}
            >
              {u.role === "admin" ? "Admin" : "Membre"}
            </span>

            {/* Toggle role */}
            {!u.isBanned && (
              <button
                onClick={() => handleRoleToggle(u._id, u.role ?? "member")}
                className="font-sans text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "rgba(201,168,76,0.5)" }}
              >
                {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
              </button>
            )}

            {/* Ban / Unban */}
            {u.isBanned ? (
              <button
                onClick={() => handleUnban(u._id, u.name ?? "?" )}
                className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "#4ADE80" }}
              >
                <CheckCircle size={13} />
                Réactiver
              </button>
            ) : u.role !== "admin" && (
              <button
                onClick={() => handleBan(u._id, u.name ?? "?" )}
                className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "rgba(249,241,224,0.4)" }}
              >
                <Ban size={13} />
                Bannir
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
