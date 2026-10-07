export const GalaxySection = () => (
  <section aria-hidden="true" className="relative flex w-full items-center justify-center bg-black py-6">
    <div style={{ perspective: '800px', mixBlendMode: 'screen' }}>
      <img
        src="/gopal-logo.png"
        alt=""
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
        className="logo-orbit block h-[clamp(96px,16vh,150px)] w-auto select-none object-contain"
      />
    </div>
  </section>
);
