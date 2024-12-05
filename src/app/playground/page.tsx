'use client'
import dynamic from 'next/dynamic';

const FloorplanCanvas = dynamic(() => import('@/components/floorplanEditor/Canvas'), {
  ssr: false
});

export default function PlaygroundPage() {
  return <FloorplanCanvas />;
}