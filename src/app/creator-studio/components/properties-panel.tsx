// app/creator-studio/components/properties-panel.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ShapeConfig, useShapesStore } from "../store/shapes";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Layers, 
  Lock, 
  Palette,
} from 'lucide-react';

export function PropertiesPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const { shapes, selectedIds, updateShape } = useShapesStore();

  const selectedShape = shapes.find(shape => selectedIds[0] === shape.id);

  const handleUpdateShape = (updates: Partial<ShapeConfig>) => {
    if (selectedShape) {
      updateShape(selectedShape.id, updates);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-screen">
      <div className="h-full bg-background flex">
        <div className="border-r h-full">
          <CollapsibleTrigger asChild>
            <div className="border-b h-14 flex items-center">
              <Button variant="ghost" size="icon" className="h-14 w-8">
                {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="h-full">
          <div className="h-full flex flex-col w-80">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Properties</h2>
            </div>
            <Tabs defaultValue="properties" className="flex-1">
              <TabsList className="w-full justify-start px-2">
                <TabsTrigger value="properties">
                  <Settings className="h-4 w-4 mr-2" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="layers">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  <TabsContent value="properties" className="p-4 m-0">
                    {selectedShape ? (
                      <Accordion type="multiple" defaultValue={["transform", "style", "booth"]}>
                        {/* Transform Section */}
                        <AccordionItem value="transform">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center justify-between w-full pr-4">
                              <Label className="text-sm font-medium">Transform</Label>
                              <div 
                                role="button" 
                                aria-label="Lock position" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateShape({ isLocked: !selectedShape.isLocked });
                                }} 
                                className="hover:bg-accent hover:text-accent-foreground p-2 rounded-md"
                              >
                                <Lock className="h-4 w-4" />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">X Position</Label>
                                <Input 
                                  type="number" 
                                  className="h-8" 
                                  value={selectedShape.x}
                                  onChange={(e) => handleUpdateShape({ x: Number(e.target.value) })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Y Position</Label>
                                <Input 
                                  type="number" 
                                  className="h-8"
                                  value={selectedShape.y}
                                  onChange={(e) => handleUpdateShape({ y: Number(e.target.value) })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Width</Label>
                                <Input 
                                  type="number" 
                                  className="h-8"
                                  value={selectedShape.width}
                                  onChange={(e) => handleUpdateShape({ width: Number(e.target.value) })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Height</Label>
                                <Input 
                                  type="number" 
                                  className="h-8"
                                  value={selectedShape.height}
                                  onChange={(e) => handleUpdateShape({ height: Number(e.target.value) })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Rotation</Label>
                                <Input 
                                  type="number" 
                                  className="h-8"
                                  value={selectedShape.rotation}
                                  onChange={(e) => handleUpdateShape({ rotation: Number(e.target.value) })}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Style Section */}
                        <AccordionItem value="style">
                          <AccordionTrigger className="py-2">
                            <Label className="text-sm font-medium">Style</Label>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs">Fill Color</Label>
                                  <div 
                                    role="button" 
                                    aria-label="Choose fill color" 
                                    onClick={() => {
                                      // Add color picker logic
                                    }}
                                    className="hover:bg-accent hover:text-accent-foreground p-2 rounded-md"
                                  >
                                    <Palette className="h-4 w-4" />
                                  </div>
                                </div>
                                <Input 
                                  type="text" 
                                  className="h-8" 
                                  placeholder="#000000" 
                                  value={selectedShape.fill}
                                  onChange={(e) => handleUpdateShape({ fill: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Opacity</Label>
                                <Slider
                                  defaultValue={[selectedShape.opacity ? selectedShape.opacity * 100 : 100]}
                                  max={100}
                                  step={1}
                                  className="py-2"
                                  onValueChange={([value]) => handleUpdateShape({ opacity: value / 100 })}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Booth Properties */}
                        {selectedShape.shapeType === 'booth' && (
                          <AccordionItem value="booth">
                            <AccordionTrigger className="py-2">
                              <Label className="text-sm font-medium">Booth Properties</Label>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <Label className="text-xs">Booth Number</Label>
                                  <Input 
                                    type="text" 
                                    className="h-8"
                                    value={selectedShape.boothNumber}
                                    onChange={(e) => handleUpdateShape({ boothNumber: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Price Tier</Label>
                                  <Select 
                                    value={selectedShape.priceTier}
                                    onValueChange={(value) => handleUpdateShape({ 
                                      priceTier: value as 'standard' | 'premium' | 'vip' 
                                    })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a shape to edit its properties
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}