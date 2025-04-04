import * as THREE from 'three';
import { useRef, useState } from 'react';
import { RootState, useFrame } from '@react-three/fiber';
import { Image, Text, useCursor } from '@react-three/drei';
import { easing } from 'maath';
import { useRoute, useLocation } from 'wouter';
import getUuid from 'uuid-by-string';
import '../../js/utilities';

const GOLDENRATIO = 1.61803398875;

interface Props {
  url: string;
  c: THREE.Color;
}

const Frame: React.FC<Props> = ({ url, c = new THREE.Color(), ...props }) => {
  const image = useRef<THREE.Mesh>(null!);
  const frame = useRef<THREE.Mesh>(null!);
  const [, params] = useRoute('/item/:id');
  const [hovered, hover] = useState(false);
  const [, setLocation] = useLocation();
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;
  useCursor(hovered);
  useFrame((state: RootState, dt: number) => {
    if (!image.current) return;

    (image.current.material as any).zoom =
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
      (frame.current.material as any).color,
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
        <>
          <Text
            maxWidth={0.1}
            anchorX="left"
            anchorY="top"
            position={[0.4, GOLDENRATIO * 0.9, -0.1]}
            fontSize={0.025}
            rotation={[0, Math.PI, 0]}
            color={'#000'}
            strokeColor={'pink'}
            strokeWidth={2}
          >
            {name.split('-').join(' ')}
          </Text>
          <Text
            maxWidth={0.1}
            anchorX="left"
            anchorY="top"
            position={[0.1, GOLDENRATIO * 0.2, -0.1]}
            fontSize={0.025}
            rotation={[0, Math.PI, 0]}
            color={'#000'}
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://www.google.com', '_blank');
            }}
          >
            {'Google.com'}
          </Text>
        </>
      )}
    </group>
  );
};

export default Frame;
