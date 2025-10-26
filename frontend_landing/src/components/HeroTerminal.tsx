import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import FaultyTerminal from './FaultyTerminal';

export function HeroTerminal() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'TRINETRA // EXECUTE WITH TRUTH';
  const initText = '// INIT TRINETRA.SYS';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorBlink);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* FaultyTerminal - Full Screen Background */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={0.8}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#00FF41"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={true}
          brightness={0.6}
        />
      </div>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Init text */}
      <div className="absolute top-8 left-8 text-sm font-mono text-primary z-20">
        {initText}
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          {/* 3D Sphere Animation */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-spin-slow opacity-50" />
              <div className="absolute inset-4 rounded-full border-2 border-primary animate-spin-reverse opacity-70" />
              <div className="absolute inset-8 rounded-full border-2 border-primary animate-pulse bg-primary/20" />
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
            </div>
          </div>

          {/* Typing Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold neon-text font-mono mb-8 drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
            {text}
            {showCursor && <span className="animate-pulse">_</span>}
          </h1>

          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-12 font-mono leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            The Autonomous Verification System.
            <br />
            <span className="text-primary font-bold">Blockchain × AI × Real-World State.</span>
            <br />
            Trustless Action.
          </p>

          <Button
            className="neon-border bg-black/80 text-primary font-mono text-lg px-8 py-6 hover:bg-primary hover:text-black transition-all duration-300 backdrop-blur-sm"
            size="lg"
          >
            &gt; ACCESS THE MANIFEST
          </Button>
        </div>
      </div>
    </div>
  );
}
