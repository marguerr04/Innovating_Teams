// src/PagesAlejandro/Components/WordSearch.jsx
import React, { useState, useEffect, useMemo } from 'react';

function WordSearch({ onComplete }) {
  const words = ['UDD', 'TOKEN', 'GRUPO', 'JUEGO', 'INNOVA'];
  const size = 12;
  const letters = useMemo(() => {
    const grid = Array(size).fill(0).map(() => Array(size).fill(''));
    const rows = [1, 3, 5, 7, 9];
    words.forEach((w, i) => {
      const r = rows[i % rows.length];
      const start = i * 2 % (size - w.length);
      for (let j = 0; j < w.length; j++) { grid[r][start + j] = w[j]; }
    });
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) { for (let c = 0; c < size; c++) { if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)]; } }
    return grid;
  }, []); // Añadido array de dependencias vacío

  const [sel, setSel] = useState([]);
  const [found, setFound] = useState([]);

  const toggle = (r, c) => { const key = r + '-' + c; setSel(s => s.includes(key) ? s.filter(k => k !== key) : s.concat(key)); };

  useEffect(() => {
    const groups = {}; sel.forEach(k => { const [r, c] = k.split('-').map(Number); (groups[r] = groups[r] || []).push(c); });
    let newly = [];
    for (const r in groups) {
      const cols = groups[r].sort((a, b) => a - b);
      if (cols.length < 2) continue;
      let run = [];
      for (let i = 0; i < cols.length; i++) {
        if (i === 0 || cols[i] === cols[i - 1] + 1) run.push(cols[i]); else {
          if (run.length > 1) { const w = run.map(c => letters[r][c]).join(''); if (words.includes(w) && !found.includes(w)) newly.push(w); }
          run = [cols[i]];
        }
      }
      if (run.length > 1) { const w = run.map(c => letters[r][c]).join(''); if (words.includes(w) && !found.includes(w)) newly.push(w); }
    }
    if (newly.length) { setFound(f => [...f, ...newly]); setSel([]); }
  }, [sel, found, letters, words]); // Añadidas dependencias

  useEffect(() => { if (found.length === words.length) onComplete?.(); }, [found, onComplete, words.length]); // Añadidas dependencias

  return (
    <div className="grid md:grid-cols-[1fr,260px] gap-6">
      <div className="card p-6">
        <div className="grid-letters">
          {letters.map((row, r) => (row.map((ch, c) => (<div key={r + '-' + c} className={'cell ' + (sel.includes(r + '-' + c) ? 'sel' : '')} onClick={() => toggle(r, c)}>{ch}</div>))))}
        </div>
      </div>
      <div className="card p-6">
        <b>Palabras</b>
        <ul className="list-disc pl-5 mt-2 text-sm">{words.map(w => (<li key={w} className={found.includes(w) ? 'line-through text-emerald-700' : ''}>{w}</li>))}</ul>
        <div className="mt-4 text-sm text-slate-600">Encontradas: {found.length}/{words.length}</div>
      </div>
    </div>
  );
}

export default WordSearch;