import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ContainerTextFlip.module.css";

interface Props {
  words: string[];
  interval?: number;
}

export default function ContainerTextFlip({
  words,
  interval = 2000,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={styles.text}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
