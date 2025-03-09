import { motion } from "framer-motion";
const Cursor = ({
  className = "",
  color = "bg-yellow-500",
}: {
  className?: string;
  color?: string;
}) => {
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
      className={`${className}inline-block ${color}  w-0.5 h-7  rounded-full`}
    />
  );
};

export default Cursor;
