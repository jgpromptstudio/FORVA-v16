const VIDEO_URL =
  'https://bvfkgxkubflgejuzorie.supabase.co/storage/v1/object/public/public-assets/FORVA-second-section-orbit-4s.mp4';

export function ValueBridge() {
  return (
    <section className="relative z-10">
      {/* Bridge heading between Hero and orbital video */}
      <div className="relative px-6 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
        {/* Top gradient: fades from Hero into the bridge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20"
          style={{
            background:
              'linear-gradient(180deg, hsl(var(--background)) 0%, hsla(var(--background), 0.6) 50%, transparent 100%)',
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="eyebrow">One Connected Workflow</span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            From intention to appointment.
          </h2>
        </div>
      </div>

      {/* Orbital video: autoplay + muted + loop, no overlays */}
      <div className="relative w-full">
        {/* Top fade from bridge into video */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12"
          style={{
            background:
              'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)',
          }}
        />

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="block w-full"
          style={{ height: 'auto' }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Bottom fade from video into next section */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
          style={{
            background:
              'linear-gradient(0deg, hsl(var(--background)) 0%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
}
