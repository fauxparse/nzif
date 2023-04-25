import React, { useMemo } from 'react';
import { Document, Text } from '@contentful/rich-text-types';
import { deburr, kebabCase } from 'lodash-es';

import Icon from '@/atoms/Icon';

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
  const headings = useMemo(
    () =>
      document.content
        .filter((node) => node.nodeType.match(/^heading-[23]/))
        .reduce((acc, node) => {
          const text = node.content.find(isTextNode)?.value;
          if (!text) return acc;
          const id = kebabCase(deburr(text));

          if (node.nodeType === 'heading-2' || !acc.length) {
            return [...acc, { id, heading: text, subheadings: [] }];
          } else {
            const last = acc.pop() as TOCSection;
            return [
              ...acc,
              {
                ...last,
                subheadings: [...last.subheadings, { id, heading: text, subheadings: [] }],
              },
            ];
          }
        }, [] as TOCSection[]),
    [document]
  );

  return (
    <div className="toc">
      <input type="checkbox" id="toc-toggle" />
      <label htmlFor="toc-toggle">
        <Icon name="chevronRight" />
        <span>Table of Contents</span>
      </label>
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
  );
};

export default TableOfContents;
