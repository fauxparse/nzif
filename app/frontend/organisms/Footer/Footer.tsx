import React, { forwardRef, useMemo } from 'react';
import { DateTime } from 'luxon';

import { Page, useFooterLinksQuery } from '../../contentful/types';

import { FooterProps } from './Footer.types';

import './Footer.css';
import { Link } from 'react-router-dom';

const isPageLink = (link): link is Page => link?.__typename === 'Page';

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
    <footer ref={ref} className="footer" {...props}>
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
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
