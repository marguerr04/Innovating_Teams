// TeamAssemble.jsx
// FIX: ruta corregida (antes apuntaba a ./components/PersonAvatar, que no existe)
import PersonAvatar from "./PersonAvatar";

/**
 * Escena de “equipo se junta”: cuatro avatars viajan al centro con un leve solapamiento.
 * Colores pensados para buen contraste; cambia los hex si tienes paleta propia.
 */
export default function TeamAssemble() {
  // posiciones finales (ligero solape para “equipo”)
  const finals = [-90, -30, 30, 90];

  return (
    <section className="w-full min-h-[68vh] grid place-items-center bg-gradient-to-b from-sea-600/60 to-sea-500/30">
      <div className="relative w-[820px] max-w-[92vw] h-[360px] grid place-items-center">
        {/* Título sutil */}
        <h2 className="absolute -top-4 text-white/90 font-extrabold tracking-wide text-3xl drop-shadow">
          EQUIPO
        </h2>

        {/* Contenedor de los 4 participantes */}
        <div className="relative flex items-end justify-center gap-6">
          <PersonAvatar
            color="#4e79a7"
            delay={0.00}
            startX={-380}
            finalX={finals[0]}
          />
          <PersonAvatar
            color="#f28e2b"
            delay={0.08}
            startX={-180}
            finalX={finals[1]}
          />
          <PersonAvatar
            color="#59a14f"
            delay={0.16}
            startX={180}
            finalX={finals[2]}
          />
          <PersonAvatar
            color="#e15759"
            delay={0.24}
            startX={380}
            finalX={finals[3]}
          />
        </div>

        {/* pulso suave en el centro para dar “unión” */}
        <div className="absolute inset-0 grid place-items-center -z-10">
          <div className="w-40 h-40 rounded-full bg-white/8 blur-2xl animate-ping-slow" />
        </div>
      </div>
    </section>
  );
}
