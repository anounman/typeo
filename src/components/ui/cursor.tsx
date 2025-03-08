import { motion } from "framer-motion";
const Cursor = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      aria-hidden={true}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={`${className}inline-block  w-0.5 h-7 bg-yellow-500 rounded-full`}
    />
  );
};

export default Cursor;
