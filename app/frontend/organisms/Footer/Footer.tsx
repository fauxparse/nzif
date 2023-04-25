import React, { forwardRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import { Page, useFooterLinksQuery } from '@/contentful/types';

import { FooterProps } from './Footer.types';

import './Footer.css';

const isPageLink = (link: { __typename: string } | null): link is Page =>
  link?.__typename === 'Page';

export const Footer = forwardRef<HTMLElement, FooterProps>((props, ref) => {
  const { data } = useFooterLinksQuery({ context: { clientName: 'contentful' } });

  const links = useMemo(
    () =>
      (data?.footerCollection?.items?.[0]?.linksCollection?.items || []).filter(
        isPageLink
      ) as Page[],
    [data]
  );

  return (
    <motion.footer layout ref={ref} className="footer">
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link?.sys.id}>
              <Link to={`/${link.slug}`}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p>&copy; {DateTime.now().toFormat('yyyy')} New Zealand Improvisation Trust</p>
    </motion.footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
