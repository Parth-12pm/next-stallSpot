export type BoothType = 
  | 'standard-booth'
  | 'island-booth'
  | 'peninsula-booth'
  | 'popup-booth'
  | 'canopy-booth'
  | 'l-shaped-booth'
  | 'u-shaped-booth'
  | 'octanorm-booth'
  | 'double-decker-booth'
  | 'kiosk-booth';

  export type ShapeType = 'square' | 'rectangle' | 'circle' | 'arrow' | BoothType | 'stage';
export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  name: string;
  number?: string;
}

export interface DraggedShape {
  id: string;
  offsetX: number;
  offsetY: number;
}

export interface Position {
  x: number;
  y: number;
}

export type ToolType = 'select' | 'shape';
// Editor State Types
export interface EditorState {
  shapes: Shape[];
  selectedId: string | null;
  tool: ToolType;
  scale: number;
  position: Position;
  isDragging: boolean;
  dragStart: Position;
  draggedShape: DraggedShape | null;
  selectedColor: string;
  editingText: string | null;
}