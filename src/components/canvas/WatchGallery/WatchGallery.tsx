import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ScrollControls,
  MeshReflectorMaterial,
} from '@react-three/drei';

import '../../../js/utilities';
import NavigationWrapper from '../NavigationWrapper';
import Carousel from '../Carousel';

const WatchGallery = () => (
  <Canvas camera={{ position: [0, 1, 5], fov: 30 }}>
    <ScrollControls pages={4} infinite>
      <NavigationWrapper rotation={[Math.PI / 20, 0, 0]}>
        <Carousel />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={0.5}
          />
        </mesh>
      </NavigationWrapper>
    </ScrollControls>
    <Environment preset="forest" background blur={1} />
  </Canvas>
);

export default WatchGallery;
