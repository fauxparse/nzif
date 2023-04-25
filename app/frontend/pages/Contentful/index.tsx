import React from 'react';
import Balanced from 'react-balanced';
import { useParams } from 'react-router-dom';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, Text } from '@contentful/rich-text-types';
import { deburr, kebabCase } from 'lodash-es';

import Spinner from '@/atoms/Spinner';
import { useContentPageQuery } from '@/contentful/types';

import TableOfContents from './TableOfContents';

import './Contentful.css';

const isTextNode = (node: { nodeType: string }): node is Text => node.nodeType === 'text';

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return <h2 id={kebabCase(deburr(text))}>{text}</h2>;
    },
    [BLOCKS.HEADING_3]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return <h3 id={kebabCase(deburr(text))}>{text}</h3>;
    },
  },
};

const Contentful: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data } = useContentPageQuery({
    variables: { slug },
    context: { clientName: 'contentful' },
  });

  const page = data?.pageCollection?.items?.[0];

  const document: Document | undefined = page?.body?.json;

  return (
    <div className="content-page">
      <section>
        {document ? (
          <>
            <header className="content-page__header">
              <Balanced as="h1">{page?.title}</Balanced>
              {page?.lede && (
                <Balanced className="content-page__lede">
                  {documentToReactComponents(page.lede.json)}
                </Balanced>
              )}
            </header>
            {document && <TableOfContents document={document} />}
            <div className="content-page__content">
              {documentToReactComponents(document, renderOptions)}
            </div>
          </>
        ) : (
          <Spinner large />
        )}
      </section>
    </div>
  );
};

export default Contentful;
