import { motion } from "motion/react";
import VoxelIsland from "./VoxelIsland.jsx";

const ease = [0.25, 0.1, 0.25, 1];

// Opening screen: floating voxel island over the title + Enter button.
export default function EnterScreen({ onEnter }) {
  return (
    <motion.div
      id="enter-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease }}
    >
      <motion.div
        className="island-stage"
        initial={{ opacity: 0, y: 18, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease }}
      >
        <VoxelIsland />
      </motion.div>
      <motion.div
        id="enter-logo"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
      >
        IB Oral
      </motion.div>
      <motion.div
        id="enter-sub"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
      >
        English B &nbsp;·&nbsp; SL
      </motion.div>
      <motion.button
        id="enter-btn"
        onClick={onEnter}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease }}
      >
        Enter &nbsp;→
      </motion.button>
    </motion.div>
  );
}
