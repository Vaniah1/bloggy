import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  keyValue,
}) => {
  return (
    <motion.div
      key={keyValue}
      animate={animate}
      transition={transition}
      initial={initial}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
