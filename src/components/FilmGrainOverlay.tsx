export function FilmGrainOverlay() {
  return (
    <>
      {/* High-frequency subtle tactile film grain overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9997] opacity-[0.042] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Subtle chromatic ambient edge vignette */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9996] opacity-[0.35] [background:radial-gradient(circle_at_50%_50%,transparent_55%,rgba(7,6,11,0.9)_100%)]"
      />
    </>
  );
}
