// Remove unused imports

// TypeScript Interfaces
export interface BaseShape {
    id: string;
    x: number;
    y: number;
  }
  
  export interface Shape extends BaseShape {
    color: string;
    width: number;
    height: number;
  }
  
  export interface Square extends Shape {
    width: number;
    height: number;
  }
  
  export interface Circle extends Shape {
    radius: number;
  }
  
  export interface Arrow extends Shape {
    points: number[];
  }
  
  export interface TextBox extends Shape {
    text: string;
    fontSize: number;
    width: number;
    height: number;
    fontFamily: string;
    fontStyle?: string;
    textDecoration?: string;
  }
  
  export interface Dimensions {
    width: number;
    height: number;
  }
  
  export interface TextFormatting {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }
  
  export interface Guideline {
    points: number[];
    type: 'vertical' | 'horizontal';
  }
  
  export interface SnapPoints {
    vertical: Array<{ point: number; position: string }>;
    horizontal: Array<{ point: number; position: string }>;
  }
  
  export interface StageSnapLines {
    vertical: number[];
    horizontal: number[];
  }
  
  export interface FloorplanData {
    version: string;
    timestamp: string;
    canvas: {
      width: number;
      height: number;
    };
    elements: {
      squares: Square[];
      circles: Circle[];
      arrows: Arrow[];
      textBoxes: TextBox[];
      stallShapes: StallShape[];
    };
  }
  
  export interface SelectedTextNode {
    id: string;
    text: string;
    fontSize: number;
    fontFamily?: string;
    fontStyle?: string;
    textDecoration?: string;
    absolutePosition: { x: number; y: number };
  }
  
  export interface TextNode {
    id: string;
    text: string;
    fontSize: number;
    fontFamily?: string;
    fontStyle?: string;
    textDecoration?: string;
    absolutePosition: { x: number; y: number };
  }
  
  export interface StallShape extends BaseShape {
    stallType: 'single' | 'l-shaped' | 'double' | 'vertical-double';
    width: number;
    height: number;
    stallNumber: number;
  }
  
  // Add type guards
  export const isShape = (shape: Shape | StallShape | null): shape is Shape => {
    return shape !== null && 'color' in shape;
  };
  
  export const isStallShape = (shape: Shape | StallShape | null): shape is StallShape => {
    return shape !== null && 'stallType' in shape;
  };
  