// src/utils/helpers.js
import { useState, useEffect, useRef } from 'react';

export const arr = (v) => (Array.isArray(v) ? v : []);

export const load = (k, def) => { 
  try { 
    return JSON.parse(localStorage.getItem(k) || 'null') ?? def 
  } catch { 
    return def 
  } 
};

export const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export function useRole() { 
  const [role, setRole] = useState(localStorage.getItem('it_role') || 'profesor'); 
  useEffect(() => localStorage.setItem('it_role', role), [role]); 
  return { role, setRole, isProf: role === 'profesor' }; 
}

export const AREAS = [{ id: 'salud', name: 'Salud' }, { id: 'sustentabilidad', name: 'Sustentabilidad' }, { id: 'educacion', name: 'Educación' }];

export const CHALL = {
  salud: [{ id: 'adultos-mayores-tecnologia', title: 'Tecnología adultos mayores', persona: { name: 'Osvaldo', age: 70, story: 'Le cuesta adaptarse a trámites digitales y apps; depende de su familia para gestiones en línea.' } }],
  sustentabilidad: [
    { id: 'fast-fashion', title: 'Fast fashion y zonas de desechos', persona: { name: 'Gabriela', age: 18, story: 'Vive cerca de vertederos; olores y residuos afectan su vida diaria.' } },
    { id: 'agua-agricultura', title: 'Sustentabilidad del agua en la agricultura', persona: { name: 'Camila', age: 50, story: 'Productora agrícola preocupada por la escasez de agua dulce.' } },
  ],
  educacion: [{ id: 'brecha-digital', title: 'Brecha digital en educación', persona: { name: 'Luis', age: 12, story: 'Acceso limitado a internet y dispositivos; se atrasa en clases.' } }]
};

export const CATS = [
  { id: 'necesidades', name: 'Necesidades', cls: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  { id: 'dolores', name: 'Dolores', cls: 'bg-rose-100 text-rose-900 border-rose-200' },
  { id: 'objetivos', name: 'Objetivos', cls: 'bg-indigo-100 text-indigo-900 border-indigo-200' },
  { id: 'contexto', name: 'Contexto', cls: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'restricciones', name: 'Restricciones', cls: 'bg-slate-100 text-slate-900 border-slate-200' },
  { id: 'tecnologia', name: 'Tecnología', cls: 'bg-cyan-100 text-cyan-900 border-cyan-200' },
  { id: 'recursos', name: 'Recursos', cls: 'bg-lime-100 text-lime-900 border-lime-200' },
  { id: 'exito', name: 'Criterios de éxito', cls: 'bg-purple-100 text-purple-900 border-purple-200' },
];

export const defaultPoll = { 
  options: [
    { id: 'sopa', label: 'Sopa de letras' },
    { id: 'armar', label: 'Armar palabras con letras' },
    { id: 'ice', label: 'Romper el hielo con el grupo' },
  ], 
  votes: {}, 
  myVote: null 
};

export function beep() { 
  try { 
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
    const o = ctx.createOscillator(); 
    const g = ctx.createGain(); 
    o.type = 'sine'; 
    o.frequency.value = 880; 
    g.gain.value = 0.05; 
    o.connect(g); 
    g.connect(ctx.destination); 
    o.start(); 
    setTimeout(() => { o.stop(); ctx.close(); }, 120); 
  } catch (e) { } 
}

