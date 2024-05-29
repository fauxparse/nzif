import RouteTransition from '@/components/helpers/RouteTransition';
import Footer from '@/components/organisms/Footer';
import Navigation from '@/components/organisms/Navigation';
import { useTitle } from '@/hooks/useRoutesWithTitles';
import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

import '@/styles/new/public.css';

export const Route = createFileRoute('/_public')({
  component: () => {
    const title = useTitle();

    return (
      <div className="layout">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Navigation className="layout__navigation" />
        <main className="layout__main">
          <RouteTransition />
        </main>
        <Footer className="layout__footer" />
      </div>
    );
  },
  notFoundComponent: () => <h1>not found</h1>,
});
