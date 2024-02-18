import clsx from 'clsx';
import { ElementType, forwardRef } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import smartypants from 'remark-smartypants';

import { MarkdownComponent } from './Markdown.types';

import './Markdown.css';

export const Markdown: MarkdownComponent = forwardRef(
  ({ as, className, children, ...props }, ref) => {
    const Component = (as || 'div') as ElementType;

    return (
      <Component ref={ref} className={clsx('markdown', className)} {...props}>
        <ReactMarkdown remarkPlugins={[smartypants]}>{children}</ReactMarkdown>
      </Component>
    );
  }
);

Markdown.displayName = 'Markdown';

export default Markdown;
