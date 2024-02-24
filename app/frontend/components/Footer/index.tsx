import clsx from 'clsx';
import { ComponentProps } from 'react';

import './Footer.css';

type FooterProps = ComponentProps<'footer'>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => (
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
      <section>&copy; 2024 New Zealand Improvisation Trust</section>
    </div>
  </footer>
);

export default Footer;
