// app/creator-studio/components/canvas/Canvas.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '../../store/canvas';
import { Layer as ReactKonvaLayer } from 'react-konva'; // Direct import of Layer
import { Stage, Rect, Circle, Transformer } from 'react-konva';

function CanvasContent({ stageRef }: { stageRef: React.RefObject<Konva.Stage> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const {
    scale,
    position,
    shapes,
    selectedIds,
    setPosition,
    setScale,
    selectShape,
    updateShape,
    deselectAll
  } = useCanvasStore();

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    const updateDimensions = () => {
      if (!container) return;

      setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight
      });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  // Handle transformer
  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const stage = transformer.getStage();
    if (!stage) return;

    const selectedNodes = selectedIds
      .map(id => stage.findOne('#' + id))
      .filter((node): node is Konva.Node => node !== undefined);

    transformer.nodes(selectedNodes);
    transformer.getLayer()?.batchDraw();
  }, [selectedIds]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.min(Math.max(newScale, 0.1), 5);

    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };

    setScale(limitedScale);
    setPosition(newPos);
  }, [scale, position, setScale, setPosition]);

  // Handle stage click for deselection
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      deselectAll();
    }
  }, [deselectAll]);

  // Handle shape drag
  const handleShapeDragEnd = useCallback((e: KonvaEventObject<DragEvent>, id: string) => {
    const shape = e.target;
    updateShape(id, {
      x: shape.x(),
      y: shape.y(),
    });
  }, [updateShape]);

  // Render shape based on type
  const renderShape = useCallback((shape: {
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
  }) => {
    const commonProps = {
      id: shape.id,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      rotation: shape.rotation,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      draggable: shape.draggable,
      onClick: () => selectShape(shape.id, false),
      onTap: () => selectShape(shape.id, false),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => handleShapeDragEnd(e, shape.id),
    };

    switch (shape.type) {
      case 'rectangle':
        return <Rect key={shape.id} {...commonProps} />;
      case 'circle':
        return (
          <Circle
            key={shape.id}
            {...commonProps}
            radius={shape.width / 2}
          />
        );
      default:
        return <Rect key={shape.id} {...commonProps} />;
    }
  }, [selectShape, handleShapeDragEnd]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        draggable
        onDragMove={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            setPosition({ x: stage.x(), y: stage.y() });
          }
        }}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
      >
        <ReactKonvaLayer>
          {shapes.map(renderShape)}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minSize = 5;
              const maxSize = 1000;
              if (
                newBox.width < minSize ||
                newBox.height < minSize ||
                newBox.width > maxSize ||
                newBox.height > maxSize
              ) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </ReactKonvaLayer>
      </Stage>
    </div>
  );
}

// Final export wrapped in dynamic import
export default dynamic(() => Promise.resolve(CanvasContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background/50">
      <span>Loading Canvas...</span>
    </div>
  ),
});