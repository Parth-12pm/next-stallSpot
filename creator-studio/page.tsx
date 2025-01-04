// app/creator-studio/page.tsx
'use client';

import { Header } from './components/header';
import { Toolbar } from './components/toolbar';
import { GridBackground } from './components/grid-background';
import { ShapesSidebar } from './components/shapes-sidebar';
import { PropertiesPanel } from './components/properties-panel';

export default function CreatorStudio() {
  return (
    <div className='h-screen'> {/* Added wrapper div */}
      <div className="relative flex flex-col h-full bg-background">
        <Header />
        <div className="h-12 bg-background border-b flex justify-center">
          <Toolbar />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <ShapesSidebar />

          {/* Main Canvas Area */}
          <main className="flex-1 relative bg-[#0f1419]">
            <GridBackground />
          </main>

          {/* Right Panel */}
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}