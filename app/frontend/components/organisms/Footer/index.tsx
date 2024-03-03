import clsx from 'clsx';
import { ComponentProps } from 'react';

import './Footer.css';
import Button from '../../atoms/Button';
import useTheme from '@/hooks/useTheme';
import ThemeIcon from '@/icons/ThemeIcon';

type FooterProps = ComponentProps<'footer'>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const { toggle } = useTheme();

  return (
    <footer className={clsx('footer', className)}>
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
          <Button variant="ghost" size="small" left={<ThemeIcon />} onClick={toggle}>
            Switch theme
          </Button>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
