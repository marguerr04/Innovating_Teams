// PersonAvatar.jsx
import { motion } from "framer-motion";

/**
 * Avatar compuesto (cabeza + cuerpo) con un ícono genérico dentro de la cabeza.
 * - color: color principal (tailwind or hex)
 * - delay: para escalonar (stagger) la entrada
 * - startX: posición X inicial (px) desde la que viaja al centro
 * - finalX: posición X final (px) para su posición de “juntos”
 */
export default function PersonAvatar({
  color = "#4e79a7",
  delay = 0,
  startX = 0,
  finalX = 0,
}) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const travel = {
    initial: { x: startX, y: 0, opacity: 0, scale: 0.95 },
    animate: prefersReduced
      ? { x: finalX, opacity: 1, scale: 1 }
      : {
          x: finalX,
          opacity: 1,
          scale: [0.95, 1.06, 1],
          transition: {
            duration: 0.9,
            ease: "easeOut",
            delay,
          },
        },
    // “respira” suavemente luego de llegar
    whileInView: prefersReduced
      ? {}
      : {
          y: [0, -3, 0],
          transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
        },
  };

  return (
    <motion.div
      className="relative w-[120px] h-[180px] flex items-start justify-center"
      initial="initial"
      animate="animate"
      whileInView="whileInView"
      variants={travel}
    >
      {/* Cuerpo (óvalo) */}
      <div
        className="absolute bottom-0 w-[86px] h-[140px] rounded-full"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(255,255,255,.25), rgba(0,0,0,.12)), " +
            color,
          boxShadow: "0 12px 28px rgba(0,0,0,.22)",
        }}
      />
      {/* Cabeza (círculo) */}
      <div
        className="absolute -top-2 w-[94px] h-[94px] rounded-full grid place-items-center border"
        style={{
          background:
            "radial-gradient(65% 65% at 40% 30%, rgba(255,255,255,.35), rgba(0,0,0,.10)), " +
            color,
          borderColor: "rgba(255,255,255,.35)",
          boxShadow: "0 10px 22px rgba(0,0,0,.18)",
        }}
      >
        {/* Ícono de perfil simple en SVG (busto) */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
            fill="rgba(255,255,255,.9)"
          />
          <path
            d="M4 20.5c0-3.59 3.582-6.5 8-6.5s8 2.91 8 6.5V22H4v-1.5Z"
            fill="rgba(255,255,255,.9)"
          />
        </svg>
      </div>
    </motion.div>
  );
}
