import { useThree } from '@react-three/fiber';
import { Center, Gltf } from '@react-three/drei';
import { KTX2Loader } from 'three-stdlib';
import '../../js/utilities';

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

export default Watch;
