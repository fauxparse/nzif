import { forwardRef } from 'react';
import { motion } from 'framer-motion';

import Button from '@/atoms/Button';

import { formItem, formPage } from './variants';

type CheckEmailProps = {
  onClose?: () => void;
};

const CheckEmail = forwardRef<HTMLDivElement, CheckEmailProps>(({ onClose }, ref) => (
  <motion.div
    ref={ref}
    className="authentication__form check-email"
    initial="out"
    animate="in"
    exit="out"
    variants={formPage}
  >
    <motion.h2 variants={formItem}>Check your email</motion.h2>
    <motion.p variants={formItem}>
      We’ve sent you an email with a link to reset your password.
    </motion.p>
    <Button as={motion.button} primary stretch variants={formItem} text="Close" onClick={onClose} />
  </motion.div>
));

CheckEmail.displayName = 'CheckEmail';

export default CheckEmail;
