import React from 'react';
import { motion } from 'framer-motion';

import { formItem } from './variants';

const Divider: React.FC = () => (
  <motion.div className="divider" variants={formItem}>
    or log in with
  </motion.div>
);

export default Divider;
