import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { ContentPageQueryResult } from '@/contentful/types';
import { useFestival } from '@/hooks/useFestival';
import { gql } from '@apollo/client';
import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, INLINES, Text } from '@contentful/rich-text-types';
import { Heading, Link } from '@radix-ui/themes';
import { deburr, kebabCase } from 'lodash-es';
import Balanced from 'react-balanced';
import { Helmet } from 'react-helmet-async';
import TableOfContents from './TableOfContents';

import classes from './Static.module.css';

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

export const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return (
        <Heading as="h2" size="8" mt="8" mb="4" id={kebabCase(deburr(text))}>
          {text}
        </Heading>
      );
    },
    [BLOCKS.HEADING_3]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return (
        <Heading as="h3" size="7" mt="6" mb="4" id={kebabCase(deburr(text))}>
          {text}
        </Heading>
      );
    },
    [BLOCKS.HEADING_4]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return (
        <Heading as="h4" size="5" mt="4" mb="4" id={kebabCase(deburr(text))}>
          {text}
        </Heading>
      );
    },
    [INLINES.HYPERLINK]: (node) => {
      const text = (node.content.filter(isTextNode) as Text[]).map((n) => n.value).join();
      return <Link href={node.data.uri}>{text}</Link>;
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
    <>
      <Helmet>
        <title>
          {page.title} for NZIF {festival.id}
        </title>
      </Helmet>
      <Header title={page.title}>
        {page?.lede && (
          <Balanced className={classes.lede}>{documentToReactComponents(page.lede.json)}</Balanced>
        )}
      </Header>
      <Body>
        <div className={classes.page}>
          {document && (
            <>
              <TableOfContents document={document} />
              <div className={classes.content}>
                {documentToReactComponents(document, renderOptions)}
              </div>
            </>
          )}
        </div>
      </Body>
    </>
  );
};

export default StaticPage;
