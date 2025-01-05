// app/creator-studio/page.tsx
'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type Konva from 'konva';
import { Header } from './components/header';
import { Toolbar } from './components/toolbar';
import { ShapesSidebar } from './components/shapes-sidebar';
import { PropertiesPanel } from './components/properties-panel';

// Dynamically import the Canvas component
const Canvas = dynamic(() => import('./components/canvas/Canvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background/50">
      <div role="status">
        <span className="text-muted-foreground">Loading canvas...</span>
      </div>
    </div>
  ),
});

export default function CreatorStudio() {
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="h-screen">
      <div className="relative flex flex-col h-full bg-background">
        <Header />
        <div className="h-12 bg-background border-b flex justify-center">
          <Toolbar />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <ShapesSidebar />

          {/* Main Canvas Area */}
          <main className="flex-1 relative bg-[#0f1419] overflow-hidden">
            <div className="absolute inset-0">
              <Canvas stageRef={stageRef} />
            </div>
          </main>

          {/* Right Panel */}
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}