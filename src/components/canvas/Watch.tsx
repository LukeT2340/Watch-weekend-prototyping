import { useLoader, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { GLTFLoader, KTX2Loader } from 'three-stdlib';
import { useEffect } from 'react';
import '../../js/utilities';

function Watch() {
  const { gl } = useThree();

  // Setup KTX2Loader and configure the GLTFLoader to use it
  useEffect(() => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(
      `https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/`
    );
    ktx2Loader.detectSupport(gl);
  }, [gl]);

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, '/assets/images/seiko_watch.glb');

  return (
    <Center position={[-0.9, 0.1, 0]}>
      <primitive
        object={gltf.scene}
        scale={15}
        rotation={[0, 0, -Math.PI / 9]}
      />
    </Center>
  );
}

export default Watch;
