import Navigation from '@/components/Navigation';
import { createFileRoute } from '@tanstack/react-router';

import './_public.css';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { useTitle } from '@/hooks/useRoutesWithTitles';
import RouteTransition from '@/components/RouteTransition';

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
});
