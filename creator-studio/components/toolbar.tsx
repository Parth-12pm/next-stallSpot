// app/creator-studio/components/toolbar.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Undo2, 
  Redo2, 
  Save, 
  Eye, 
  Grid, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Hand,
  Ruler,
  Lock,
  Copy,
  Trash2,
  AlignStartHorizontal,
  AlignStartVertical
} from 'lucide-react';

export function Toolbar() {
  return (
    <div className="h-12 border-b bg-background flex justify-center">
       <div className="px-4 flex items-center gap-2 border-x">
      <Button variant="ghost" size="icon" aria-label="Undo">
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Redo">
        <Redo2 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="icon" aria-label="Pan tool">
        <Hand className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Measure tool">
        <Ruler className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="icon" aria-label="Toggle grid">
        <Grid className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Fit to screen">
        <Maximize2 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="icon" aria-label="Lock selected">
        <Lock className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Duplicate selected">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Delete selected">
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="icon" aria-label="Align horizontally">
        <AlignStartHorizontal className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Align vertically">
        <AlignStartVertical className="h-4 w-4" />
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>
      </div>
    </div>
  );
}