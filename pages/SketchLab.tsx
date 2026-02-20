import React, { useState } from 'react';
import { generateSketch } from '../services/geminiService';
import { GeneratorState } from '../types';
import { RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SketchLab: React.FC = () => {
  const [animal1, setAnimal1] = useState('');
  const [animal2, setAnimal2] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GeneratorState>(GeneratorState.IDLE);
  const { settings } = useTheme();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animal1 || !animal2) return;

    setStatus(GeneratorState.GENERATING);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateSketch(animal1, animal2);
      setGeneratedImage(imageUrl);
      setStatus(GeneratorState.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(GeneratorState.ERROR);
    }
  };

  return (
    <div className={`min-h-screen pt-24 px-4 flex flex-col md:flex-row gap-8 ${settings.invertColors ? 'bg-black text-white' : 'bg-[#e5e5e5] text-black'}`}>
      
      {/* Controls Section */}
      <div className="w-full md:w-1/3 flex flex-col justify-center p-6 border border-current h-fit sticky top-24 interactive-section transition-all duration-300">
        <h2 className="text-2xl font-bold uppercase mb-2 tracking-tighter hover:text-[#ff0000] transition-colors cursor-default">Subject Identification</h2>
        <p className="text-xs uppercase tracking-widest mb-8 text-gray-500">Forensic Composite Generator</p>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs uppercase font-bold block group-hover:text-[#ff0000] transition-colors">Subject A (Species)</label>
            <input 
              type="text" 
              value={animal1}
              onChange={(e) => setAnimal1(e.target.value)}
              placeholder="e.g. Wolf"
              className="w-full bg-transparent border-b border-current py-2 px-1 focus:outline-none focus:border-[#ff0000] uppercase font-mono text-sm placeholder-gray-400"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-xs uppercase font-bold block group-hover:text-[#ff0000] transition-colors">Subject B (Species)</label>
            <input 
              type="text" 
              value={animal2}
              onChange={(e) => setAnimal2(e.target.value)}
              placeholder="e.g. Octopus"
              className="w-full bg-transparent border-b border-current py-2 px-1 focus:outline-none focus:border-[#ff0000] uppercase font-mono text-sm placeholder-gray-400"
            />
          </div>

          <button 
            type="submit" 
            disabled={status === GeneratorState.GENERATING || !animal1 || !animal2}
            className={`w-full py-4 mt-8 border border-current text-sm uppercase tracking-[0.2em] hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {status === GeneratorState.GENERATING ? (
              <RefreshCw className="animate-spin w-4 h-4" />
            ) : (
              'Initiate Sequence'
            )}
          </button>
        </form>

        {status === GeneratorState.ERROR && (
          <div className="mt-4 p-3 bg-red-50 border border-[#ff0000] text-[#ff0000] text-xs uppercase flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4" /> Generation Failed. Retry.
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="w-full md:w-2/3 min-h-[50vh] md:h-[80vh] border border-current relative flex items-center justify-center bg-white overflow-hidden group interactive-section transition-all duration-300">
        
        {status === GeneratorState.IDLE && (
          <div className="text-center opacity-30 select-none group-hover:opacity-80 group-hover:text-[#ff0000] transition-all">
            <p className="text-6xl font-bold">WAITING</p>
            <p className="text-xs uppercase tracking-[1em]">For Input</p>
          </div>
        )}

        {status === GeneratorState.GENERATING && (
          <div className="text-center animate-pulse">
            <p className="text-xl font-bold font-mono text-[#ff0000]">PROCESSING BIOMETRICS...</p>
            <div className="w-64 h-1 bg-gray-100 mt-4 overflow-hidden">
               <div className="w-full h-full bg-[#ff0000] animate-progress origin-left transform scale-x-0" />
            </div>
          </div>
        )}

        {status === GeneratorState.COMPLETE && generatedImage && (
          <>
            <img 
              src={generatedImage} 
              alt="Generated Chimera" 
              className="w-full h-full object-contain filter contrast-125 grayscale"
            />
            {/* Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
            
            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black text-white px-2 py-1 text-xs font-mono uppercase group-hover:bg-[#ff0000] transition-colors">
              Exhibit A: {animal1} x {animal2}
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={generatedImage} 
                download={`BrockAtticus_Sketch_${animal1}_${animal2}.png`}
                className="bg-white text-black border border-black p-3 hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] transition-colors block"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
