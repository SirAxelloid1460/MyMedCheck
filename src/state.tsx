import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface SelectionState {
  selected: string[];
  notes: string;
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  setNotes: (notes: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionState | null>(null);

/** Provee la selección de síntomas y notas a todas las pantallas. */
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggle = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isSelected = useCallback((id: string) => selected.includes(id), [selected]);

  const clear = useCallback(() => {
    setSelected([]);
    setNotes('');
  }, []);

  const value = useMemo(
    () => ({ selected, notes, toggle, isSelected, setNotes, clear }),
    [selected, notes, toggle, isSelected, clear],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionState {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection debe usarse dentro de <SelectionProvider>');
  return ctx;
}
