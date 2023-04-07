import React from 'react';
import { useParams } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { useContentPageQuery } from '../../contentful/types';

const Contentful: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { loading, data, error } = useContentPageQuery({
    variables: { slug },
    context: { clientName: 'contentful' },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const json = data?.pageCollection?.items?.[0]?.body?.json ?? null;

  return (json && <>{documentToReactComponents(json)}</>) || null;
};

export default Contentful;
