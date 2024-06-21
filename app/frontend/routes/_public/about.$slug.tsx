import StaticPage, { StaticPageQuery } from '@/components/pages/Static';
import { ContentPageQueryResult } from '@/contentful/types';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/about/$slug')({
  component: () => {
    const data = Route.useLoaderData() as NonNullable<ContentPageQueryResult['data']>;
    const page = data.pageCollection?.items?.[0] || null;

    return page && <StaticPage page={page} />;
  },
  loader: async ({ params: { slug }, context: { client } }) => {
    const { data } = await client.query({
      query: StaticPageQuery,
      variables: { slug },
      context: { clientName: 'contentful' },
    });

    if (!data) throw notFound();

    return data;
  },
});
