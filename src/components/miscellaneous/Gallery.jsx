import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
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
  useCursor,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { easing } from 'maath';
import { KTX2Loader } from 'three-stdlib';
import { useRoute, useLocation } from 'wouter';
import getUuid from 'uuid-by-string';
import '../../js/utilities';

const GOLDENRATIO = 1.61803398875;

const Gallery = () => (
  <Canvas camera={{ position: [0, 1, 5], fov: 30 }}>
    <ScrollControls pages={4} infinite>
      <Rig rotation={[Math.PI / 20, 0, 0]}>
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
      </Rig>
    </ScrollControls>
    <Environment preset="forest" background blur={1} />
  </Canvas>
);

function Rig({
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  ...props
}) {
  const ref = useRef();
  const scroll = useScroll();
  const clicked = useRef();
  const [_, params] = useRoute('/item/:id');
  const [location, setLocation] = useLocation();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, -3.5));
      clicked.current.parent.getWorldQuaternion(q);
      q.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI
        )
      );
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);

    easing.damp3(
      state.camera.position,
      location === '/' ? [0, 3, 10] : p,
      0.8,
      delta
    );

    if (location === '/')
      easing.damp3(state.camera.rotation, [-Math.PI / 6, 0, 0], 1, delta);

    easing.dampQ(state.camera.quaternion, q, 0.8, delta);
  });
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (clicked.current && clicked.current === e.object) {
          setLocation('/item/' + e.object.name);
        } else {
          setLocation('/');
        }
      }}
      onPointerMissed={() => setLocation('/')}
      {...props}
    />
  );
}

function Carousel({ radius = 3.7, count = 20 }) {
  return (
    <>
      <Center rotation={[-(Math.PI * 1) / 7, 0, 0]} position={[0, 1, 0]}>
        <Text3D
          curveSegments={32}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.1}
          height={0.5}
          lineHeight={0.6}
          size={0.5}
          font="/assets/fonts/Inter_Bold.json"
        >
          {`Watch\nWeekend`}
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
        <Watch />
      </Center>
      {Array.from({ length: count }, (_, i) => (
        <Frame
          key={i}
          url={`/assets/images/common/img${Math.floor(i % 20) + 1}_.jpg`}
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

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath(
  `https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/`
);

function Watch() {
  const { gl } = useThree();

  return (
    <Center position={[-0.9, 0.1, 0]}>
      <Gltf
        src={'/assets/images/seiko_watch.glb'}
        extendLoader={(loader) => {
          loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
        }}
        scale={15}
        rotation={[0, 0, -Math.PI / 9]}
      />
    </Center>
  );
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const frame = useRef();
  const [, params] = useRoute('/item/:id');
  const [hovered, hover] = useState(false);
  const [location, setLocation] = useLocation();
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hovered);
  useFrame((state, dt) => {
    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(
      image.current.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : isActive ? 0.5 : 1),
        1,
      ],
      0.1,
      dt
    );
    easing.dampC(
      frame.current.material.color,
      hovered && !isActive ? 'orange' : 'white',
      0.1,
      dt
    );
  });
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        onClick={(e) => {
          e.stopPropagation();
          setLocation('/item/' + name);
        }}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
        />
      </mesh>
      {isActive && (
        <Text
          maxWidth={0.1}
          anchorX="left"
          anchorY="top"
          position={[0.4, GOLDENRATIO * 0.9, -0.1]}
          fontSize={0.025}
          rotation={[0, Math.PI, 0]}
          color={'#000'}
        >
          {name.split('-').join(' ')}
        </Text>
      )}
    </group>
  );
}

export default Gallery;
