import { ActionList } from '@/components/molecules/ActionList';
import { Page, useFooterLinksQuery } from '@/contentful/types';
import ExternalLinkIcon from '@/icons/ExternalLinkIcon';
import ThemeIcon from '@/icons/ThemeIcon';
import { useDarkMode } from '@/services/Themes';
import { Grid, Theme } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import PageIcon from '@/icons/PageIcon';
import classes from './Footer.module.css';

const isPageLink = (link: { __typename: string } | null): link is Page =>
  link?.__typename === 'Page' && !!link;

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, keyof MotionProps>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { toggle } = useDarkMode();

  const { data } = useFooterLinksQuery({ context: { clientName: 'contentful' } });

  const items = data?.footerCollection?.items?.[0]?.linksCollection?.items || [];

  const links = useMemo(
    () => items.filter((p) => isPageLink(p)) as (Page & { slug: string })[],
    [items]
  );

  return (
    <Theme accentColor="gray" asChild>
      <motion.footer layout="position" className={clsx(classes.footer, className)} {...props}>
        <Grid className="container" columns={{ initial: '1', md: '2', lg: '3' }} gap="5">
          <section>
            <ActionList variant="subtle">
              {links.map((link) => (
                <ActionList.Item
                  key={link.sys.id}
                  as={Link}
                  to="/about/$slug"
                  params={{ slug: link.slug }}
                  icon={<PageIcon />}
                >
                  {link.title}
                </ActionList.Item>
              ))}
            </ActionList>
          </section>
          <section>
            <ActionList variant="subtle">
              <ActionList.Item
                as="a"
                href="https://www.facebook.com/groups/NZIFGreenRoom"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkIcon />}
              >
                NZIF Green Room
              </ActionList.Item>
              <ActionList.Item
                as="a"
                href="https://improvfest.printmighty.co.nz/"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkIcon />}
              >
                Get merch
              </ActionList.Item>
            </ActionList>
          </section>
          <section>
            <ActionList variant="subtle">
              <ActionList.Item as="div" color="neutral" icon={<span>&copy;</span>}>
                2024 New Zealand Improv Trust
              </ActionList.Item>
              <ActionList.Item variant="ghost" icon={<ThemeIcon />} onClick={toggle}>
                Switch theme
              </ActionList.Item>
            </ActionList>
          </section>
        </Grid>
      </motion.footer>
    </Theme>
  );
};

export default Footer;
