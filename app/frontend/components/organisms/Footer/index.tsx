import useTheme from '@/hooks/useTheme';
import ThemeIcon from '@/icons/ThemeIcon';
import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';
import Button from '@/components/atoms/Button';

import './Footer.css';

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, keyof MotionProps>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const { toggle } = useTheme();

  return (
    <motion.footer layout="position" className={clsx('footer', className)} {...props}>
      <div className="container">
        <section>
          <a href="#">Frequently-asked questions</a>
          <a href="#">Code of conduct</a>
          <a href="#">Privacy policy</a>
        </section>
        <section>
          <a href="#">NZIF Green Room</a>
          <a href="#">Get merch</a>
        </section>
        <section>
          <p>&copy; 2024 New Zealand Improvisation Trust</p>
          <Button variant="ghost" size="small" leftSection={<ThemeIcon />} onClick={toggle}>
            Switch theme
          </Button>
        </section>
      </div>
    </motion.footer>
  );
};

export default Footer;
