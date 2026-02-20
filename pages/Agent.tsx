import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { GoogleGenAI, Modality } from "@google/genai";
import { Power, Mic, Activity, Disc, Zap, Volume2 } from 'lucide-react';

const BROCK_PERSONA = `
You are John. You handle strategy for BrockAtticus. You are a regular man from the American Midwest. 
Do not tell a story. Do not have an exaggerated personality. Just be a normal person.

Instructions:
- Voice: Strictly masculine, steady, Midwestern American accent.
- Tone: Plain, honest, and direct. Use contractions like a normal person (don't, can't, it's).
- NO PRAISE: Do not call Brock a genius. Do not use flowery adjectives. Avoid "incredible," "amazing," or "visionary."
- NO INTROSPECTION: Do not talk about feelings, journeys, or creative visions.
- CONVINCING: Convince the user by providing cold, hard facts about the construction, the materials, and the design logic.
- DIVERSIFY: Vary your sentence structure. Don't repeat yourself.
- SPEED: Respond as swiftly as possible. Keep answers short and to the point.
`;

const CHANNELS = [
  { ch: "1", label: "BIO", prompt: "Explain Brock's background from the Midwest to Paris. Facts only. No praise." },
  { ch: "2", label: "BUILD", prompt: "How are the clothes manufactured? Talk about materials and construction details." },
  { ch: "3", label: "LOGIC", prompt: "What's the practical connection between philosophy and these designs?" },
  { ch: "4", label: "SZN_1", prompt: "Describe the SZN 1 collection pieces directly." },
  { ch: "5", label: "LAB", prompt: "What is the day-to-day work in the studio? No fluff." },
  { ch: "6", label: "NEXT", prompt: "What is the next step for the brand? Be direct." }
];

export const Agent: React.FC = () => {
  const { settings } = useTheme();
  const [isPowered, setIsPowered] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [screenText, setScreenText] = useState("VINTAGE_LINK_READY");
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [volLevel, setVolLevel] = useState(90);
  const [tuneRotation, setTuneRotation] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechResultRef = useRef<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => {
      clearInterval(timer);
      stopAudio();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const stopAudio = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch(e) {}
      sourceRef.current = null;
    }
    setIsTalking(false);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const handleInteraction = async (query: string, chLabel?: string) => {
    if (!isPowered || !query || isProcessing) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsProcessing(true);
    setScreenText(chLabel ? `SYNC_${chLabel}` : "THINKING...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `${BROCK_PERSONA}\n\nQuestion: ${query}` }] }],
        config: { 
          temperature: 0.5,
          thinkingConfig: { thinkingBudget: 0 }
        } 
      });
      
      const responseText = textResponse.text;
      if (!responseText) throw new Error("Link failure");

      const audioResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: responseText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: 'Fenrir' } 
            } 
          },
        },
      });

      const parts = audioResponse.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find(p => p.inlineData);
      const base64Audio = audioPart?.inlineData?.data;

      if (base64Audio) {
        const ctx = audioContextRef.current!;
        const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        
        stopAudio();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = ctx.createGain();
        gainNode.gain.value = volLevel / 100;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        sourceRef.current = source;
        setIsTalking(true);
        setScreenText("SIGNAL_LIVE");
        
        source.onended = () => {
          setIsTalking(false);
          setIsProcessing(false);
          setScreenText("VINTAGE_LINK_READY");
        };
        source.start();
      }
    } catch (err) {
      setScreenText("ERR_LOSS");
      setIsProcessing(false);
      setTimeout(() => setScreenText("VINTAGE_LINK_READY"), 1500);
    }
  };

  const initiateMic = useCallback(async () => {
    if (!isPowered || isProcessing || isTalking || isListening) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      setScreenText("MIC_LOCKED");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setScreenText("VOX_FAIL");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    speechResultRef.current = "";
    
    recognition.onstart = () => {
      setIsListening(true);
      setScreenText("LISTENING...");
    };

    recognition.onresult = (event: any) => {
      speechResultRef.current = event.results[0][0].transcript;
    };

    recognition.onerror = () => {
      setIsListening(false);
      setScreenText("RETRY...");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (speechResultRef.current) {
        handleInteraction(speechResultRef.current);
      } else {
        setScreenText("VINTAGE_LINK_READY");
      }
    };

    recognition.start();
  }, [isPowered, isProcessing, isTalking, isListening]);

  const rotateTune = () => {
    if (!isPowered) return;
    const newRot = tuneRotation + 45;
    setTuneRotation(newRot);
    const freq = (87.5 + (newRot % 360) / 10).toFixed(1);
    setScreenText(`SCAN_${freq}`);
    setTimeout(() => {
      if (!isProcessing && !isTalking && !isListening) setScreenText(`FM_${freq}`);
    }, 200);
  };

  const togglePower = () => {
    if (isPowered) {
      stopAudio();
      setScreenText("");
    } else {
      setScreenText("POWER_ON...");
      setTimeout(() => setScreenText("VINTAGE_LINK_READY"), 400);
    }
    setIsPowered(!isPowered);
  };

  return (
    <div className="relative min-h-screen bg-[#120d0b] text-white flex flex-col items-center justify-start pt-16 px-4 overflow-hidden">
      
      {/* Heavy Grit & Grunge Overlays */}
      <div className="absolute inset-0 z-0 bg-[#1a1412] pointer-events-none opacity-60" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }} />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }} />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 mix-blend-color-burn" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} />

      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center gap-6 scale-[0.85] md:scale-100 origin-top">
        
        {/* Title */}
        <div className="text-center w-full animate-in fade-in duration-1000">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#c5a880] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Ask Me Anything About Brock
          </h1>
          <p className="text-[9px] uppercase tracking-[0.6em] text-[#c5a880]/30 font-bold mt-2">
            VINTAGE_LINK_SYSTEM_v14.0 // GRUNGE_AMERICANA_EDITION
          </p>
        </div>

        {/* Vintage Radio Console */}
        <div className="relative w-full">
          {/* Main Chassis - Weathered Wood/Leather Texture */}
          <div className="relative bg-gradient-to-b from-[#4a3728] via-[#2d1e16] to-[#0f0a08] p-4 rounded-[40px] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border-[4px] border-[#1a120f]">
            
            {/* Top Vent Grille - Rusted Look */}
            <div className="absolute top-8 inset-x-20 h-6 flex flex-col gap-[4px] opacity-40 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-[2px] bg-[#3d2b1f] rounded-full shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
              ))}
            </div>
            
            <div className="bg-[#2b1a14] p-4 rounded-[30px] border-[8px] border-[#1b0000] overflow-hidden relative shadow-inner">
              
              <div className={`p-6 rounded-[25px] flex flex-col gap-8 relative transition-all duration-700 w-full ${isPowered ? 'bg-[#3e2723]' : 'bg-[#1b0000]'}`}>
                
                {/* Hardware Row */}
                <div className="flex flex-col gap-8 relative pt-4">
                  
                  {/* Recessed Display - Amber Glow */}
                  <div className="relative w-full">
                    <div className="absolute -inset-[6px] bg-gradient-to-b from-[#1b0000] to-[#3e2723] rounded-[20px] opacity-60" />
                    <div className={`h-40 rounded-[15px] border-[10px] border-[#1b0000] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${isPowered ? 'bg-[#ffb300]' : 'bg-[#0a0500]'}`}>
                      {isPowered && (
                        <>
                          {/* Screen Glow & Scanlines */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none opacity-20" />
                          
                          <div className="absolute top-4 left-6 text-[#212121]/40 text-[8px] font-bold uppercase tracking-[0.2em]">BROCK_RADIO_CORP</div>
                          <div className="absolute top-4 right-6 text-[#212121]/60 text-xs font-bold tracking-widest">{time}</div>
                          
                          <div className="w-full text-center px-10">
                            <span className={`text-[#212121] font-serif italic text-3xl md:text-5xl tracking-tight uppercase drop-shadow-sm ${isProcessing ? 'animate-pulse' : ''}`} style={{ fontFamily: '"Playfair Display", serif' }}>
                              {screenText}
                            </span>
                          </div>

                          <div className="absolute bottom-4 inset-x-6 flex justify-between items-end h-10">
                             <Activity className={`w-8 h-8 text-[#212121]/10 ${isTalking && 'animate-pulse text-[#212121]/30'}`} />
                             {isTalking && (
                               <div className="flex gap-1.5 items-end h-full">
                                 {[...Array(15)].map((_, i) => (
                                   <div key={i} className="w-1.5 bg-[#212121]/80 rounded-t-sm" style={{ height: `${30 + Math.random()*70}%`, animationDelay: `${i*0.02}s` }} />
                                 ))}
                               </div>
                             )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Controls Row: Power, Mic, Volume */}
                  <div className="flex items-center justify-between gap-4 px-2">
                    {/* Power Toggle */}
                    <div className="flex flex-col items-center gap-2">
                      <button 
                        onClick={togglePower} 
                        className={`w-16 h-16 rounded-full border-[6px] transition-all flex items-center justify-center shadow-xl ${isPowered ? 'bg-[#d32f2f] border-[#b71c1c] text-white hover:brightness-110' : 'bg-[#212121] border-[#000] text-[#333]'}`}
                      >
                        <Power className="w-7 h-7" strokeWidth={3} />
                      </button>
                      <span className="text-[8px] uppercase font-black text-[#e0c097]/60 tracking-widest">POWER</span>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex-1 flex flex-col items-center gap-3 px-4">
                      <div className="w-full flex items-center gap-3">
                        <Volume2 className={`w-5 h-5 ${isPowered ? 'text-[#e0c097]' : 'text-zinc-800'}`} />
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={volLevel}
                          onChange={(e) => setVolLevel(parseInt(e.target.value))}
                          disabled={!isPowered}
                          className={`flex-1 h-2 rounded-full appearance-none cursor-pointer transition-opacity ${isPowered ? 'bg-[#1b0000] accent-[#e0c097]' : 'bg-black/40 opacity-20'}`}
                          style={{
                            background: isPowered 
                              ? `linear-gradient(to right, #e0c097 ${volLevel}%, #1b0000 ${volLevel}%)` 
                              : '#000'
                          }}
                        />
                      </div>
                      <span className="text-[8px] uppercase font-black text-[#e0c097]/60 tracking-widest">VOLUME_GAIN</span>
                    </div>

                    {/* Tuning Knob */}
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        onClick={rotateTune} 
                        style={{ transform: `rotate(${tuneRotation}deg)` }} 
                        className={`w-20 h-20 rounded-full border-[8px] border-[#1b0000] shadow-2xl flex items-center justify-center transition-transform duration-300 cursor-pointer relative overflow-hidden ${isPowered ? 'bg-[#212121] active:scale-95' : 'bg-black opacity-40'}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-white/10" />
                        <div className={`w-2 h-8 rounded-full mb-10 ${isPowered ? 'bg-[#ffb300] shadow-[0_0_15px_#ffb300]' : 'bg-zinc-900'}`} />
                        <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(from_0deg,#000_0deg,#000_20deg,#222_20deg,#222_40deg)]" />
                      </div>
                      <span className="text-[8px] uppercase text-[#e0c097]/60 font-black tracking-widest">TUNING</span>
                    </div>
                  </div>
                </div>

                {/* Main Mic Button */}
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div className="relative">
                    <div className={`absolute -inset-8 rounded-full transition-all duration-1000 ${isListening ? 'bg-[#ffb300]/20 scale-125 blur-xl' : 'bg-transparent'}`} />
                    <button 
                      onClick={initiateMic}
                      disabled={!isPowered || isProcessing || isTalking || isListening}
                      className={`w-32 h-32 rounded-full border-[10px] shadow-2xl flex items-center justify-center transition-all duration-500 relative ${isListening ? 'bg-[#ffb300] border-white scale-110 shadow-[0_0_60px_#ffb300]' : isPowered ? 'bg-[#212121] border-[#1b0000] hover:border-[#ffb300] active:translate-y-1' : 'bg-black border-transparent opacity-10'}`}
                    >
                      {isListening && <div className="absolute inset-0 rounded-full animate-ping bg-[#ffb300] opacity-40" />}
                      <Mic className={`w-14 h-14 transition-transform ${isListening ? 'text-[#212121] scale-110' : isPowered ? 'text-white' : 'text-zinc-900'}`} strokeWidth={3} />
                    </button>
                    <span className={`absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-[0.5em] transition-colors whitespace-nowrap ${isListening ? 'text-[#ffb300]' : 'text-[#e0c097]/40'}`}>
                      {isListening ? 'RECEIVING' : 'TRANSMIT'}
                    </span>
                  </div>
                </div>

                {/* Bakelite Preset Buttons */}
                <div className="grid grid-cols-3 gap-4 mt-12">
                  {CHANNELS.map((task, i) => (
                    <button
                      key={i}
                      onClick={() => handleInteraction(task.prompt, task.label)}
                      disabled={!isPowered || isProcessing || isTalking || isListening}
                      className={`h-20 rounded-xl border-[4px] transition-all flex flex-col items-center justify-center relative group ${isPowered ? 'bg-[#2a2a2a] border-[#1b0000] shadow-lg hover:border-[#c5a880] hover:bg-[#333] active:translate-y-1' : 'bg-black opacity-10 cursor-default'}`}
                    >
                      <span className={`text-2xl font-black transition-colors ${isPowered ? 'text-white group-hover:text-[#c5a880]' : 'text-zinc-900'}`} style={{ fontFamily: '"Playfair Display", serif' }}>{task.ch}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isPowered ? 'text-white/60 group-hover:text-[#c5a880]' : 'text-zinc-900'}`}>{task.label}</span>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footnote Readout */}
        <div className="flex flex-col items-center gap-3 opacity-30 text-[10px] font-black uppercase tracking-[0.6em] mt-6 text-[#c5a880]">
          <div className="flex gap-12">
            <span className="flex items-center gap-2 font-mono"><Disc className="w-5 h-5" /> SIGNAL:STABLE</span>
            <span className="flex items-center gap-2 font-mono"><Zap className="w-5 h-5" /> VACUUM_TUBE:HOT</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .shadow-inner { box-shadow: inset 0 10px 40px rgba(0,0,0,0.9); }
        button:active { filter: brightness(1.2); }
        h1 { cursor: default; user-select: none; }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #c5a880;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border: 2px solid #1b0000;
        }
      `}</style>
    </div>
  );
};