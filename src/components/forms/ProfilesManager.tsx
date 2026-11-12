// ============================================================================
// Componente: Gestión de perfiles de medidas (guardar, editar, borrar)
// ============================================================================

import { useState } from "react";
import { Save, Trash2, Edit3 } from "lucide-react";
import type { SavedProfile } from "../../types";

interface ProfilesManagerProps {
  profiles: SavedProfile[];
  onLoad: (profile: SavedProfile) => void;
  onCreate: (name: string, category: string, measures: Record<string, number>) => void;
  onEdit: (id: string, changes: Partial<SavedProfile>) => void;
  onDelete: (id: string) => void;
  currentMeasures: Record<string, number>;
  category: string;
}

export function ProfilesManager({ profiles, onLoad, onCreate, onEdit, onDelete, currentMeasures, category }: ProfilesManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim(), category, currentMeasures);
    setNewName("");
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    onEdit(editingId, { name: editName.trim() });
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="mt-8 border-t border-beige pt-6">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Save size={16} className="text-sageDark" /> Perfiles guardados
      </h3>
      <div className="flex gap-2 mb-4">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre del perfil (ej. Mi cuerpo)" className="flex-1 px-3 py-2 rounded-lg border border-beige bg-white text-sm text-slate-800 focus:ring-2 focus:ring-sage outline-none" />
        <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-terracotta text-white text-sm font-medium hover:bg-terracottaDark transition" disabled={!newName.trim()}>Guardar</button>
      </div>
      {profiles.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No hay perfiles guardados aún.</p>
      ) : (
        <div className="space-y-2">
          {profiles.map((p) => {
            const isEditing = editingId === p.id;
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 bg-white rounded-lg border border-beige p-3">
                {isEditing ? (
                  <input type="text" value={editName || p.name} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm bg-beige focus:ring-1 focus:ring-sage outline-none" autoFocus />
                ) : (
                  <span className="flex-1 text-sm text-slate-700 cursor-pointer hover:text-terracotta transition" onClick={() => onLoad(p)}>{p.name}</span>
                )}
                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <button onClick={handleSaveEdit} className="p-1.5 text-sage hover:text-sageDark" title="Guardar"><Edit3 size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:text-slate-700" title="Cancelar"><Trash2 size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditName(p.name); setEditingId(p.id); }} className="p-1.5 text-sage hover:text-sageDark" title="Editar nombre"><Edit3 size={14} /></button>
                      <button onClick={() => onDelete(p.id)} className="p-1.5 text-terracotta hover:bg-terracotta/10 rounded" title="Borrar perfil"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}