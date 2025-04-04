import { Center, Text3D } from '@react-three/drei';
import '../../js/utilities';
import Watch from './Watch';
import Frame from './Frame';

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

export default Carousel;
