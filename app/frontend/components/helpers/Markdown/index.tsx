import { forwardRef } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import smartypants from 'remark-smartypants';
import { Box, createPolymorphicComponent } from '@mantine/core';

import './Markdown.css';

type MarkdownProps = { children: string };

const Markdown = createPolymorphicComponent<'div', MarkdownProps>(
  forwardRef<HTMLDivElement, MarkdownProps>(({ children, ...props }, ref) => (
    <Box ref={ref} className="markdown" {...props}>
      <ReactMarkdown remarkPlugins={[smartypants]}>{children}</ReactMarkdown>
    </Box>
  ))
);

Markdown.displayName = 'Markdown';

export default Markdown;
