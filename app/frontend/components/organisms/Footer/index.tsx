import { Grid, Theme } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { MotionProps, motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';
import { useMemo, useRef } from 'react';
import { ActionList } from '@/components/molecules/ActionList';
import { Page, useFooterLinksQuery } from '@/contentful/types';
import ExternalLinkIcon from '@/icons/ExternalLinkIcon';
import PageIcon from '@/icons/PageIcon';
import { useDarkMode } from '@/services/Themes';
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
                <ActionList.Item key={link.sys.id} asChild>
                  <Link to="/about/$slug" params={{ slug: link.slug }}>
                    <PageIcon />
                    <span>{link.title}</span>
                  </Link>
                </ActionList.Item>
              ))}
            </ActionList>
          </section>
          <section>
            <ActionList variant="subtle">
              <ActionList.Item asChild>
                <a
                  href="https://www.facebook.com/groups/NZIFGreenRoom"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                  NZIF Green Room
                </a>
              </ActionList.Item>
              <ActionList.Item asChild>
                <a
                  href="https://improvfest.printmighty.co.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                  Get merch
                </a>
              </ActionList.Item>
              {/* <ActionList.Item asChild>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScFcMMbK93sGtbcdj7i9TGU7ZlSGh-gm-XDdrnvGfbi7y9iFg/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                  Awards nominations
                </a>
              </ActionList.Item> */}
            </ActionList>
          </section>
          <section>
            <p>&copy; 2025 New Zealand Improv Trust</p>
          </section>
        </Grid>
      </motion.footer>
    </Theme>
  );
};

export default Footer;
