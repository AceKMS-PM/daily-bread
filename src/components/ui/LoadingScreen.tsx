import CrossIcon from "./CrossIcon";

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "#0D0A06" }}
    >
      <div
        className="flex flex-col items-center gap-6"
        style={{ animation: "fadeIn 0.5s ease forwards" }}
      >
        <div style={{ animation: "float 2s ease-in-out infinite" }}>
          <CrossIcon size={48} color="#C9A84C" />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#C9A84C",
                animation: `glowPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
