import ChevronRightIcon from '@/icons/ChevronRightIcon';
import { Document, Text } from '@contentful/rich-text-types';
import { deburr, kebabCase } from 'lodash-es';
import React, { useEffect, useMemo, useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import classes from './Static.module.css';

type TableOfContentsProps = {
  document: Document;
};

type TOCSection = {
  id: string;
  heading: string;
  subheadings: TOCSection[];
};

const isTextNode = (node: { nodeType: string }): node is Text => node.nodeType === 'text';

const TableOfContents: React.FC<TableOfContentsProps> = ({ document }) => {
  const openByDefault = useMediaQuery('(min-width: 769px)');

  const container = useRef<HTMLDetailsElement>(null);

  const content = useRef<HTMLDivElement>(null);

  const headings = useMemo(
    () =>
      document.content
        .filter((node) => node.nodeType.match(/^heading-[23]/))
        .reduce((acc, node) => {
          const text = node.content.find(isTextNode)?.value;
          if (!text) return acc;
          const id = kebabCase(deburr(text));

          if (node.nodeType === 'heading-2' || !acc.length) {
            acc.push({ id, heading: text, subheadings: [] });
            return acc;
          }
          const last = acc.pop() as TOCSection;
          acc.push({
            ...last,
            subheadings: [...last.subheadings, { id, heading: text, subheadings: [] }],
          });
          return acc;
        }, [] as TOCSection[]),
    [document]
  );

  const toggle = (e: React.MouseEvent) => {
    if (!container.current) return;

    e.preventDefault();

    const open = container.current.open;
    if (!open) {
      container.current.open = true;
    } else {
      container.current.setAttribute('data-closing', 'true');
    }
  };

  const transitionEnd = () => {
    if (!container.current) return;

    if (container.current.hasAttribute('data-closing')) {
      container.current.removeAttribute('data-closing');
      container.current.open = false;
    }
  };

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const toggled = () => {
      el.removeAttribute('data-closing');
    };

    el.addEventListener('toggle', toggled);
    return () => {
      el.removeEventListener('toggle', toggled);
    };
  }, []);

  return (
    <details ref={container} open={openByDefault} className={classes.toc}>
      <summary onClick={toggle}>
        <ChevronRightIcon />
        <span>Table of Contents</span>
      </summary>
      <div ref={content} className={classes.tocContent} onTransitionEnd={transitionEnd}>
        <ul>
          {headings.map(({ id, heading, subheadings }) => (
            <li key={heading}>
              <a href={`#${id}`}>{heading}</a>
              {subheadings.length > 0 && (
                <ul>
                  {subheadings.map(({ id, heading }) => (
                    <li key={heading}>
                      <a href={`#${id}`}>{heading}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default TableOfContents;
