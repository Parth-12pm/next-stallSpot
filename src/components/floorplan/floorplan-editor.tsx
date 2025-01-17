'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Square, Circle, Move, ArrowRight, RectangleHorizontal } from 'lucide-react';

import {
  Shape,
  DraggedShape,
  Position,
  ToolType,
  ShapeType
} from './types';

import {
  INITIAL_SCALE,
  DEFAULT_COLOR,
  createShape,
  calculateNewScale,
  calculateNewPosition,
  updateShapeInList
} from './utils';

const FloorPlanEditor = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<ToolType>('select');
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [draggedShape, setDraggedShape] = useState<DraggedShape | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [, setViewportDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewportDimensions = () => {
      if (svgRef.current) {
        setViewportDimensions({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight
        });
      }
    };

    updateViewportDimensions();
    window.addEventListener('resize', updateViewportDimensions);
    return () => window.removeEventListener('resize', updateViewportDimensions);
  }, []);

  const addShape = (type: ShapeType) => {
    const newShape = createShape(type, shapes.length, DEFAULT_COLOR);
    setShapes([...shapes, newShape]);
  };

  const handleShapeMouseDown = (e: React.MouseEvent, shape: Shape) => {
    if (tool !== 'select') return;
    e.stopPropagation();
    setDraggedShape({
      id: shape.id,
      offsetX: e.clientX - shape.x,
      offsetY: e.clientY - shape.y
    });
    setSelectedId(shape.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition(calculateNewPosition(e.clientX, e.clientY, dragStart));
    } else if (draggedShape) {
      const newShapes = updateShapeInList(shapes, draggedShape.id, {
        x: e.clientX - draggedShape.offsetX,
        y: e.clientY - draggedShape.offsetY
      });
      setShapes(newShapes);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedShape(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (tool === 'select' && e.currentTarget === e.target) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = calculateNewScale(scale, e.deltaY);
    setScale(newScale);
  };



  const handleTextChange = (id: string, newName: string) => {
    const newShapes = updateShapeInList(shapes, id, { name: newName });
    setShapes(newShapes);
    setEditingText(null);
  };
  const createGrid = () => {
    // Calculate visible area
    const visibleWidth = window.innerWidth;
    const visibleHeight = window.innerHeight;
  
    // Calculate grid extent (make it larger than viewport)
    const gridExtent = Math.max(visibleWidth, visibleHeight) * 3;
    
    const spacing = 20 * scale;
    const numCols = Math.ceil(gridExtent / spacing);
    const numRows = Math.ceil(gridExtent / spacing);
  
    // Calculate starting position based on current pan position
    const startX = Math.floor(position.x / spacing) * spacing - gridExtent / 2;
    const startY = Math.floor(position.y / spacing) * spacing - gridExtent / 2;
  
    const gridLines = [];
  
    // Vertical lines
    for (let i = 0; i <= numCols; i++) {
      gridLines.push(
        <line
          key={`v${i}`}
          x1={(startX + i * spacing) / scale}
          y1={startY / scale}
          x2={(startX + i * spacing) / scale}
          y2={(startY + gridExtent) / scale}
          stroke="#ddd"
          strokeWidth={0.5 / scale}
        />
      );
    }
  
    // Horizontal lines
    for (let i = 0; i <= numRows; i++) {
      gridLines.push(
        <line
          key={`h${i}`}
          x1={startX / scale}
          y1={(startY + i * spacing) / scale}
          x2={(startX + gridExtent) / scale}
          y2={(startY + i * spacing) / scale}
          stroke="#ddd"
          strokeWidth={0.5 / scale}
        />
      );
    }
  
    return gridLines;
  };
  const renderShape = (shape: Shape) => {
    const strokeColor = selectedId === shape.id ? '#00ff00' : '#666';
  
    switch (shape.type) {
      case 'circle':
        return (
          <circle
            cx={shape.width / 2}
            cy={shape.height / 2}
            r={shape.width / 2}
            fill={shape.fill}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
      case 'arrow':
        return (
          <>
            <line
              x1={0}
              y1={shape.height / 2}
              x2={shape.width - 15}
              y2={shape.height / 2}
              stroke={strokeColor}
              strokeWidth={4}
            />
            <polygon
              points={`${shape.width-15},${shape.height/2-10} ${shape.width},${shape.height/2} ${shape.width-15},${shape.height/2+10}`}
              fill={strokeColor}
            />
          </>
        );
        case 'l-shaped-booth':
          // L-shaped booth following the design
          return (
            <path
              d={`M0,0 
                 H${shape.width * 0.3} 
                 V${shape.height} 
                 H${shape.width} 
                 V${shape.height * 0.3} 
                 H${shape.width * 0.3} 
                 V0 Z`}
              fill={shape.fill}
              stroke={strokeColor}
              strokeWidth={2}
            />
          );
        case 'u-shaped-booth':
          // U-shaped booth following the design
          return (
            <path
              d={`M0,0 
                 H${shape.width * 0.3} 
                 V${shape.height * 0.7} 
                 H${shape.width * 0.7} 
                 V${shape.height * 0.7} 
                 H${shape.width} 
                 V0 
                 V${shape.height} 
                 H0 Z`}
              fill={shape.fill}
              stroke={strokeColor}
              strokeWidth={2}
            />
          );
      case 'island-booth':
        return (
          <>
            <rect
              width={shape.width}
              height={shape.height}
              fill={shape.fill}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <rect
              x={5}
              y={5}
              width={shape.width - 10}
              height={shape.height - 10}
              fill="none"
              stroke={strokeColor}
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          </>
        );
      case 'peninsula-booth':
        return (
          <path
            d={`M0,0 
               H${shape.width} 
               V${shape.height} 
               H0 
               V${shape.height * 0.2} 
               H10 
               V${shape.height * 0.8} 
               H0 Z`}
            fill={shape.fill}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
      default:
        return (
          <rect
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Card className="w-80 border-r overflow-y-auto">
        <CardHeader>
          <CardTitle>Floor Plan Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="shapes">
            <TabsList className="w-full">
              <TabsTrigger value="shapes" className="flex-1">Shapes</TabsTrigger>
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shapes" className="space-y-4 mt-4">
              <Button 
                variant={tool === 'select' ? 'default' : 'outline'} 
                className="w-full flex items-center gap-2 justify-start p-4"
                onClick={() => setTool('select')}
              >
                <Move className="h-4 w-4" />
                Select
              </Button>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Basic Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('square')}
                  >
                    <Square className="h-4 w-4" />
                    Square
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('rectangle')}
                  >
                    <RectangleHorizontal className="h-4 w-4" />
                    Rectangle
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('circle')}
                  >
                    <Circle className="h-4 w-4" />
                    Circle
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('arrow')}
                  >
                    <ArrowRight className="h-4 w-4" />
                    Arrow
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Booth Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('standard-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Standard
                  </Button>
                  <Button 
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => addShape('u-shaped-booth')}
                        >
                          <Square className="h-4 w-4" />
                          U-Shaped
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('island-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Island
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('peninsula-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Peninsula
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('popup-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Pop-Up
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('canopy-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Canopy
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('l-shaped-booth')}
                  >
                    <Square className="h-4 w-4" />
                    L-Shaped
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('kiosk-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Kiosk
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => addShape('double-decker-booth')}
                  >
                    <Square className="h-4 w-4" />
                    Double Deck
                  </Button>
                </div>
              </div>

            </TabsContent>

            <TabsContent value="properties" className="space-y-4 mt-4">
              {selectedId && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input
                      type="color"
                      value={shapes.find(s => s.id === selectedId)?.fill || DEFAULT_COLOR}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newShapes = updateShapeInList(shapes, selectedId, { fill: e.target.value });
                        setShapes(newShapes);
                      }}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      type="text"
                      value={shapes.find(s => s.id === selectedId)?.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newShapes = updateShapeInList(shapes, selectedId, { name: e.target.value });
                        setShapes(newShapes);
                      }}
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div 
        className="flex-1 relative overflow-hidden bg-white"
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? 'grabbing' : (tool === 'select' ? 'grab' : 'crosshair')
          }}
        >
          <g transform={`translate(${position.x},${position.y}) scale(${scale})`}>
            <g>{createGrid()}</g>

            {shapes.map((shape) => (
              <g
                key={shape.id}
                transform={`translate(${shape.x},${shape.y})`}
                onMouseDown={(e) => handleShapeMouseDown(e, shape)}
              >
                {renderShape(shape)}
                {editingText === shape.id ? (
                  <foreignObject
                    x={0}
                    y={shape.height / 2 - 12}
                    width={shape.width}
                    height={24}
                  >
                    <Input
                      type="text"
                      defaultValue={shape.name}
                      autoFocus
                      className="w-full h-full text-center bg-transparent"
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => 
                        handleTextChange(shape.id, e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          handleTextChange(shape.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                  </foreignObject>
                ) : (
                  shape.number && (
                    <text
                      x={shape.width / 2}
                      y={shape.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={14}
                      fill="#333"
                      style={{ userSelect: 'none' }}
                    >
                      {shape.number}
                    </text>
                  )
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FloorPlanEditor;