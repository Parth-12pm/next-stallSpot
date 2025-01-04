// app/creator-studio/components/shapes-sidebar.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronLeft, 
  ChevronRight,
  Square, 
  Circle, 
  ArrowRight, 
  Box, 
  Triangle,
  Hexagon,
  LineChart,
  LayoutGrid,
  Table2
} from 'lucide-react';

const BASIC_SHAPES = [
  { icon: Square, label: 'Rectangle', ariaLabel: 'Add rectangle shape' },
  { icon: Circle, label: 'Circle', ariaLabel: 'Add circle shape' },
  { icon: Triangle, label: 'Triangle', ariaLabel: 'Add triangle shape' },
  { icon: Hexagon, label: 'Polygon', ariaLabel: 'Add polygon shape' },
  { icon: ArrowRight, label: 'Arrow', ariaLabel: 'Add arrow shape' },
  { icon: LineChart, label: 'Line', ariaLabel: 'Add line shape' },
];

const BOOTH_SHAPES = [
  { icon: Box, label: 'Standard (10x10)', size: '10x10 ft', ariaLabel: 'Add standard booth', type: 'standard' },
  { icon: Box, label: 'Large (10x20)', size: '10x20 ft', ariaLabel: 'Add large booth', type: 'large' },
  { icon: Box, label: 'Island (20x20)', size: '20x20 ft', ariaLabel: 'Add island booth', type: 'island' },
  { icon: Box, label: 'Peninsula (20x10)', size: '20x10 ft', ariaLabel: 'Add peninsula booth', type: 'peninsula' },
  { icon: Box, label: 'Kiosk (6x6)', size: '6x6 ft', ariaLabel: 'Add kiosk booth', type: 'kiosk' },
];

const FURNITURE = [
  { icon: Table2, label: 'Table', ariaLabel: 'Add table' },
  { icon: LayoutGrid, label: 'Counter', ariaLabel: 'Add counter' },
  { icon: Box, label: 'Chair', ariaLabel: 'Add chair' },
  { icon: Box, label: 'Desk', ariaLabel: 'Add desk' },
  { icon: Box, label: 'Storage', ariaLabel: 'Add storage' },
];


export function ShapesSidebar() {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-screen">
      <div className="h-screen bg-background flex">
        <CollapsibleContent className="h-full">
          <div className="h-screen flex flex-col w-80">
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
                      <Button
                        key={shape.label}
                        variant="outline"
                        className="h-24 flex flex-col gap-2"
                        aria-label={shape.ariaLabel}
                        draggable
                      >
                        <shape.icon className="h-8 w-8" />
                        <span className="text-xs">{shape.label}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="booths" className="p-4 m-0">
                  <div className="grid grid-cols-1 gap-2">
                    {BOOTH_SHAPES.map((booth) => (
                      <Button
                        key={booth.label}
                        variant="outline"
                        className="h-24 flex flex-col gap-1 w-full"
                        aria-label={booth.ariaLabel}
                        draggable
                      >
                        <booth.icon className="h-8 w-8" />
                        <span className="text-xs font-medium">{booth.label}</span>
                        <span className="text-xs text-muted-foreground">{booth.size}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="furniture" className="p-4 m-0">
                  <div className="grid grid-cols-2 gap-2">
                    {FURNITURE.map((item) => (
                      <Button
                        key={item.label}
                        variant="outline"
                        className="h-24 flex flex-col gap-2"
                        aria-label={item.ariaLabel}
                        draggable
                      >
                        <item.icon className="h-8 w-8" />
                        <span className="text-xs">{item.label}</span>
                      </Button>
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