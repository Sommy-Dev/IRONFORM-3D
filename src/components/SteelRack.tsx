import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGLTF } from '@react-three/drei/core/Gltf';

gsap.registerPlugin(ScrollTrigger);

const CAPTIONS = ['Olympic plates', 'Precision-balanced bars', 'Built for years'];

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
      Loading 3D model…
    </div>
  );
}

function ModelFail() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center text-slate-400">
      <p className="text-sm">3D model failed to load.</p>
      <p className="text-xs mt-2 text-slate-500">
        Check that /models/rack.glb exists.
      </p>
    </div>
  );
}

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <ModelFail /> : this.props.children;
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
  groupRef: React.RefObject<THREE.Group>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera>;
}

const RackScene: React.FC<RackSceneProps> = ({ groupRef, cameraRef }) => {
  const { camera } = useThree();

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
  }, [gltf.scene, groupRef]);

  return <group ref={groupRef} dispose={null} />;
};

export const SteelRack: React.FC = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const captionRefs = useRef<(HTMLHeadingElement | null)[]>(
    CAPTIONS.map(() => null),
  );

  useEffect(() => {
    if (!sectionRef.current || !groupRef.current || !cameraRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1: slow turn + ease in
    tl.to(groupRef.current.rotation, { y: Math.PI * 0.5, ease: 'none' }, 0);
    tl.to(
      cameraRef.current.position,
      { x: 0, y: 1.4, z: 3.6, ease: 'none' },
      0.1,
    );
    // Phase 2: zoom toward the plates
    tl.to(
      groupRef.current.rotation,
      { y: Math.PI * 1.1, ease: 'none' },
      0.3,
    );
    tl.to(
      cameraRef.current.position,
      { x: 0.6, y: 1.1, z: 2.6, ease: 'none' },
      0.4,
    );
    // Phase 3: orbit around the rack
    tl.to(
      groupRef.current.rotation,
      { y: Math.PI * 2.0, ease: 'none' },
      0.6,
    );
    tl.to(
      cameraRef.current.position,
      { x: 2.4, y: 1.6, z: 4.4, ease: 'none' },
      0.65,
    );
    // Phase 4: pull back
    tl.to(
      cameraRef.current.position,
      { x: 0, y: 1.8, z: 7.2, ease: 'none' },
      0.85,
    );
    tl.to(
      groupRef.current.rotation,
      { y: Math.PI * 2.5, ease: 'none' },
      0.85,
    );

    // Captions fade in/out at 3 scroll points
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
  }, [sectionRef, groupRef, cameraRef, captionRefs]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0B0F14] text-[#E0E2EA]" style={{ height: '200vh' }}>
      {/* Pinned 3D canvas */}
      <div
        className={`sticky top-0 z-0 w-full overflow-hidden ${
          isMobile ? 'h-[48vh] mt-16 mb-24 mx-auto' : 'h-screen'
        }`}
      >
        <Canvas
          key={isMobile ? 'mobile' : 'desktop'}
          camera={{ position: [0, 2, 6], fov: 45 }}
          dpr={isMobile ? 1 : 2}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0B0F14',
          }}
        >
          <ambientLight intensity={0.35} color="#ffffff" />
          <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
          <directionalLight
            position={[-5, 4, -5]}
            intensity={0.6}
            color="#A3E635"
          />
          <ModelErrorBoundary>
            <Suspense fallback={<Loading />}>
              <RackScene groupRef={groupRef} cameraRef={cameraRef} />
            </Suspense>
          </ModelErrorBoundary>
        </Canvas>
      </div>

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
