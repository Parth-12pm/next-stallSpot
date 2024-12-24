'use client'
import React from 'react'
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
// Import constants
import {
  ACTIONS,
} from '@/components/floorplanEditor/constants';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Arrow,
  Text,
  Group,
  Image as KonvaImage,
} from "react-konva";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bold, Italic, Underline } from "lucide-react";
import * as Icons from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fonts from "@/app/playground/fonts";
import HorizontalDouble from '@/assets/images/HorizontalDouble.png';
import VerticalDouble from '@/assets/images/VerticalDouble.png';
import Single from '@/assets/images/singleStall.png';
import LShaped from '@/assets/images/LStall.png';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage as StageType } from 'konva/lib/Stage';
import { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import Konva from "konva";
import useImage from 'use-image';
import NextImage from 'next/image';
import { 
  Shape, 
  Square, 
  TextBox, 
  Dimensions, 
  TextFormatting, 
  FloorplanData, 
  SelectedTextNode, 
  TextNode, 
  StallShape, 
  isShape, 
  isStallShape 
} from '@/components/floorplanEditor/types';


// Add these before your component
const stallImages = {
  'single': Single,
  'l-shaped': LShaped,
  'double': HorizontalDouble,
  'vertical-double': VerticalDouble
} as const;

// Update the Circle interface in your types
interface Circle extends Shape {
  radius: number;
  width: number;
  height: number;
}

// Update the Arrow interface in your types
interface Arrow extends Shape {
  points: number[];
  width: number;
  height: number;
}

// Keep existing interfaces and types



function FP(): JSX.Element {
  // Refs
  const stageRef = useRef<StageType | null>(null);
  const transformerRef = useRef<TransformerType | null>(null);
  const textEditingRef = useRef<HTMLTextAreaElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const isPainting = useRef<boolean>();
  const currentShapeId = useRef<string>();

  // State
  const [color, setColor] = useState<string>("#2f2f2f");
  const [action, setAction] = useState<string>(ACTIONS.SELECT);
  const [squares, setSquares] = useState<Square[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [selectedTextNode, setSelectedTextNode] = useState<SelectedTextNode | null>(null);
  const [editingText, setEditingText] = useState<boolean>(false);
  const [selectedShape, setSelectedShape] = useState<Shape | StallShape | null>(null);
  const [selectedShapeType, setSelectedShapeType] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [selectedFont, setSelectedFont] = useState<string>(fonts[0].value);
  const [textFormatting, setTextFormatting] = useState<TextFormatting>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [stallShapes, setStallShapes] = useState<StallShape[]>([]);
  const [stallCount, setStallCount] = useState<number>(0);

  const strokeColor = "#000000";
  const isDraggable = action === ACTIONS.SELECT;


// Update handleDragMove to use the optimized getSnapGuidelines
const handleDragMove = (e: KonvaEventObject<DragEvent>): void => {
  const shape = e.target;
  const stage = shape.getStage();
  if (!stage) return;
  stage.batchDraw();
};

  // Event Handlers

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newColor = e.target.value;
    setColor(newColor);

    if (!selectedShape || !selectedShapeType) return;
    if (isShape(selectedShape)) {
      switch (selectedShapeType) {
        case "square":
          setSquares(prevSquares =>
            prevSquares.map(square =>
              square.id === selectedShape.id
                ? { ...square, color: newColor }
                : square
            )
          );
          break;
        case "circle":
          setCircles(prevCircles =>
            prevCircles.map(circle =>
              circle.id === selectedShape.id
                ? { ...circle, color: newColor }
                : circle
            )
          );
          break;
        case "arrow":
          setArrows(prevArrows =>
            prevArrows.map(arrow =>
              arrow.id === selectedShape.id
                ? { ...arrow, color: newColor }
                : arrow
            )
          );
          break;
        case "textBox":
          setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
              textBox.id === selectedShape.id
                ? { ...textBox, color: newColor }
                : textBox
            )
          );
          break;
      }
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newWidth = Number(e.target.value);
    if (isNaN(newWidth) || !selectedShape || !selectedShapeType) return;

    setDimensions(prev => ({ ...prev, width: newWidth }));

    if (isStallShape(selectedShape)) {
      setStallShapes(prevStalls =>
        prevStalls.map(stall =>
          stall.id === selectedShape.id
            ? { ...stall, width: newWidth }
            : stall
        )
      );
    } else if (isShape(selectedShape)) {
      switch (selectedShapeType) {
        case "square":
          setSquares(prevSquares =>
            prevSquares.map(square =>
              square.id === selectedShape.id
                ? { ...square, width: newWidth }
                : square
            )
          );
          break;
        case "circle":
          setCircles(prevCircles =>
            prevCircles.map(circle =>
              circle.id === selectedShape.id
                ? { ...circle, radius: newWidth / 2 }
                : circle
            )
          );
          break;
        case "arrow":
          setArrows(prevArrows =>
            prevArrows.map(arrow => {
              if (arrow.id === selectedShape.id) {
                const [x1, y1, , y2] = arrow.points;
                return {
                  ...arrow,
                  points: [x1, y1, x1 + newWidth, y2],
                };
              }
              return arrow;
            })
          );
          break;
        case "textBox":
          setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
              textBox.id === selectedShape.id
                ? { ...textBox, width: newWidth }
                : textBox
            )
          );
          break;
      }
    }
  };

  const isSketching = (event: KonvaEventObject<MouseEvent>): void => {
    isPainting.current = false;
    const stage = stageRef.current;
    if (!stage) return;  // Add this line
    const targetNode = event.target;

    if (targetNode === stage) {
      transformerRef.current?.nodes([]);
      setSelectedShape(null);
      setSelectedShapeType(null);
      stage.batchDraw();
    } else {
      const shape = stage.findOne(
        (node: Konva.Node) => node.id() === currentShapeId.current
      );
      if (shape) {
        transformerRef.current?.nodes([shape]);
        stage.batchDraw();
        setAction(ACTIONS.SELECT);
      }
    }
  };

  const handleShapeSelection = (event: KonvaEventObject<MouseEvent>): void => {
    if (action !== ACTIONS.SELECT) return;

    const selectedNode = event.target;
    const transformer = transformerRef.current;
    if (!transformer) return;
    transformer.nodes([selectedNode]);

    const id = selectedNode.id();
    let shape: Shape | StallShape | null = null;
    let type: string | null = null;
    let shapeDimensions: Dimensions = { width: 0, height: 0 };

    const stall = stallShapes.find((s) => s.id === id);
    if (stall) {
      shape = stall;
      type = "stall";
      shapeDimensions = {
        width: stall.width,
        height: stall.height,
      };
    } else {
      const square = squares.find((s) => s.id === id);
      if (square) {
        shape = square;
        type = "square";
        setColor(square.color);
        shapeDimensions = { width: square.width, height: square.height };
      }

      const circle = circles.find((c) => c.id === id);
      if (circle) {
        shape = circle;
        type = "circle";
        setColor(circle.color);
        shapeDimensions = {
          width: circle.radius * 2,
          height: circle.radius * 2,
        };
      }

      const arrow = arrows.find((a) => a.id === id);
      if (arrow) {
        shape = arrow;
        type = "arrow";
        setColor(arrow.color);
        const [x1, y1, x2, y2] = arrow.points;
        shapeDimensions = {
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        };
      }

      const textBox = textBoxes.find((t) => t.id === id);
      if (textBox) {
        shape = textBox;
        type = "textBox";
        setColor(textBox.color);
        shapeDimensions = { width: textBox.width || 0, height: 0 };
      }
    }

    setSelectedShape(shape);
    setSelectedShapeType(type);
    setDimensions(shapeDimensions);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newHeight = Number(e.target.value);
    if (isNaN(newHeight) || !selectedShape || !selectedShapeType) return;

    setDimensions(prev => ({ ...prev, height: newHeight }));

    if ('height' in selectedShape) {
      switch (selectedShapeType) {
        case "square":
          setSquares(prevSquares =>
            prevSquares.map(square =>
              square.id === selectedShape.id
                ? { ...square, height: newHeight }
                : square
            )
          );
          break;
        case "circle":
          setCircles(prevCircles =>
            prevCircles.map(circle =>
              circle.id === selectedShape.id
                ? { ...circle, radius: newHeight / 2 }
                : circle
            )
          );
          break;
        case "arrow":
          setArrows(prevArrows =>
            prevArrows.map(arrow => {
              if (arrow.id === selectedShape.id) {
                const [x1, y1, x2] = arrow.points;
                return {
                  ...arrow,
                  points: [x1, y1, x2, y1 + newHeight],
                };
              }
              return arrow;
            })
          );
          break;
        case "textBox":
          setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
              textBox.id === selectedShape.id
                ? { ...textBox, height: newHeight }
                : textBox
            )
          );
          break;
      }
    }
  };

  const handleShapeUpdate = (): void => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    if (!stage) return;  // Add this line
    const position = stage.getPointerPosition();
    if (!position) return;
    const { x, y } = position;

    switch (action) {
      case ACTIONS.SQUARE:
        setSquares(squares =>
          squares.map(square => {
            if (square.id === currentShapeId.current) {
              return {
                ...square,
                width: x - square.x,
                height: y - square.y,
              };
            }
            return square;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles(circles =>
          circles.map(circle => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: Math.sqrt((y - circle.y) ** 2 + (x - circle.x) ** 2),
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows(arrows =>
          arrows.map(arrow => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
    }
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>): void => {
    if (e.target === e.target.getStage()) {
      setSelectedShape(null);
      setSelectedShapeType(null);
      setDimensions({ width: 0, height: 0 });
      transformerRef.current?.nodes([]);
      e.target.getStage()?.batchDraw();
    }
  };

  const onAddShape = (shapeType: string): void => {
    const stage = stageRef.current;
    if (!stage) return;  
    const { x, y } = stage.getPointerPosition() || { x: 50, y: 20 };
    const id = uuidv4();

    switch (shapeType) {
      case "square":
        setSquares(prevSquares => [
          ...prevSquares,
          { 
            id, 
            x, 
            y, 
            height: 80, 
            width: 80, 
            color: color 
          },
        ]);
        break;
      case "circle":
        setCircles(prevCircles => [
          ...prevCircles,
          { 
            id, 
            x, 
            y, 
            radius: 50, 
            color: color,
            width: 100,    // Add width for Circle
            height: 100    // Add height for Circle
          },
        ]);
        break;
      case "arrow":
        setArrows(prevArrows => [
          ...prevArrows,
          { 
            id, 
            x, 
            y, 
            points: [x, y, x + 40, y + 80], 
            color: color,
            width: 40,     // Add width for Arrow
            height: 80     // Add height for Arrow
          },
        ]);
        break;
      case "textBox":
        setTextBoxes(prevText => [
          ...prevText,
          {
            id,
            x,
            y,
            text: "Double click to edit",
            fontSize: 24,
            color: color,
            fontFamily: selectedFont,
            width: 200,    // Add width for TextBox
            height: 30     // Add height for TextBox
          },
        ]);
        break;
      default:
        console.warn(`Unknown shape type: ${shapeType}`);
        break;
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string, shapeType: string): void => {
    const newPosition = { x: e.target.x(), y: e.target.y() };

    if (!selectedShape) return;

    if (isStallShape(selectedShape)) {
      setStallShapes(prevStalls =>
        prevStalls.map(stall =>
          stall.id === selectedShape.id
            ? { ...stall, ...newPosition }
            : stall
        )
      );
    } else if (isShape(selectedShape)) {
      switch (shapeType) {
        case "square":
          setSquares(prevSquares =>
            prevSquares.map(square =>
              square.id === id
                ? { ...square, ...newPosition }
                : square
            )
          );
          break;
        case "circle":
          setCircles(prevCircles =>
            prevCircles.map(circle =>
              circle.id === id
                ? { ...circle, ...newPosition }
                : circle
            )
          );
          break;
        case "arrow":
          setArrows(prevArrows =>
            prevArrows.map(arrow =>
              arrow.id === id
                ? { ...arrow, ...newPosition }
                : arrow
            )
          );
          break;
        case "textBox":
          setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
              textBox.id === id
                ? { ...textBox, ...newPosition }
                : textBox
            )
          );
          break;
      }
    }
  };

  // Update handleDragMove to use the merged system

  const getTextWidth = (text: string, fontSize: number = 24): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;
    context.font = `${fontSize}px Arial`;
    return context.measureText(text).width;
  };

  const handleTextEdit = (textNode: TextNode): void => {
    setSelectedTextNode(textNode);
    setEditingText(true);

    const stage = stageRef.current;
    if (!stage) return;
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textNode.absolutePosition.x,
      y: stageBox.top + textNode.absolutePosition.y,
    };

    const width = Math.max(
      100,
      getTextWidth(textNode.text, textNode.fontSize) + 20
    );
    const height = Math.max(
      textNode.fontSize + 10,
      textNode.text.split("\n").length * textNode.fontSize + 10
    );

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text;
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${width}px`;
    textarea.style.height = `${height}px`;
    textarea.style.fontSize = `${textNode.fontSize}px`;
    textarea.style.fontFamily = textNode.fontFamily || selectedFont;
    textarea.style.padding = "5px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = `${textNode.fontSize}px`;
    textarea.style.zIndex = "1000";
    textarea.style.minHeight = "50px";
    textarea.style.color = color;
    textarea.style.wordWrap = "break-word";
    textarea.style.whiteSpace = "pre-wrap";
    textAreaRef.current = textarea;
    textEditingRef.current = textarea;
    textarea.focus();

    function removeTextarea(): void {
      setEditingText(false);
      document.body.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textAreaRef.current = null;
      textEditingRef.current = null;
      setSelectedTextNode(null);
    }

    function handleOutsideClick(e: MouseEvent): void {
      if (e.target !== textarea) {
        updateText();
        removeTextarea();
      }
    }

    function updateText(): void {
      const newText = textarea.value;
      const newWidth = Math.max(
        100,
        getTextWidth(newText, textNode.fontSize) + 20
      );

      setTextBoxes(prevTextBoxes =>
        prevTextBoxes.map(tb =>
          tb.id === textNode.id
            ? {
                ...tb,
                text: newText,
                width: newWidth,
              }
            : tb
        )
      );
    }

    textarea.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        updateText();
        removeTextarea();
        e.preventDefault();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }

      const target = e.target as HTMLTextAreaElement;
      const currentHeight = target.scrollHeight;
      if (currentHeight > parseInt(textarea.style.height)) {
        textarea.style.height = `${currentHeight}px`;
      }
    });

    textarea.addEventListener("input", () => {
      const newWidth = Math.max(
        100,
        getTextWidth(textarea.value, textNode.fontSize) + 20
      );
      textarea.style.width = `${newWidth}px`;
    });

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  const handleTextFormatting = (format: keyof TextFormatting): void => {
    if (!selectedShape || selectedShapeType !== "textBox") return;

    const newFormatting = {
      ...textFormatting,
      [format]: !textFormatting[format],
    };
    setTextFormatting(newFormatting);

    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(tb => {
        if (tb.id === selectedShape.id) {
          const fontStyle = [];
          if (newFormatting.bold) fontStyle.push("bold");
          if (newFormatting.italic) fontStyle.push("italic");

          return {
            ...tb,
            fontStyle: fontStyle.join(" ") || "normal",
            textDecoration: newFormatting.underline ? "underline" : "",
          };
        }
        return tb;
      })
    );
  };

  const handleFontChange = (value: string): void => {
    setSelectedFont(value);

    if (selectedShape && selectedShapeType === "textBox") {
      setTextBoxes(prevTextBoxes =>
        prevTextBoxes.map(tb =>
          tb.id === selectedShape.id
            ? {
                ...tb,
                fontFamily: value,
              }
            : tb
        )
      );
    }
  };

  const exportToJSON = (): FloorplanData => {
    const floorplanData: FloorplanData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      canvas: {
        width: stageRef.current?.width() || 0,
        height: stageRef.current?.height() || 0,
      },
      elements: {
        squares,
        circles,
        arrows,
        textBoxes,
        stallShapes,
      },
    };

    return floorplanData;
  };

  const handleExport = (exportType: 'png' | 'json' | 'both'): void => {
    switch (exportType) {
      case "png": {
        const uri = stageRef.current?.toDataURL();
        const link = document.createElement("a");
        link.download = "Floorplan.png";
        link.href = uri || "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }
      case "json": {
        const data = exportToJSON();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "Floorplan.json";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      }
      case "both": {
        handleExport("png");
        handleExport("json");
        break;
      }
    }
  };

  const onAddStallShape = (stallType: StallShape['stallType']): void => {
    const stage = stageRef.current;
    if (!stage) return;
    
    const { x, y } = stage.getPointerPosition() || { x: 50, y: 20 };
    const id = uuidv4();
    
    setStallCount(prev => prev + 1);
    
    const newStall: StallShape = {
      id,
      x,
      y,
      stallType,
      width: 80,
      height: 60,
      stallNumber: stallCount + 1
    };

    setStallShapes(prev => [...prev, newStall]);
  };

  // Load images for Konva stage
  const [singleImage] = useImage(stallImages['single'].src);
  const [lShapedImage] = useImage(stallImages['l-shaped'].src);
  const [doubleImage] = useImage(stallImages['double'].src);
  const [verticalDoubleImage] = useImage(stallImages['vertical-double'].src);

  // Create image map for Konva stage
  const imageMap = {
    'single': singleImage,
    'l-shaped': lShapedImage,
    'double': doubleImage,
    'vertical-double': verticalDoubleImage
  };

  useEffect(() => {
    return () => {
      if (textEditingRef.current) {
        document.body.removeChild(textEditingRef.current);
      }
    };
  }, []);

  return (
    <div className="h-[calc(100vh-1rem)] grid grid-cols-1 md:grid-cols-[250px_1fr_250px] gap-1 p-1 overflow-hidden">
      {/* Left Sidebar */}
      <div className="order-2 md:order-1 overflow-y-auto">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Tools</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="basic-shapes">
                <AccordionTrigger>Basic Shapes</AccordionTrigger>
                <AccordionContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAddShape("square")}
                  >
                    <Icons.SquareIcon size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAddShape("circle")}
                  >
                    <Icons.Circle size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAddShape("arrow")}
                  >
                    <Icons.ArrowUp size={18} />
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Text</AccordionTrigger>
                <AccordionContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAddShape("textBox")}
                  >
                    <Icons.Type size={18} />
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="stall-shapes">
                <AccordionTrigger>Stall Shapes</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-4 p-2">
                  <Button
                    className="flex flex-col items-center p-4 h-auto aspect-square hover:bg-accent transition-colors"
                    variant="outline"
                    onClick={() => onAddStallShape("single")}
                  >
                    <NextImage src={Single} alt="Single Stall" width={50} height={50} />
                    <span className="mt-2 text-sm">Single Stall</span>
                  </Button>
                  <Button
                    className="flex flex-col items-center p-4 h-auto aspect-square hover:bg-accent transition-colors"
                    variant="outline"
                    onClick={() => onAddStallShape("l-shaped")}
                  >
                    <NextImage src={LShaped} alt="L-Shaped Stall" width={50} height={50} />
                    <span className="mt-2 text-sm">L-Shaped</span>
                  </Button>
                  <Button
                    className="flex flex-col items-center p-4 h-auto aspect-square hover:bg-accent transition-colors"
                    variant="outline"
                    onClick={() => onAddStallShape("double")}
                  >
                    <NextImage src={HorizontalDouble} alt="Double Stall" width={50} height={50} />
                    <span className="mt-2 text-sm">Double Stall</span>
                  </Button>
                  <Button
                    className="flex flex-col items-center p-4 h-auto aspect-square hover:bg-accent transition-colors"
                    variant="outline"
                    onClick={() => onAddStallShape("vertical-double")}
                  >
                    <NextImage src={VerticalDouble} alt="Vertical Double Stall" width={50} height={10} />
                    <span className="mt-2 text-sm">Vertical Double</span>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Canvas/Stage - Center */}
      <div className="order-1 md:order-2 flex justify-center items-center">
        <Card className="w-full h-full">
          <CardHeader className="py-1">
            <h2 className="text-lg font-semibold text-center">
              Floorplan Canvas
            </h2>
          </CardHeader>
          <CardContent className="border border-dashed border-gray-400 p-1 h-[calc(100%-3rem)] flex items-center justify-center">
            <div className="relative">
              <Stage
                width={Math.min(900, window.innerWidth - 520)}
                height={Math.min(900, window.innerHeight - 80)}
                ref={stageRef}
                onDragMove={handleDragMove}
                onPointerUp={isSketching}
                onClick={handleStageClick}
                onMouseMove={handleShapeUpdate}
              >
                <Layer>
                  {textBoxes.map((textBox) => (
                    <Text
                      key={textBox.id}
                      id={textBox.id}
                      x={textBox.x}
                      y={textBox.y}
                      text={textBox.text}
                      fontSize={textBox.fontSize}
                      fontFamily={textBox.fontFamily}
                      fill={textBox.color}
                      fontStyle={textBox.fontStyle}
                      textDecoration={textBox.textDecoration}
                      draggable={isDraggable && !editingText}
                      visible={!editingText || selectedTextNode?.id !== textBox.id}
                      onClick={handleShapeSelection}
                      onDblClick={(e) => {
                        const textNode = e.target;
                        handleTextEdit({
                          id: textBox.id,
                          text: textBox.text,
                          fontSize: textBox.fontSize,
                          fontFamily: textBox.fontFamily,
                          fontStyle: textBox.fontStyle,
                          textDecoration: textBox.textDecoration,
                          absolutePosition: textNode.absolutePosition(),
                        });
                      }}
                      onDragEnd={(e) => handleDragEnd(e, textBox.id, "textBox")}
                      onDragMove={handleDragMove}
                      width={getTextWidth(textBox.text, textBox.fontSize) + 20}
                      align="left"
                      padding={5}
                    />
                  ))}

                  {squares.map((square) => (
                    <Rect
                      key={square.id}
                      id={square.id}
                      x={square.x}
                      y={square.y}
                      fill={square.color}
                      height={square.height}
                      width={square.width}
                      draggable={isDraggable}
                      onClick={handleShapeSelection}
                      onDragEnd={(e) => handleDragEnd(e, square.id, "square")}
                      onDragMove={handleDragMove}
                    />
                  ))}

                  {circles.map((circle) => (
                    <Circle
                      key={circle.id}
                      id={circle.id}
                      radius={circle.radius}
                      x={circle.x}
                      y={circle.y}
                      fill={circle.color}
                      draggable={isDraggable}
                      onClick={handleShapeSelection}
                      onDragEnd={(e) => handleDragEnd(e, circle.id, "circle")}
                      onDragMove={handleDragMove}
                    />
                  ))}

                  {arrows.map((arrow) => (
                    <Arrow
                      key={arrow.id}
                      id={arrow.id}
                      points={arrow.points}
                      stroke={strokeColor}
                      strokeWidth={2}
                      fill={arrow.color}
                      draggable={isDraggable}
                      onClick={handleShapeSelection}
                      onDragEnd={(e) => handleDragEnd(e, arrow.id, "arrow")}
                      onDragMove={handleDragMove}
                    />
                  ))}
                  {stallShapes.map((stall) => (
                    <Group
                      key={stall.id}
                      id={stall.id}
                      x={stall.x}
                      y={stall.y}
                      draggable={isDraggable}
                      onClick={handleShapeSelection}
                      onDragEnd={(e) => handleDragEnd(e, stall.id, "stall")}
                      onDragMove={handleDragMove}
                    >
                      {imageMap[stall.stallType] && (
                        <KonvaImage
                          image={imageMap[stall.stallType]}
                          width={80}
                          height={60}
                        />
                      )}
                      <Text
                        text={`Stall ${stall.stallNumber}`}
                        fontSize={12}
                        fill="#000"
                        align="center"
                        width={80}
                        y={30}
                      />
                    </Group>
                  ))}

                  <Transformer
                    ref={transformerRef}
                    anchorCornerRadius={5}
                    anchorStroke="black"
                    borderStroke="black"
                    anchorStyleFunc={(anchor) => {
                      if (
                        anchor.hasName("top-center") ||
                        anchor.hasName("bottom-center")
                      ) {
                        anchor.height(6);
                        anchor.offsetY(3);
                        anchor.width(30);
                        anchor.offsetX(15);
                        anchor.setAttr('cursor', 'ns-resize');
                      }
                      if (
                        anchor.hasName("middle-left") ||
                        anchor.hasName("middle-right")
                      ) {
                        anchor.height(30);
                        anchor.offsetY(15);
                        anchor.width(6);
                        anchor.offsetX(3);
                        anchor.setAttr('cursor', 'ew-resize');
                      }
                    }}
                  />
                </Layer>
              </Stage>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="order-3 md:order-3 overflow-y-auto">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Properties</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="text-properties">
                <AccordionTrigger>Basic Properties</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div>
                    <Label className="block mb-1">Color</Label>
                    <Input
                      type="color"
                      value={color}
                      onChange={handleColorChange}
                    />
                  </div>
                  <div>
                    <Label className="block mb-1">Width</Label>
                    <Input
                      type="number"
                      value={dimensions.width}
                      onChange={handleWidthChange}
                      disabled={!selectedShape}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block mb-1">Height</Label>
                    <Input
                      type="number"
                      value={dimensions.height}
                      onChange={handleHeightChange}
                      disabled={!selectedShape}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="text-properties">
                <AccordionTrigger>Text Properties</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <ToggleGroup
                      className="grid grid-cols-3 gap-2"
                      type="multiple"
                      value={Object.entries(textFormatting)
                        .filter(([, value]) => value)
                        .map(([key]) => key)}
                    >
                      <ToggleGroupItem
                        value="bold"
                        aria-label="Toggle bold"
                        disabled={!selectedShape || selectedShapeType !== "textBox"}
                        onClick={() => handleTextFormatting("bold")}
                      >
                        <Bold className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="italic"
                        aria-label="Toggle italic"
                        disabled={!selectedShape || selectedShapeType !== "textBox"}
                        onClick={() => handleTextFormatting("italic")}
                      >
                        <Italic className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="underline"
                        aria-label="Toggle underline"
                        disabled={!selectedShape || selectedShapeType !== "textBox"}
                        onClick={() => handleTextFormatting("underline")}
                      >
                        <Underline className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <div className="flex flex-col space-y-1">
                      <Label>Font</Label>
                      <Select
                        value={selectedFont}
                        onValueChange={handleFontChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="export-options">
                <AccordionTrigger>Export Options</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handleExport("png")}
                  >
                    <Icons.Image className="mr-2 h-4 w-4" />
                    Export as PNG
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleExport("json")}
                    variant="outline"
                  >
                    <Icons.FileJson className="mr-2 h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleExport("both")}
                    variant="secondary"
                  >
                    <Icons.Files className="mr-2 h-4 w-4" />
                    Export Both
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FP;