import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  color?: "default" | "white";
}

export function Logo({
  className = "",
  variant = "full",
  color = "default",
}: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/Estacionador Logo.png"
        alt="Estacionador Logo"
        className={`h-16 ${variant === "icon" ? "w-16" : "w-auto"}`}
      />
    </div>
  );
}
