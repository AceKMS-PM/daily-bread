import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Shield, User } from "lucide-react";

export default function AdminUsers() {
  const users = useQuery(api.users.getAllUsers);
  const setRole = useMutation(api.users.setUserRole);

  const handleRoleToggle = async (userId: any, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    if (!confirm(`Changer le rôle en "${newRole}" ?`)) return;
    await setRole({ targetUserId: userId, role: newRole as any });
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
              border: "1px solid rgba(201,168,76,0.08)",
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
              </div>
              <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(249,241,224,0.35)" }}>
                {u.email} · Inscrit le {format(new Date(u.createdAt), "d MMM yyyy", { locale: fr })}
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
            <button
              onClick={() => handleRoleToggle(u._id, u.role)}
              className="font-sans text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(201,168,76,0.5)" }}
            >
              {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
