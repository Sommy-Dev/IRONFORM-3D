import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGLTF, Environment } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

const CAPTIONS = ['Olympic plates', 'Precision-balanced bars', 'Built for years'];

function ModelFail({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center text-slate-400">
      <p className="text-sm">3D model failed to load.</p>
      <p className="text-xs mt-2 text-slate-500 break-words">{error}</p>
    </div>
  );
}

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string | null }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): { hasError: boolean; error: string | null } {
    return { hasError: true, error: error.message };
  }
  render() {
    return this.state.hasError ? <ModelFail error={this.state.error ?? ''} /> : this.props.children;
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

interface RackSceneProps {
  scrollProgress: React.MutableRefObject<number>;
}

const RackScene: React.FC<RackSceneProps> = ({ scrollProgress }) => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    camera as THREE.PerspectiveCamera,
  );
  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera;
    cameraRef.current.lookAt(0, 0, 0);
  }, [camera]);

  const gltf = useGLTF('/models/rack.glb') as unknown as {
    scene?: THREE.Group;
    errors?: Record<string, unknown>;
  };

  useEffect(() => {
    if (!gltf.scene || !groupRef.current) return;
    groupRef.current.add(gltf.scene.clone());

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.5 / maxDim;
    groupRef.current.position.set(
      -center.x * scale,
      -center.y * scale + 0.4,
      -center.z * scale,
    );
    groupRef.current.scale.set(scale, scale, scale);
    groupRef.current.rotation.y = -0.45;

    // Soften black plate materials so they show soft highlights
    groupRef.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((mat) => {
          const standard = mat as THREE.MeshStandardMaterial;
          const color = standard.color || new THREE.Color(0, 0, 0);
          const luminance =
            0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
          if (luminance < 0.25) {
            standard.metalness = 0.6;
            standard.roughness = 0.35;
            standard.needsUpdate = true;
          }
        });
      }
    });
  }, [gltf.scene, groupRef]);

  // Scroll-driven 3D animation inside Canvas via useFrame
  useFrame(() => {
    if (!groupRef.current || !cameraRef.current) return;
    const p = Math.max(0, Math.min(1, scrollProgress.current));

    let rotY: number, camX: number, camY: number, camZ: number;

    if (p < 0.25) {
      const t = p / 0.25;
      rotY = -0.45 + Math.PI * 0.5 * t;
      camX = 0;
      camY = 1.4 + (1.8 - 1.4) * t;
      camZ = 6 - (6 - 3.6) * t;
    } else if (p < 0.5) {
      const t = (p - 0.25) / 0.25;
      rotY = Math.PI * 0.5 + Math.PI * 0.6 * t;
      camX = 0 + 0.6 * t;
      camY = 1.8 + (1.1 - 1.8) * t;
      camZ = 3.6 + (2.6 - 3.6) * t;
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      rotY = Math.PI * 1.1 + Math.PI * 0.9 * t;
      camX = 0.6 + (2.4 - 0.6) * t;
      camY = 1.1 + (1.6 - 1.1) * t;
      camZ = 2.6 + (4.4 - 2.6) * t;
    } else {
      const t = (p - 0.75) / 0.25;
      rotY = Math.PI * 2.0 + Math.PI * 0.5 * t;
      camX = 2.4 - 2.4 * t;
      camY = 1.6 + (1.8 - 1.6) * t;
      camZ = 4.4 + (7.2 - 4.4) * t;
    }

    groupRef.current.rotation.y = rotY;
    cameraRef.current.position.set(camX, camY, camZ);
    cameraRef.current.lookAt(0, 0, 0);
  });

  return <group ref={groupRef} dispose={null} />;
};

export const SteelRack: React.FC = () => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null!);
  const captionRefs = useRef<(HTMLHeadingElement | null)[]>(
    CAPTIONS.map(() => null),
  );
  const scrollProgress = useRef(0);

  // ScrollTrigger updates scrollProgress ref (no R3F hooks here)
  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  // Only mount the Canvas when the section is near the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setMounted(true);
      },
      { threshold: 0, rootMargin: '200px' },
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Caption animations driven by the same scroll progress (DOM, not Canvas)
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
    tl.fromTo(
      captionRefs.current[0],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, ease: 'none' },
      0,
    );
    tl.to(captionRefs.current[0], { opacity: 0, y: -14, ease: 'none' }, 0.30);
    tl.fromTo(
      captionRefs.current[1],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, ease: 'none' },
      0.30,
    );
    tl.to(captionRefs.current[1], { opacity: 0, y: -14, ease: 'none' }, 0.60);
    tl.fromTo(
      captionRefs.current[2],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, ease: 'none' },
      0.60,
    );
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [sectionRef, captionRefs]);

  const canvasContent = mounted ? (
    <div
      className={`sticky top-0 z-0 w-full overflow-hidden ${
        isMobile ? 'h-[48vh] mt-16 mb-24 mx-auto' : 'h-screen'
      }`}
    >
      <ModelErrorBoundary>
        <Canvas
          key={isMobile ? 'mobile' : 'desktop'}
          camera={{ position: [0, 2, 6], fov: 45 }}
          dpr={[1, 1.5]}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0B0F14',
          }}
        >
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight
            position={[3, 8, 3]}
            intensity={2.5}
            color="#ffffff"
          />
          <directionalLight
            position={[-3, 2, -5]}
            intensity={1.2}
            color="#A3E635"
          />
          <Environment preset="warehouse" />
          <Suspense fallback={null}>
            <RackScene scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </ModelErrorBoundary>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[60vh] text-slate-600 text-sm">
      Steel rack 3D view (scroll to load)
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0B0F14] text-[#E0E2EA]" style={{ height: '200vh' }}>
      {canvasContent}

      {/* Headline + caption overlay */}
      <div className="absolute inset-0 z-20 flex items-center px-6 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-md transition-all duration-700 ${
            isMobile ? 'mx-auto text-center mt-10' : 'self-center text-left mt-10'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3 leading-tight">
            Engineered in steel
          </h2>
          <p
            ref={(el) => {
              captionRefs.current[0] = el as HTMLHeadingElement;
            }}
            className={`text-lg text-slate-300 mb-3 transition-opacity duration-500 opacity-0 translate-y-4`}
          >
            {CAPTIONS[0]}
          </p>
          <p
            ref={(el) => {
              captionRefs.current[1] = el as HTMLHeadingElement;
            }}
            className={`text-lg text-slate-300 mb-3 transition-opacity duration-500 opacity-0 translate-y-4`}
          >
            {CAPTIONS[1]}
          </p>
          <p
            ref={(el) => {
              captionRefs.current[2] = el as HTMLHeadingElement;
            }}
            className={`text-lg text-[#A3E635] transition-opacity duration-500 opacity-0 translate-y-4`}
          >
            {CAPTIONS[2]}
          </p>
        </div>
      </div>

      {/* Credit */}
      <div className="absolute bottom-8 left-8 z-20 text-xs text-slate-500 pointer-events-none">
        3D model: Fitness Equipment Storage Rack by Chenchanchong (Sketchfab, CC-BY)
      </div>
    </section>
  );
};
