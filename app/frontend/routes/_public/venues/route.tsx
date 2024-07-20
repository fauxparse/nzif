import { VenueMap } from '@/components/molecules/VenueMap';
import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

export const Route = createFileRoute('/_public/venues')({
  component: () => (
    <>
      <Helmet>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css" rel="stylesheet" />
      </Helmet>
      <VenueMap />
    </>
  ),
});
