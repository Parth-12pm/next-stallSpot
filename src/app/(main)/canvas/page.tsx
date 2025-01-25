'use client'
import dynamic from 'next/dynamic';

const FloorplanCanvas = dynamic(() => import('@/components/canvas/Editor'), {
  ssr: false
});

export default function PlaygroundPage() {
  return <FloorplanCanvas />;
}