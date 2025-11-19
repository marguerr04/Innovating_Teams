// src/components/JuicyButton.jsx
import React from 'react';

const colorVariants = {
  // Color Principal  +  Borde Oscuro (Sombra)
  green:  "bg-green-500 border-green-700 text-white hover:bg-green-400",
  blue:   "bg-sky-500 border-sky-700 text-white hover:bg-sky-400",
  red:    "bg-red-500 border-red-700 text-white hover:bg-red-400",
  yellow: "bg-amber-400 border-amber-600 text-white hover:bg-amber-300",
  gray:   "bg-slate-200 border-slate-400 text-slate-600 hover:bg-slate-100",
  mint:   "bg-[#3AB6B5] border-[#2E8F8E] text-white hover:brightness-110", // Tu color UDD
};

export default function JuicyButton({ 
  color = "blue", 
  children, 
  onClick, 
  className = "", 
  disabled = false 
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        ${colorVariants[color] || colorVariants.blue}
        font-extrabold py-3 px-6 rounded-2xl 
        border-b-[6px] active:border-b-0 
        transform active:translate-y-[6px] 
        transition-all duration-75 ease-out
        uppercase tracking-wider shadow-sm
        ${disabled ? "opacity-50 cursor-not-allowed active:translate-y-0 active:border-b-[6px]" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}