import { useGLTF } from '@react-three/drei';
import ModelViewer from './model-viewer';

const MODEL_URL = 'https://vijbx2zmgnhkafkc.public.blob.vercel-storage.com/Meshy_AI_Monochrome_Streetwear_0911164240_texture.glb';

useGLTF.preload(MODEL_URL);

export default function AboutModel() {
  return <ModelViewer modelUrl={MODEL_URL} rotation={[0, -0.45, 0]} autoRotateSpeed={10} rotateSpeed={4} />;
}
