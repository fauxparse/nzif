import Button from '@/components/atoms/Button';
import { Page, useFooterLinksQuery } from '@/contentful/types';
import ExternalLinkIcon from '@/icons/ExternalLinkIcon';
import ThemeIcon from '@/icons/ThemeIcon';
import { useMantineColorScheme } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import './Footer.css';

const isPageLink = (link: { __typename: string } | null): link is Page =>
  link?.__typename === 'Page' && !!link;

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, keyof MotionProps>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useMantineColorScheme();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTheme = () => {
    if (timer.current) clearTimeout(timer.current);
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    timer.current = setTimeout(() => {
      setColorScheme(nextTheme);
    }, 1000);
  };

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
          <p>&copy; 2024 New Zealand Improv Trust</p>
          <Button
            variant="ghost"
            data-color="neutral"
            size="small"
            leftSection={<ThemeIcon key="theme" />}
            onClick={toggleTheme}
          >
            Switch theme
          </Button>
        </section>
      </div>
    </motion.footer>
  );
};

export default Footer;
