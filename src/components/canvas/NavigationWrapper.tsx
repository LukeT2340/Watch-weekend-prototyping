import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { RootState, useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { easing } from 'maath';
import { useRoute, useLocation } from 'wouter';
import '../../js/utilities';

const GOLDENRATIO = 1.61803398875;

function NavigationWrapper({
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  ...props
}) {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const clicked = useRef<THREE.Object3D>();
  const [, params] = useRoute('/item/:id');
  const [location, setLocation] = useLocation();
  useEffect(() => {
    if (params?.id) {
      clicked.current = ref.current?.getObjectByName(params.id);
    } else {
      clicked.current = undefined;
    }

    if (clicked.current) {
      clicked.current.parent?.updateWorldMatrix(true, true);
      clicked.current.parent?.localToWorld(p.set(0, GOLDENRATIO / 2, -3.5));
      clicked.current.parent?.getWorldQuaternion(q);
      q.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI
        )
      );

      return;
    }
    p.set(0, 0, 5.5);
    q.identity();
  });
  useFrame((state: RootState, delta: number) => {
    if (!ref.current) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);

    easing.damp3(
      state.camera.position,
      location === '/' ? [0, 3, 10] : p,
      0.8,
      delta
    );

    if (location === '/')
      easing.damp3(
        state.camera.rotation as unknown as THREE.Vector3,
        [-Math.PI / 5, 0, 0],
        1,
        delta
      );

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

export default NavigationWrapper;
