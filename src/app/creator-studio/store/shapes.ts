/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { ShapeDefinition, BoothDefinition } from '../constants/shapes';
import { Vector2d } from 'konva/lib/types';

export type ShapeConfig = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  type: string;
  shapeType: 'shape' | 'booth' | 'furniture';
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
  name?: string;
  isLocked?: boolean;
  opacity?: number;
  boothNumber?: string;
  priceTier?: 'standard' | 'premium' | 'vip';
  status?: 'available' | 'reserved' | 'booked';
  dimensions?: {
    width: number;
    height: number;
    unit: 'ft' | 'm';
  };
};

type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
type DistributionType = 'horizontal' | 'vertical';

interface ShapesState {
  shapes: ShapeConfig[];
  selectedIds: string[];
  clipboard: ShapeConfig[];
  history: Array<{
    shapes: ShapeConfig[];
    selectedIds: string[];
  }>;
  historyIndex: number;
  
  addShape: (shapeData: ShapeDefinition | BoothDefinition, position: Vector2d) => void;
  updateShape: (id: string, updates: Partial<ShapeConfig>) => void;
  updateShapes: (updates: { id: string; changes: Partial<ShapeConfig> }[]) => void;
  deleteShape: (id: string) => void;
  deleteShapes: (ids: string[]) => void;
  duplicateShapes: (ids: string[]) => void;
  selectShape: (id: string, multi?: boolean) => void;
  selectShapes: (ids: string[]) => void;
  deselectAll: () => void;
  copySelectedToClipboard: () => void;
  paste: (offset?: Vector2d) => void;
  cut: () => void;
  undo: () => void;
  redo: () => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  toggleLock: (ids: string[]) => void;
  alignShapes: (type: AlignmentType) => void;
  distributeShapes: (type: DistributionType) => void;
}

const DEFAULT_SHAPE_SIZE = 100;

export const useShapesStore = create<ShapesState>()((set, get) => ({
  shapes: [],
  selectedIds: [],
  clipboard: [],
  history: [],
  historyIndex: -1,

  addShape: (shapeData: ShapeDefinition | BoothDefinition, position: Vector2d) => {
    const newShape: ShapeConfig = {
      id: nanoid(),
      x: position.x,
      y: position.y,
      width: DEFAULT_SHAPE_SIZE,
      height: DEFAULT_SHAPE_SIZE,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      type: shapeData.type || 'rectangle',
      shapeType: 'type' in shapeData ? 'booth' : 'shape',
      fill: '#E2E8F0',
      stroke: '#64748B',
      strokeWidth: 2,
      draggable: true,
      opacity: 1,
      isLocked: false
    };

    if ('dimensions' in shapeData && shapeData.dimensions) {
      const scale = 20; // 1ft = 20px
      newShape.width = shapeData.dimensions.width * scale;
      newShape.height = shapeData.dimensions.height * scale;
      newShape.boothNumber = `B${Math.floor(Math.random() * 1000)}`;
      newShape.priceTier = 'standard';
      newShape.status = 'available';
      newShape.dimensions = shapeData.dimensions;
    }

    set(produce((state: ShapesState) => {
      state.shapes.push(newShape);
      state.selectedIds = [newShape.id];
    }));
  },

  updateShape: (id: string, updates: Partial<ShapeConfig>) => set(produce((state: ShapesState) => {
    const shape = state.shapes.find(s => s.id === id);
    if (shape && !shape.isLocked) {
      Object.assign(shape, updates);
    }
  })),

  updateShapes: (updates: { id: string; changes: Partial<ShapeConfig> }[]) => set(produce((state: ShapesState) => {
    updates.forEach(({ id, changes }) => {
      const shape = state.shapes.find(s => s.id === id);
      if (shape && !shape.isLocked) {
        Object.assign(shape, changes);
      }
    });
  })),

  deleteShape: (id: string) => set(produce((state: ShapesState) => {
    state.shapes = state.shapes.filter(s => s.id !== id);
    state.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id);
  })),

  deleteShapes: (ids: string[]) => set(produce((state: ShapesState) => {
    state.shapes = state.shapes.filter(s => !ids.includes(s.id));
    state.selectedIds = state.selectedIds.filter(id => !ids.includes(id));
  })),

  selectShape: (id: string, multi: boolean = false) => set(produce((state: ShapesState) => {
    if (multi) {
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    } else {
      state.selectedIds = [id];
    }
  })),

  selectShapes: (ids: string[]) => set({ selectedIds: ids }),

  deselectAll: () => set({ selectedIds: [] }),

  toggleLock: (ids: string[]) => set(produce((state: ShapesState) => {
    state.shapes.forEach(shape => {
      if (ids.includes(shape.id)) {
        shape.isLocked = !shape.isLocked;
        shape.draggable = !shape.isLocked;
      }
    });
  })),

  copySelectedToClipboard: () => set(produce((state: ShapesState) => {
    const selectedShapes = state.shapes.filter(s => state.selectedIds.includes(s.id));
    state.clipboard = JSON.parse(JSON.stringify(selectedShapes));
  })),

  paste: (offset: Vector2d = { x: 20, y: 20 }) => set(produce((state: ShapesState) => {
    const newShapes = state.clipboard.map(shape => ({
      ...shape,
      id: nanoid(),
      x: shape.x + offset.x,
      y: shape.y + offset.y,
      isLocked: false,
      draggable: true
    }));
    state.shapes.push(...newShapes);
    state.selectedIds = newShapes.map(s => s.id);
  })),

  cut: () => {
    const { shapes, selectedIds } = get();
    const selectedShapes = shapes.filter(s => selectedIds.includes(s.id));
    set(produce((state: ShapesState) => {
      state.clipboard = JSON.parse(JSON.stringify(selectedShapes));
      state.shapes = state.shapes.filter(s => !selectedIds.includes(s.id));
      state.selectedIds = [];
    }));
  },

  undo: () => {
    // Implement undo logic
  },

  redo: () => {
    // Implement redo logic
  },

  bringToFront: (id: string) => set(produce((state: ShapesState) => {
    const index = state.shapes.findIndex(s => s.id === id);
    if (index !== -1) {
      const [shape] = state.shapes.splice(index, 1);
      state.shapes.push(shape);
    }
  })),

  sendToBack: (id: string) => set(produce((state: ShapesState) => {
    const index = state.shapes.findIndex(s => s.id === id);
    if (index !== -1) {
      const [shape] = state.shapes.splice(index, 1);
      state.shapes.unshift(shape);
    }
  })),

  bringForward: (id: string) => set(produce((state: ShapesState) => {
    const index = state.shapes.findIndex(s => s.id === id);
    if (index !== -1 && index < state.shapes.length - 1) {
      [state.shapes[index], state.shapes[index + 1]] = 
      [state.shapes[index + 1], state.shapes[index]];
    }
  })),

  sendBackward: (id: string) => set(produce((state: ShapesState) => {
    const index = state.shapes.findIndex(s => s.id === id);
    if (index > 0) {
      [state.shapes[index - 1], state.shapes[index]] = 
      [state.shapes[index], state.shapes[index - 1]];
    }
  })),

  alignShapes: (type: AlignmentType) => {
    // Implement alignment logic
  },

  distributeShapes: (type: DistributionType) => {
    // Implement distribution logic
  },

  duplicateShapes: (ids: string[]) => set(produce((state: ShapesState) => {
    const shapesToDuplicate = state.shapes.filter(s => ids.includes(s.id));
    const newShapes = shapesToDuplicate.map(shape => ({
      ...shape,
      id: nanoid(),
      x: shape.x + 20,
      y: shape.y + 20,
      isLocked: false,
      draggable: true
    }));
    state.shapes.push(...newShapes);
    state.selectedIds = newShapes.map(s => s.id);
  })),
}));