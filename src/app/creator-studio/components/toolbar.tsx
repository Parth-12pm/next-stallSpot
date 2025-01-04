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
  AlignStartVertical,
  Clipboard,
  Unlock
} from 'lucide-react';
import { useShapesStore } from '../store/shapes';
import { useCanvasStore } from '../store/canvas';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onLock?: () => void;
  onSave?: () => void;
}

export function Toolbar({
  onUndo,
  onRedo,
  onDelete,
  onCopy,
  onPaste,
  onLock,
  onSave,
}: ToolbarProps) {
  const { 
    toggleGrid, 
    gridEnabled,
    setScale,
    scale,
    setPosition,
  } = useCanvasStore();

  const {
    selectedIds,
    shapes,
  } = useShapesStore();

  const hasSelection = selectedIds.length > 0;
  const isLocked = hasSelection && shapes.some(
    shape => selectedIds.includes(shape.id) && shape.isLocked
  );

  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.1));
  };

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <TooltipProvider>
      <div className="h-12 border-b bg-background flex justify-center">
        <div className="px-4 flex items-center gap-2 border-x">
          {/* History Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onUndo}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRedo}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Tools */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Hand className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pan Tool (Space)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Measure Tool (M)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* View Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleGrid()}
                data-state={gridEnabled ? 'on' : 'off'}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid (G)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In (Ctrl++)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out (Ctrl+-)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleResetView}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View (0)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Shape Operations */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onLock}
                disabled={!hasSelection}
              >
                {isLocked ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isLocked ? 'Unlock (Ctrl+L)' : 'Lock (Ctrl+L)'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCopy}
                disabled={!hasSelection}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy (Ctrl+C)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onPaste}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paste (Ctrl+V)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete}
                disabled={!hasSelection}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete (Del)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Alignment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={selectedIds.length < 2}
              >
                <AlignStartHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Horizontally</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={selectedIds.length < 2}
              >
                <AlignStartVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Vertically</TooltipContent>
          </Tooltip>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onSave}>
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
    </TooltipProvider>
  );
}