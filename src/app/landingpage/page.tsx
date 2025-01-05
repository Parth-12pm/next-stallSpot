import React from 'react';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ExhibitionList } from './components/ExhibitionList';
import Features from './components/Features';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-16">
        <Hero />
        <Categories />
        <ExhibitionList />
        <Features />
      </div>
    </div>
  );
}

export default App;