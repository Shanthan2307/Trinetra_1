import { useEffect, useRef, useState } from 'react';

export function ExecutionTimeline() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      label: '// INPUT_RECEIVED',
      content: 'User Command: Book an Uber if the nearest tennis court is dry.',
      type: 'input',
    },
    {
      label: '// FACT_VERIFICATION',
      content: [
        '[INFO] Stream Accessed (ID: TC_482)',
        '[CV] Surface Analysis: DRY',
        '[HASH] FACT_HASH_F: 0x90A1...E7B5',
      ],
      type: 'process',
    },
    {
      label: '// ON_CHAIN_COMMIT',
      content: [
        '[T_VERIFY] Commit Triad',
        'TX_ID: 0xF00D...C9D3',
        'STATUS: AUTH_GRANTED',
      ],
      type: 'blockchain',
      highlight: true,
    },
    {
      label: '// EXECUTION_COMPLETE',
      content: [
        '[ACTION] Execute Uber Booking',
        '[PAYMENT] Deduct from Wallet (Ref: TX_ID)',
      ],
      type: 'complete',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...new Set([...prev, index])]);
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold neon-text text-center mb-16 font-mono">
          // EXECUTION_FLOW.LOG
        </h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative pl-20 pb-12 transition-all duration-500 ${
                visibleSteps.includes(index)
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4'
              }`}
            >
              {/* Timeline Node */}
              <div
                className={`absolute left-6 w-5 h-5 rounded-full border-2 border-primary bg-black ${
                  visibleSteps.includes(index) ? 'animate-pulse' : ''
                }`}
              />

              {/* Step Content */}
              <div
                className={`neon-border bg-black/50 p-6 backdrop-blur-sm ${
                  step.highlight
                    ? 'shadow-[0_0_30px_rgba(0,255,65,0.4)]'
                    : 'hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                } transition-all duration-300`}
              >
                <h3 className="text-lg font-bold text-primary mb-3 font-mono">
                  {step.label}
                </h3>

                {typeof step.content === 'string' ? (
                  <p className="text-white font-mono text-sm">{step.content}</p>
                ) : (
                  <div className="space-y-1 font-mono text-sm">
                    {step.content.map((line, i) => (
                      <div
                        key={i}
                        className={`${
                          step.highlight && line.includes('TX_ID')
                            ? 'text-primary font-bold'
                            : 'text-primary/80'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Result */}
          <div className="pl-20 mt-8">
            <div className="bg-primary/10 border-2 border-primary p-6 rounded">
              <p className="text-primary font-bold text-xl font-mono text-center">
                // RESULT: 100% Verifiable Action. Zero PII Risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
