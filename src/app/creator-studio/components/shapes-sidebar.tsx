// app/creator-studio/components/shapes-sidebar.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  BASIC_SHAPES, 
  BOOTH_SHAPES, 
  FURNITURE,
  type ShapeDefinition,
  type BoothDefinition,
  type ShapeType,
  type DraggedShape 
} from '../constants/shapes';

interface DraggableButtonProps {
  icon: React.ElementType;
  label: string;
  ariaLabel: string;
  size?: string;
  onDragStart: (e: React.DragEvent<HTMLButtonElement>) => void;
}

const DraggableButton = ({ icon: Icon, label, ariaLabel, size, onDragStart }: DraggableButtonProps) => (
  <Button
    variant="outline"
    className="h-24 flex flex-col gap-1 w-full"
    aria-label={ariaLabel}
    draggable
    onDragStart={onDragStart}
  >
    <Icon className="h-8 w-8" />
    <span className="text-xs font-medium">{label}</span>
    {size && <span className="text-xs text-muted-foreground">{size}</span>}
  </Button>
);

export function ShapesSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>, 
    type: ShapeType, 
    shapeData: ShapeDefinition | BoothDefinition
  ) => {
    const draggedShape: DraggedShape = {
      type,
      shapeData
    };
    e.dataTransfer.setData('application/json', JSON.stringify(draggedShape));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-screen">
      <div className="h-full bg-background flex">
        <CollapsibleContent className="h-full">
          <div className="h-full flex flex-col w-80">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Add Elements</h2>
            </div>
            <Tabs defaultValue="shapes" className="flex-1">
              <TabsList className="w-full justify-start px-2">
                <TabsTrigger value="shapes">Shapes</TabsTrigger>
                <TabsTrigger value="booths">Booths</TabsTrigger>
                <TabsTrigger value="furniture">Furniture</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-1">
                <TabsContent value="shapes" className="p-4 m-0">
                  <div className="grid grid-cols-2 gap-2">
                    {BASIC_SHAPES.map((shape) => (
                      <DraggableButton
                        key={shape.label}
                        {...shape}
                        onDragStart={(e) => handleDragStart(e, 'shape', shape)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="booths" className="p-4 m-0">
                  <div className="grid grid-cols-1 gap-2">
                    {BOOTH_SHAPES.map((booth) => (
                      <DraggableButton
                        key={booth.label}
                        {...booth}
                        onDragStart={(e) => handleDragStart(e, 'booth', booth)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="furniture" className="p-4 m-0">
                  <div className="grid grid-cols-2 gap-2">
                    {FURNITURE.map((item) => (
                      <DraggableButton
                        key={item.label}
                        {...item}
                        onDragStart={(e) => handleDragStart(e, 'furniture', item)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </CollapsibleContent>
        
        <div className="border-l h-full">
          <CollapsibleTrigger asChild>
            <div className="border-b h-14 flex items-center">
              <Button variant="ghost" size="icon" className="h-14 w-8">
                {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
        </div>
      </div>
    </Collapsible>
  );
}