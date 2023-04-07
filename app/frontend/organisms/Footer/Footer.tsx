import React, { forwardRef } from 'react';
import { DateTime } from 'luxon';

import { FooterProps } from './Footer.types';

import './Footer.css';

export const Footer = forwardRef<HTMLElement, FooterProps>((props, ref) => {
  return (
    <footer ref={ref} className="footer" {...props}>
      <nav>
        <ul>
          <li>
            <a href="https://example.com">Public site</a>
          </li>
          <li>
            <a href="https://example.com">Code of conduct</a>
          </li>
          <li>
            <a href="https://example.com">Terms of use</a>
          </li>
          <li>
            <a href="https://example.com">Privacy policy</a>
          </li>
        </ul>
      </nav>
      <p>&copy; {DateTime.now().toFormat('yyyy')} New Zealand Improvisation Trust</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
