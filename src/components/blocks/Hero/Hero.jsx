import { motion } from 'framer-motion';
import WatchGallery from '../../canvas/WatchGallery';

const Hero = () => (
  <section className="hero relative h-screen">
    <WatchGallery />
    <motion.div
      className="fixed top-0 left-0 h-screen w-[50vw] bg-black"
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      transition={{ delay: 1, duration: 1.2, ease: [0, 0, 0.4, 0.8] }}
      style={{ transformOrigin: 'left' }}
    />
    <motion.div
      className="fixed top-0 right-0 h-screen w-[50vw] bg-black"
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      transition={{ delay: 1, duration: 1.2, ease: [0, 0, 0.4, 0.8] }}
      style={{ transformOrigin: 'right' }}
    />
  </section>
);

export default Hero;
