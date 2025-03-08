import { motion } from "framer-motion";
const Results = ({
  errors,
  accuracyPercentage,
  total,
  className,
}: {
  errors: number;
  accuracyPercentage: number;
  total: number;
  className?: string;
}) => {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const duration = { duration: 0.3 };
  return (
    <div>
      <motion.ul
        className={`flex flex-col items-center text-primary-400 space-y-3 ${className}`}
      >
        <motion.li
          initial={initial}
          animate={animate}
          transition={{ ...duration, delay: 0 }}
          className="text-xl font-semibold"
        >
          Results
        </motion.li>
        <div className="flex flex-col md:flex-row justify-center  md:gap-6 items-center w-full">
          <motion.li
            initial={initial}
            animate={animate}
            transition={{ ...duration, delay: 0.5 }}
          >
            Accuracy: {accuracyPercentage.toFixed(0)}%
          </motion.li>
          <motion.li
            initial={initial}
            animate={animate}
            transition={{ ...duration, delay: 1 }}
            className="text-red-500"
          >
            Errors: {errors}
          </motion.li>
          <motion.li
            initial={initial}
            animate={animate}
            transition={{ ...duration, delay: 1.4 }}
          >
            Typed: {total}
          </motion.li>
        </div>
      </motion.ul>
    </div>
  );
};

export default Results;
