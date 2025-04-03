import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  Text,
  Center,
  Text3D,
  Gltf,
} from '@react-three/drei';
import { easing } from 'maath';
import { KTX2Loader } from 'three-stdlib';
import '../../js/utilities';

const Gallery = () => (
  <Canvas camera={{ position: [0, 0, 90], fov: 35 }}>
    <ScrollControls pages={4} infinite>
      <Rig rotation={[0, 0, 0]}>
        <Carousel />
      </Rig>
    </ScrollControls>
    <Environment preset="city" background blur={0.5} />
  </Canvas>
);

function Rig(props: any) {
  const ref = useRef<any>();
  const scroll = useScroll();
  useFrame((state, delta) => {
    if (!ref.current || !state.events.update) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [0, 3, 10], 0.3, delta); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
  });
  return <group ref={ref} {...props} />;
}

function Carousel({ radius = 3.7, count = 20 }) {
  return (
    <>
      <Center rotation={[-(Math.PI * 1) / 7, 0, 0]} position={[0, 0, 0]}>
        <Text3D
          curveSegments={32}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={0.5}
          lineHeight={0.6}
          letterSpacing={-0.06}
          size={0.8}
          font="/src/assets/fonts/Inter_Bold.json"
        >
          {`Watch\nWeekend`}
          <meshNormalMaterial />
        </Text3D>
        <Center position={[-1.25, 0, 0]}>
          <Watch />
        </Center>
      </Center>
      {Array.from({ length: count }, (_, i) => (
        <Card
          key={i}
          url={`/src/assets/images/common/img${Math.floor(i % 10) + 1}_.jpg`}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
      ;
    </>
  );
}

function Card({ url, ...props }: any) {
  const frontSideRef = useRef();
  const backSideRef = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    easing.damp3(frontSideRef.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(
      frontSideRef.current.material,
      'radius',
      hovered ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(
      frontSideRef.current.material,
      'zoom',
      hovered ? 1 : 1.5,
      0.2,
      delta
    );
    easing.damp3(backSideRef.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(
      backSideRef.current.material,
      'radius',
      hovered ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(
      backSideRef.current.material,
      'zoom',
      hovered ? 1 : 1.5,
      0.2,
      delta
    );
  });
  return (
    <group {...props} onPointerOver={pointerOver} onPointerOut={pointerOut}>
      <Image ref={frontSideRef} url={url} transparent side={THREE.FrontSide}>
        <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
      </Image>

      <Image
        ref={backSideRef}
        url={'/src/assets/images/common/gray.png'}
        transparent
        side={THREE.BackSide}
      >
        <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
        <Text fontSize={0.2} position={[0, 0, -0.1]}>
          TEST
        </Text>
      </Image>
    </group>
  );
}

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath(
  `https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/`
);

function Watch() {
  const { gl } = useThree();

  return (
    <>
      <Gltf
        src={'/src/assets/images/seiko_watch.glb'}
        extendLoader={(loader) => {
          loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
        }}
        scale={20}
      />
    </>
  );
}

export default Gallery;
