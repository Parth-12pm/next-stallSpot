import React from 'react';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ExhibitionList } from './components/ExhibitionList';
import Features from './components/Features';
import { Footer } from './components/Footer';
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <div className="min-h-screen">
      <div className="pt-16">
        <ThemeProvider>
        <Hero />
        <Categories />
        <ExhibitionList />
        <Features />
        <Footer />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;