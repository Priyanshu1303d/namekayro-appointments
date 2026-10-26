import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "chartreuse" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

// Accessible button with minimum 44px tap target and animated hover transitions.
export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const base = "group relative inline-flex items-center justify-center font-medium rounded-full overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse cursor-pointer";

  const variants = {
    primary: "bg-pink text-black shadow-sm hover:shadow-[0_0_25px_rgba(212,255,63,0.4)] hover:scale-[1.03]",
    secondary: "bg-surface text-text border border-white/10 hover:border-chartreuse/50 hover:text-chartreuse hover:scale-[1.02]",
    chartreuse: "bg-chartreuse text-black hover:opacity-90 shadow-sm",
    outline: "bg-transparent text-text border border-white/20 hover:border-chartreuse hover:text-chartreuse hover:bg-chartreuse/10 hover:scale-[1.02]",
    ghost: "bg-transparent text-text-muted hover:text-chartreuse hover:bg-chartreuse/10",
  };

  const sizes = {
    sm: "min-h-[44px] px-4 py-2 text-sm",
    md: "min-h-[44px] px-6 py-2.5 text-base",
    lg: "min-h-[50px] px-8 py-3 text-lg font-semibold",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {variant === "primary" && (
        <span className="absolute inset-0 w-full h-full bg-chartreuse -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
