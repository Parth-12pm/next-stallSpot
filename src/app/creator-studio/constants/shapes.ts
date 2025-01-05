// app/creator-studio/constants/shapes.ts
import { LucideIcon, Square, Circle, Triangle, Hexagon, ArrowRight, LineChart, Box, LayoutGrid, Table2 } from 'lucide-react';

export interface ShapeDefinition {
  icon: LucideIcon;
  label: string;
  ariaLabel: string;
  type?: string;
  size?: string;
}

export interface BoothDefinition extends ShapeDefinition {
  type: 'standard' | 'large' | 'island' | 'peninsula' | 'kiosk';
  size: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'ft' | 'm';
  };
}

export const BASIC_SHAPES: ShapeDefinition[] = [
  { icon: Square, label: 'Rectangle', ariaLabel: 'Add rectangle shape' },
  { icon: Circle, label: 'Circle', ariaLabel: 'Add circle shape' },
  { icon: Triangle, label: 'Triangle', ariaLabel: 'Add triangle shape' },
  { icon: Hexagon, label: 'Polygon', ariaLabel: 'Add polygon shape' },
  { icon: ArrowRight, label: 'Arrow', ariaLabel: 'Add arrow shape' },
  { icon: LineChart, label: 'Line', ariaLabel: 'Add line shape' },
];

export const BOOTH_SHAPES: BoothDefinition[] = [
  { 
    icon: Box, 
    label: 'Standard (10x10)', 
    size: '10x10 ft', 
    ariaLabel: 'Add standard booth', 
    type: 'standard',
    dimensions: { width: 10, height: 10, unit: 'ft' }
  },
  { 
    icon: Box, 
    label: 'Large (10x20)', 
    size: '10x20 ft', 
    ariaLabel: 'Add large booth', 
    type: 'large',
    dimensions: { width: 10, height: 20, unit: 'ft' }
  },
  { 
    icon: Box, 
    label: 'Island (20x20)', 
    size: '20x20 ft', 
    ariaLabel: 'Add island booth', 
    type: 'island',
    dimensions: { width: 20, height: 20, unit: 'ft' }
  },
  { 
    icon: Box, 
    label: 'Peninsula (20x10)', 
    size: '20x10 ft', 
    ariaLabel: 'Add peninsula booth', 
    type: 'peninsula',
    dimensions: { width: 20, height: 10, unit: 'ft' }
  },
  { 
    icon: Box, 
    label: 'Kiosk (6x6)', 
    size: '6x6 ft', 
    ariaLabel: 'Add kiosk booth', 
    type: 'kiosk',
    dimensions: { width: 6, height: 6, unit: 'ft' }
  },
];

export const FURNITURE: ShapeDefinition[] = [
  { icon: Table2, label: 'Table', ariaLabel: 'Add table' },
  { icon: LayoutGrid, label: 'Counter', ariaLabel: 'Add counter' },
  { icon: Box, label: 'Chair', ariaLabel: 'Add chair' },
  { icon: Box, label: 'Desk', ariaLabel: 'Add desk' },
  { icon: Box, label: 'Storage', ariaLabel: 'Add storage' },
];

export type ShapeType = 'shape' | 'booth' | 'furniture';

export interface DraggedShape {
  type: ShapeType;
  shapeData: ShapeDefinition | BoothDefinition;
}