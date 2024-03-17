import Button from '@/components/atoms/Button';
import { Page, useFooterLinksQuery } from '@/contentful/types';
import useTheme from '@/hooks/useTheme';
import ExternalLinkIcon from '@/icons/ExternalLinkIcon';
import ThemeIcon from '@/icons/ThemeIcon';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import { useMemo } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import './Footer.css';

const isPageLink = (link: { __typename: string } | null): link is Page =>
  link?.__typename === 'Page' && !!link;

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, keyof MotionProps>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const { toggle } = useTheme();

  const { data } = useFooterLinksQuery({ context: { clientName: 'contentful' } });

  const items = data?.footerCollection?.items?.[0]?.linksCollection?.items || [];

  const links = useMemo(
    () => items.filter((p) => isPageLink(p)) as (Page & { slug: string })[],
    [items]
  );

  return (
    <motion.footer layout="position" className={clsx('footer', className)} {...props}>
      <div className="container">
        <section>
          {links.map((link) => (
            <Link to="/about/$slug" params={{ slug: link.slug }} key={link.sys.id}>
              {link.title}
            </Link>
          ))}
        </section>
        <section>
          <a
            href="https://www.facebook.com/groups/NZIFGreenRoom"
            target="_blank"
            rel="noopener noreferrer"
          >
            NZIF Green Room
            <ExternalLinkIcon />
          </a>
          <a href="https://improvfest.printmighty.co.nz/" target="_blank" rel="noopener noreferrer">
            Get merch
            <ExternalLinkIcon />
          </a>
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
