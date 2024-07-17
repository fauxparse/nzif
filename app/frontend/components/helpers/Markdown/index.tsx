import { Box, BoxProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import smartypants from 'remark-smartypants';

import classes from './Markdown.module.css';

type MarkdownProps = Omit<BoxProps, 'children'> & { children: string };

export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ className, children, ...props }, ref) => (
    <Box ref={ref} className={clsx(className, classes.markdown)} {...props}>
      <ReactMarkdown remarkPlugins={[smartypants]}>{children}</ReactMarkdown>
    </Box>
  )
);

Markdown.displayName = 'Markdown';
