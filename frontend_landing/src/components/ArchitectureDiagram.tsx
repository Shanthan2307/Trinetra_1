export function ArchitectureDiagram() {
  const pillars = [
    {
      title: 'AI_AGENTS.EXE',
      subtitle: 'The Brain',
      icon: (
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse" />
          <div className="absolute inset-2 border border-primary/50 rounded" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-50" />
            <div className="w-4 h-4 bg-primary rounded-full absolute" />
          </div>
        </div>
      ),
      log: [
        '[STATUS] Prompt Parsing OK...',
        '[ACTION] Query Vision Agent...',
        '[OUTPUT] Execution Intent Ready...',
      ],
    },
    {
      title: 'VISION_INPUT.STREAM',
      subtitle: 'The Eyes',
      icon: (
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-16 h-12 border-2 border-primary mx-auto mt-4 rounded-sm relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 border-l-2 border-r-2 border-b-2 border-primary" />
          </div>
          <div className="absolute top-6 right-4 w-16 h-1 bg-primary animate-pulse" />
        </div>
      ),
      log: [
        'RAW DATA →',
        'EDGE ANONYMIZATION →',
        'FACT HASH',
      ],
    },
    {
      title: 'BLOCKCHAIN.AUDIT',
      subtitle: 'The Shield',
      icon: (
        <div className="relative w-24 h-24 mx-auto mb-6 flex flex-col justify-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-3 bg-primary/20 border border-primary animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      ),
      log: [
        'CONTRACT T_VERIFY (',
        '  hash_C, hash_F, intent_E',
        ') { WRITE_TX => TX_ID }',
      ],
    },
  ];

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold neon-text text-center mb-16 font-mono">
          // CORE_ARCHITECTURE.SYS
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="neon-border bg-black/50 p-8 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-primary mb-2 font-mono">
                {pillar.title}
              </h3>
              <p className="text-white/60 mb-6 font-mono text-sm">
                {pillar.subtitle}
              </p>

              {pillar.icon}

              <div className="bg-black/80 p-4 rounded border border-primary/30 font-mono text-xs">
                {pillar.log.map((line, i) => (
                  <div
                    key={i}
                    className="text-primary mb-1 opacity-80"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
