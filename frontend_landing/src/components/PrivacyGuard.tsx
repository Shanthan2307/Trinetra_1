import { useState } from 'react';

export function PrivacyGuard() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const principles = [
    {
      title: 'DATA MINIMIZATION',
      description:
        'We process raw footage at the Edge. Only anonymized fact-hashes leave the input environment.',
      note: '// RAW VIDEO NEVER STORED',
    },
    {
      title: 'AUDITABLE TRUTH',
      description:
        'The T-VERIFY contract provides the immutable log of the reason for the transaction.',
      note: '// WHY: JUSTIFICATION IS ON-CHAIN',
    },
  ];

  const complianceIcons = ['GDPR', 'BIPA', 'EU AI ACT'];

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Central Security Visual */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 border-4 border-primary rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border-2 border-primary rounded-full animate-spin-reverse" />
            <div className="absolute inset-8 border border-primary rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold neon-text mb-4 font-mono">
            SECURITY.LOG: PRIVACY-BY-DESIGN IS THE FEATURE
          </h2>
        </div>

        {/* Principles */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {principles.map((principle, index) => (
            <div
              key={index}
              className={`neon-border bg-black/50 p-8 backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                expandedCard === index
                  ? 'shadow-[0_0_40px_rgba(0,255,65,0.4)] scale-105'
                  : 'hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]'
              }`}
              onClick={() =>
                setExpandedCard(expandedCard === index ? null : index)
              }
            >
              <h3 className="text-2xl font-bold text-primary mb-4 font-mono flex items-center justify-between">
                {principle.title}
                <span className="text-sm">{expandedCard === index ? '▼' : '▶'}</span>
              </h3>

              <p className="text-white/80 mb-4 font-mono text-sm leading-relaxed">
                {principle.description}
              </p>

              <div className="bg-black/80 border-l-4 border-primary px-4 py-2 font-mono text-xs text-primary">
                {principle.note}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Bar */}
        <div className="neon-border bg-black/50 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-primary mb-6 font-mono text-center">
            Forward-Looking Regulatory Compliance
          </h3>

          <div className="flex justify-center items-center gap-8 flex-wrap">
            {complianceIcons.map((icon, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-20 h-20 border-2 border-primary rounded-lg flex items-center justify-center mb-2 group-hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all duration-300 group-hover:scale-110">
                  <span className="text-primary font-mono text-xs font-bold text-center">
                    {icon}
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-primary animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
