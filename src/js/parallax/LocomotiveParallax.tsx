import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import {
  LocomotiveScrollProps,
  IExtendedLocomotiveScrollOptions,
} from '../../types';
import useMobile from '../../hooks/useMobile';

const LocomotiveParallax: React.FC<LocomotiveScrollProps> = ({
  locoScrollRef,
  children,
  className,
}) => {
  const divRef = locoScrollRef as React.RefObject<HTMLDivElement>;
  const isMobile = useMobile();

  // Comment out if you want parallax on mobile
  if (isMobile) {
    return <div>{children}</div>;
  }

  useEffect(() => {
    if (divRef.current) {
      new LocomotiveScroll({
        el: divRef.current,
        smooth: true,
        lerp: 0.07,
        multiplier: 0.7,
      } as IExtendedLocomotiveScrollOptions);
    }
  }, [divRef]);

  return (
    <div ref={divRef} className={className}>
      {children}
    </div>
  );
};

export default LocomotiveParallax;
