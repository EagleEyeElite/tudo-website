import { HTMLRenderer } from '@/components/render/renderWordpress';
import React from 'react';

export default function PostTitle({ children }) {
  return (
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none my-12 text-center md:text-left prose prose-l">
      <HTMLRenderer content={children} />
    </h1>
  )
}
