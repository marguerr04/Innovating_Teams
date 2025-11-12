// src/pages/Tests.jsx
// Playground para probar animaciones de PersonAvatar y TeamAssemble sin interferir con fases reales.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PersonAvatar from '../modules/student/features/Phase0/components/PersonAvatar.jsx';
import TeamAssemble from '../modules/student/features/Phase0/components/TeamAsemble.jsx';

// Paleta base para probar distintas variaciones
const PALETTE = ['#4e79a7','#f28e2b','#59a14f','#e15759','#edc948','#b07aa1'];

export default function TestsPlayground() {
  const [showTeam, setShowTeam] = useState(true);
  const [avatars, setAvatars] = useState([
    { id: 1, color: PALETTE[0], startX: -320, finalX: -140, delay: 0 },
    { id: 2, color: PALETTE[1], startX: -180, finalX: -60, delay: 0.07 },
    { id: 3, color: PALETTE[2], startX: 180, finalX: 60, delay: 0.14 },
    { id: 4, color: PALETTE[3], startX: 340, finalX: 140, delay: 0.21 },
  ]);
  const [staggerReloadKey, setStaggerReloadKey] = useState(0);

  const randomizePositions = () => {
    setAvatars(prev => prev.map(a => ({
      ...a,
      startX: (Math.random() * 700 - 350) | 0,
      finalX: (Math.random() * 300 - 150) | 0,
      delay: Number((Math.random() * 0.25).toFixed(2))
    })));
    setStaggerReloadKey(k => k + 1);
  };

  const randomizeColors = () => {
    setAvatars(prev => prev.map(a => ({
      ...a,
      color: PALETTE[(Math.random()*PALETTE.length)|0]
    })));
    setStaggerReloadKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#101820] text-white font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Playground Animaciones</h1>
          <p className="text-white/70 max-w-2xl">Aquí puedes inspeccionar y ajustar la animación de <code className="text-emerald-300">PersonAvatar</code> y la escena <code className="text-emerald-300">TeamAssemble</code>. Usa los controles para regenerar posiciones, colores o alternar vista.</p>
        </header>

        {/* Controles */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowTeam(s => !s)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-semibold">{showTeam ? 'Ver Avatares Sueltos' : 'Ver Team Assemble'}</button>
          <button onClick={randomizePositions} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold">Aleatorizar posiciones</button>
          <button onClick={randomizeColors} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 transition font-semibold">Aleatorizar colores</button>
          <button onClick={() => setStaggerReloadKey(k => k + 1)} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-semibold">Reproducir animación</button>
        </div>

        {/* Vista Team Assemble */}
        {showTeam && (
          <div className="rounded-3xl border border-white/10 overflow-hidden">
            <TeamAssemble key={staggerReloadKey} />
          </div>
        )}

        {/* Vista avatares individuales */}
        {!showTeam && (
          <div className="relative rounded-3xl border border-white/10 p-8 bg-gradient-to-br from-[#162a38] to-[#0f1e29] min-h-[420px]">
            <h2 className="text-xl font-bold mb-6">Avatares individuales (stagger manual)</h2>
            <div className="relative flex flex-wrap gap-12 justify-center" key={staggerReloadKey}>
              {avatars.map(a => (
                <PersonAvatar key={a.id} color={a.color} startX={a.startX} finalX={a.finalX} delay={a.delay} />
              ))}
            </div>
            <p className="mt-8 text-sm text-white/60">Cada avatar usa props: <code>startX</code>, <code>finalX</code>, <code>delay</code>. En producción puedes calcularlos dinámicamente según layout.</p>
          </div>
        )}

        {/* Debug info */}
        <div className="bg-[#181e26] rounded-2xl p-5 text-sm font-mono border border-white/10">
          <p className="mb-2 font-semibold text-white/80">Estado actual:</p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-white/70">{JSON.stringify(avatars, null, 2)}</pre>
        </div>

        <footer className="pt-6 text-xs text-white/40">Playground temporal · elimina antes de producción.</footer>
      </div>
    </div>
  );
}