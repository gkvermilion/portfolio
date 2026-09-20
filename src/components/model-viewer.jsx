import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Center, Html, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

function ModelScene({ modelUrl, fitMargin, rotation, scrollProgress, scrollEffect }) {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef(null);

  useFrame((_, delta) => {
    if (!modelRef.current || !scrollProgress || !scrollEffect) return;

    const progress = THREE.MathUtils.clamp(scrollProgress.get(), 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const targetRotationX = eased * scrollEffect.rotationX;
    const targetRotationY = eased * scrollEffect.rotationY;
    const targetScale = 1 + eased * scrollEffect.scale;
    const smoothing = 1 - Math.exp(-scrollEffect.smoothing * delta);

    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotationX, smoothing);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, smoothing);
    modelRef.current.scale.setScalar(THREE.MathUtils.lerp(modelRef.current.scale.x, targetScale, smoothing));
  });

  return (
    <Bounds fit clip margin={fitMargin}>
      <Center>
        <group ref={modelRef}>
          <primitive object={scene} rotation={rotation} />
        </group>
      </Center>
    </Bounds>
  );
}

function ModelLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <span className="model-loading" role="status">
        Loading 3D object {Math.round(progress)}%
      </span>
    </Html>
  );
}

export default function ModelViewer({ modelUrl, fitMargin = 0.9, rotation = [0, 0, 0], autoRotate = true, autoRotateSpeed = 0.9, rotateSpeed = 0.7, scrollProgress = null, scrollEffect = null }) {
  const reduceMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 30, position: [0, 0, 5] }}
      dpr={[1, 1.5]}
      frameloop={reduceMotion ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight intensity={3.2} position={[3, 4, 5]} />
      <directionalLight intensity={1.6} position={[-4, 1, 2]} />
      <Suspense fallback={<ModelLoader />}>
        <ModelScene modelUrl={modelUrl} fitMargin={fitMargin} rotation={rotation} scrollProgress={scrollProgress} scrollEffect={scrollEffect} />
      </Suspense>
      <OrbitControls
        autoRotate={!reduceMotion && autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        enableDamping={false}
        enablePan={false}
        enableRotate
        enableZoom={false}
        maxDistance={5.5}
        minDistance={1.8}
        rotateSpeed={rotateSpeed}
      />
    </Canvas>
  );
}
