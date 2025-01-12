import { Shape, ShapeType, Position, BoothType } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SCALE = 1;
export const DEFAULT_COLOR = '#AED6F1';

export const BOOTH_SIZES: Record<BoothType | 'stage', { width: number; height: number }> = {
  'standard-booth': { width: 10 * GRID_SIZE, height: 10 * GRID_SIZE },
  'island-booth': { width: 20 * GRID_SIZE, height: 20 * GRID_SIZE },
  'peninsula-booth': { width: 20 * GRID_SIZE, height: 10 * GRID_SIZE },
  'popup-booth': { width: 10 * GRID_SIZE, height: 10 * GRID_SIZE },
  'canopy-booth': { width: 10 * GRID_SIZE, height: 15 * GRID_SIZE },
  'l-shaped-booth': { width: 20 * GRID_SIZE, height: 10 * GRID_SIZE },
  'u-shaped-booth': { width: 20 * GRID_SIZE, height: 10 * GRID_SIZE },
  'octanorm-booth': { width: 10 * GRID_SIZE, height: 10 * GRID_SIZE },
  'double-decker-booth': { width: 20 * GRID_SIZE, height: 20 * GRID_SIZE },
  'kiosk-booth': { width: 6 * GRID_SIZE, height: 6 * GRID_SIZE },
  'stage': { width: 30 * GRID_SIZE, height: 15 * GRID_SIZE }
};
let boothNumber = 1;

export const createShape = (type: ShapeType, index: number, color: string): Shape => {
  const isBoothType = Object.keys(BOOTH_SIZES).includes(type);
  const size = isBoothType 
    ? BOOTH_SIZES[type as BoothType] 
    : { width: 100, height: type === 'circle' ? 100 : 60 };

  return {
    id: `shape-${index + 1}`,
    type,
    x: 100,
    y: 100,
    width: size.width,
    height: size.height,
    fill: color,
    name: isBoothType ? `Booth ${boothNumber}` : `${type}-${index + 1}`,
    ...(isBoothType && { number: String(boothNumber++) })
  };
};

export const createGridPattern = (
  viewWidth: number, 
  viewHeight: number, 
  scale: number,
  position: Position
) => {
  const spacing = GRID_SIZE * scale;
  const width = Math.ceil(viewWidth / spacing) + 2;
  const height = Math.ceil(viewHeight / spacing) + 2;
  const offsetX = Math.floor((position.x % spacing) - spacing);
  const offsetY = Math.floor((position.y % spacing) - spacing);

  return { width, height, offsetX, offsetY, spacing };
};

export const generateArrowPath = (width: number, height: number): string => 
  `M0,${height / 2} L${width - 10},${height / 2} L${width - 10},${height / 2 - 10} 
   L${width},${height / 2 + 10} L${width - 10},${height / 2 + 30} L${width - 10},${height / 2 + 10}`;

export const calculateNewScale = (
  currentScale: number,
  deltaY: number,
  minScale = 0.1,
  maxScale = 5
): number => {
  const scaleChange = deltaY < 0 ? 1.1 : 0.9;
  const newScale = currentScale * scaleChange;
  return Math.min(Math.max(newScale, minScale), maxScale);
};

export const calculateNewPosition = (
  clientX: number,
  clientY: number,
  dragStart: Position
): Position => ({
  x: clientX - dragStart.x,
  y: clientY - dragStart.y,
});

export const updateShapeInList = (
  shapes: Shape[],
  shapeId: string,
  updates: Partial<Shape>
): Shape[] => 
  shapes.map(shape =>
    shape.id === shapeId ? { ...shape, ...updates } : shape
  );