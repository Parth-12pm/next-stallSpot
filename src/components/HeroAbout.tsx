import { type ReactNode } from 'react';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  children?: ReactNode;
}

export function Hero({ 
  title, 
  subtitle, 
  backgroundImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
  children 
}: HeroProps) {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}