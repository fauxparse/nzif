import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { ContentPageQueryResult } from '@/contentful/types';
import useFestival from '@/hooks/useFestival';
import { gql } from '@apollo/client';
import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, Text } from '@contentful/rich-text-types';
import { Container } from '@mantine/core';
import { deburr, kebabCase } from 'lodash-es';
import { Helmet } from 'react-helmet-async';

import Balanced from 'react-balanced';
import './Static.css';
import TableOfContents from './TableOfContents';

export const StaticPageQuery = gql`
  query ContentPage($slug: String!) {
    pageCollection(where: {slug: $slug}, limit: 1) {
      items {
        slug
        title
        lede {
          json
        }
        body {
          json
        }
      }
    }
  }
`;

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

type StaticPageProps = {
  page: NonNullable<
    NonNullable<NonNullable<ContentPageQueryResult['data']>['pageCollection']>['items'][number]
  >;
};

const StaticPage: React.FC<StaticPageProps> = ({ page }) => {
  const festival = useFestival();

  const document: Document | undefined = page?.body?.json;

  return (
    <Container>
      <Helmet>
        <title>
          {page.title} for NZIF {festival.id}
        </title>
      </Helmet>
      <Header title={page.title}>
        {page?.lede && (
          <Balanced className="static-page__lede">
            {documentToReactComponents(page.lede.json)}
          </Balanced>
        )}
      </Header>
      <Body>
        <div className="static-page">
          {document && (
            <>
              <TableOfContents document={document} />
              <div className="static-page__content">
                {documentToReactComponents(document, renderOptions)}
              </div>
            </>
          )}
        </div>
      </Body>
    </Container>
  );
};

export default StaticPage;
