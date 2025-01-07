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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Square, Grid, Move } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SCALE = 1;

const FloorPlanEditor = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('select');
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);

  // Add new shape
  const addShape = (type) => {
    const newShape = {
      id: `shape-${shapes.length + 1}`,
      type,
      x: 100,
      y: 100,
      width: type === 'booth' ? 80 : 100,
      height: type === 'booth' ? 60 : 100,
      fill: '#AED6F1',
      name: `${type}-${shapes.length + 1}`,
    };
    setShapes([...shapes, newShape]);
  };

  // Handle mouse events for panning
  const handleMouseDown = (e) => {
    if (tool === 'select' && e.target.tagName === 'svg') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleChange = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = scale * scaleChange;
    
    // Limit zoom level
    if (newScale > 0.1 && newScale < 5) {
      setScale(newScale);
    }
  };

  // Create grid lines
  const createGrid = () => {
    const gridLines = [];
    const width = 2000;
    const height = 1000;

    // Vertical lines
    for (let i = 0; i < width / GRID_SIZE; i++) {
      gridLines.push(
        <line
          key={`v${i}`}
          x1={i * GRID_SIZE}
          y1={0}
          x2={i * GRID_SIZE}
          y2={height}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i < height / GRID_SIZE; i++) {
      gridLines.push(
        <line
          key={`h${i}`}
          x1={0}
          y1={i * GRID_SIZE}
          x2={width}
          y2={i * GRID_SIZE}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    return gridLines;
  };

  return (
    <div className="flex h-screen">
      {/* Toolbar */}
      <Card className="w-64 border-r">
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant={tool === 'select' ? 'default' : 'outline'} 
            className="w-full flex items-center gap-2"
            onClick={() => setTool('select')}
          >
            <Move className="h-4 w-4" />
            Select
          </Button>
          <Button 
            variant={tool === 'booth' ? 'default' : 'outline'}
            className="w-full flex items-center gap-2"
            onClick={() => addShape('booth')}
          >
            <Square className="h-4 w-4" />
            Add Booth
          </Button>
          <Button 
            variant={tool === 'rectangle' ? 'default' : 'outline'}
            className="w-full flex items-center gap-2"
            onClick={() => addShape('rectangle')}
          >
            <Grid className="h-4 w-4" />
            Add Rectangle
          </Button>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div 
        className="flex-1 relative overflow-hidden"
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <g
            transform={`translate(${position.x},${position.y}) scale(${scale})`}
          >
            {/* Grid */}
            <g>{createGrid()}</g>

            {/* Shapes */}
            {shapes.map((shape) => (
              <g
                key={shape.id}
                transform={`translate(${shape.x},${shape.y})`}
                onClick={() => setSelectedId(shape.id)}
              >
                <rect
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={selectedId === shape.id ? '#00ff00' : '#666'}
                  strokeWidth={2}
                />
                <text
                  x={shape.width / 2}
                  y={shape.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fill="#333"
                >
                  {shape.name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FloorPlanEditor;