import React, { forwardRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import { Page, useFooterLinksQuery } from '@/contentful/types';
import { ROUTES } from '@/Routes';

import { FooterProps } from './Footer.types';

import './Footer.css';

const isPageLink = (link: { __typename: string } | null): link is Page =>
  link?.__typename === 'Page' && !!link;

export const Footer = forwardRef<HTMLElement, FooterProps>((props, ref) => {
  const { data } = useFooterLinksQuery({ context: { clientName: 'contentful' } });

  const links = useMemo(
    () =>
      (data?.footerCollection?.items?.[0]?.linksCollection?.items || []).filter((p) =>
        isPageLink(p)
      ) as (Page & { slug: string })[],
    [data]
  );

  return (
    <motion.footer layout ref={ref} className="footer">
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link?.sys.id}>
              <Link to={ROUTES.CONTENT.buildPath(link)}>{link.title}</Link>
            </li>
          ))}
          <li>
            <a
              href="https://www.facebook.com/groups/NZIFGreenRoom"
              target="_blank"
              rel="noopener noreferrer"
            >
              Green Room
            </a>
          </li>
          <li>
            <a
              href="https://improvfest.printmighty.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Merch
            </a>
          </li>
        </ul>
      </nav>
      <p>&copy; {DateTime.now().toFormat('yyyy')} New Zealand Improvisation Trust</p>
    </motion.footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
