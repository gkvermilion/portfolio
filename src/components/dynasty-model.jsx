import { useGLTF } from '@react-three/drei';
import { useScroll } from 'motion/react';
import ModelViewer from './model-viewer';

const MODEL_URL = 'https://vijbx2zmgnhkafkc.public.blob.vercel-storage.com/5%20year%20coin.glb';

useGLTF.preload(MODEL_URL);

export default function DynastyModel({ scrollTarget }) {
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start end', 'end start'],
  });

  return (
    <ModelViewer
      modelUrl={MODEL_URL}
      fitMargin={0.1}
      rotation={[0.1, -1, 0]}
      autoRotate={false}
      scrollProgress={scrollYProgress}
      scrollEffect={{ rotationX: -1.08, rotationY: 0.16, scale: 4, smoothing: 7 }}
    />
  );
}
