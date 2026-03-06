interface CrossIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CrossIcon({ size = 24, color = "#C9A84C", className = "" }: CrossIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="10.5" y="2" width="3" height="20" rx="1" fill={color} />
      <rect x="4" y="7" width="16" height="3" rx="1" fill={color} />
    </svg>
  );
}
