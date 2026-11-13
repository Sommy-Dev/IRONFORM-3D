import React, {useEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

interface ForgeScene {
  id: number;
  img: string;
  alt: string;
  headline: string;
  caption: string;
}

const SCENES: ForgeScene[] = [
  {
    id: 1,
    img: '/images/unsplash1.jpg',
    alt: 'Athlete training with iron, forged through discipline',
    headline: 'FORGED IN IRON',
    caption: 'Raw strength, built from the ground up.',
  },
  {
    id: 2,
    img: '/images/unsplash2.jpg',
    alt: 'Conditioning built to last a lifetime',
    headline: 'BUILT TO LAST',
    caption: 'No compromises. No concessions.',
  },
  {
    id: 3,
    img: '/images/unsplash3.jpg',
    alt: 'No shortcuts, only honest hard work',
    headline: 'NO SHORTCUTS',
    caption: 'The grind is the only way.',
  },
  {
    id: 4,
    img: '/images/unsplash4.jpg',
    alt: 'Step into the forge and join the crew',
    headline: 'JOIN THE FORGE',
    caption: 'Train like iron. Leave forged.',
  },
];

export const ForgeScroll: React.FC = () => {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>(
    SCENES.map(() => null),
  );
  const imgRefs = useRef<Array<HTMLImageElement | null>>(
    SCENES.map(() => null),
  );
  const overlayRefs = useRef<Array<HTMLDivElement | null>>(
    SCENES.map(() => null),
  );
  const headlineRefs = useRef<Array<HTMLHeadingElement | null>>(
    SCENES.map(() => null),
  );
  const captionRefs = useRef<Array<HTMLParagraphElement | null>>(
    SCENES.map(() => null),
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis overrides smooth-scroll behaviour on the html element.
    document.documentElement.style.scrollBehavior = 'auto';

    const kills: Array<() => void> = [];

    SCENES.forEach((scene, i) => {
      const section = sectionRefs.current[i];
      const img = imgRefs.current[i];
      const overlay = overlayRefs.current[i];
      const headline = headlineRefs.current[i];
      const caption = captionRefs.current[i];
      const nextImg = imgRefs.current[i + 1] ?? null;

      if (!section || !img || !overlay || !headline || !caption) {
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight}px`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Slow zoom in on the image while the scene is pinned.
      tl.to(img, {scale: 1.2, ease: 'none'}, 0)
        // Dark gradient overlay fades in over the image.
        .to(overlay, {opacity: 0.75, ease: 'none'}, 0)
        // Headline and caption fade up from below.
        .fromTo(
          headline,
          {y: 40, opacity: 0},
          {y: 0, opacity: 1, ease: 'none'},
          0,
        )
        .fromTo(
          caption,
          {y: 40, opacity: 0},
          {y: 0, opacity: 1, ease: 'none'},
          0.05,
        )
        // Text fades out before the next scene takes over.
        .to(headline, {y: -40, opacity: 0, ease: 'none'}, '>=0.8')
        .to(caption, {y: -40, opacity: 0, ease: 'none'}, '>=0.8');

      // Crossfade: next image fades in over the previous one.
      if (nextImg) {
        tl.to(img, {opacity: 0, ease: 'none'}, '>=0.72')
          .to(nextImg, {opacity: 1, ease: 'none'}, '>=0.72');
      }

      kills.push(() => tl.scrollTrigger?.kill());
    });

    return () => {
      kills.forEach((kill) => kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#0B0F14] text-[#E0E2EA]">
      {SCENES.map((scene, i) => {
        const isFirst = i === 0;
        return (
            <div
              key={scene.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="h-screen w-full relative flex items-center justify-center overflow-hidden"
              aria-label={scene.headline}
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={scene.img}
                  alt={scene.alt}
                  className="w-full h-full object-cover object-center"
                  style={{opacity: isFirst ? 1 : 0}}
                  decoding="async"
                  loading="eager"
                />
                <div
                  ref={(el) => {
                    overlayRefs.current[i] = el;
                  }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000000]/40 to-[#0B0F14]/90"
                  style={{opacity: 0}}
                />
              </div>
              <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
                <h2
                  ref={(el) => {
                    headlineRefs.current[i] = el;
                  }}
                  className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[1.05] tracking-tight mb-3"
                  style={{opacity: 0, transform: 'translateY(40px)'}}
                >
                  {scene.headline}
                </h2>
                <p
                  ref={(el) => {
                    captionRefs.current[i] = el;
                  }}
                  className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.3em] text-[#A3E635] font-display font-semibold opacity-70"
                  style={{opacity: 0, transform: 'translateY(40px)'}}
                >
                  {scene.caption}
                </p>
              </div>
            </div>
        );
      })}
    </section>
  );
};
