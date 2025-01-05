// app/creator-studio/store/canvas.ts
import { create } from 'zustand';
import { Vector2d } from 'konva/lib/types';

interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
}

interface CanvasState {
  scale: number;
  position: Vector2d;
  shapes: Shape[];
  selectedIds: string[];
  setScale: (scale: number) => void;
  setPosition: (position: Vector2d) => void;
  selectShape: (id: string, multi: boolean) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  deselectAll: () => void;
  addShape: (shape: Shape) => void;
  deleteShape: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  scale: 1,
  position: { x: 0, y: 0 },
  shapes: [],
  selectedIds: [],
  
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  
  selectShape: (id, multi) => set((state) => ({
    selectedIds: multi 
      ? state.selectedIds.includes(id)
        ? state.selectedIds.filter(selectedId => selectedId !== id)
        : [...state.selectedIds, id]
      : [id]
  })),
  
  updateShape: (id, updates) => set((state) => ({
    shapes: state.shapes.map((shape) =>
      shape.id === id ? { ...shape, ...updates } : shape
    ),
  })),
  
  deselectAll: () => set({ selectedIds: [] }),
  
  addShape: (shape) => set((state) => ({
    shapes: [...state.shapes, shape]
  })),
  
  deleteShape: (id) => set((state) => ({
    shapes: state.shapes.filter((shape) => shape.id !== id),
    selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id)
  })),
}));