import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.ticker.fps(120);

      gsap.to('.ambient-a', {
        xPercent: 12,
        yPercent: -8,
        rotation: 10,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
      });
      gsap.to('.ambient-b', {
        xPercent: -10,
        yPercent: 10,
        rotation: -8,
        duration: 8.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl will-change-transform" />
      <div className="ambient-b absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-fuchsia-400/14 blur-3xl will-change-transform" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.11),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    </div>
  );
};

export default AnimatedBackground;
