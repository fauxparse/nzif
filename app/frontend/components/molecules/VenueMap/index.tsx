import { useQuery } from '@apollo/client';
import { FragmentOf } from 'gql.tada';
import { groupBy, isElement, toPairs } from 'lodash-es';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MapVenueFragment, MapVenuesQuery } from './queries';

import { Outlet, useNavigate } from '@tanstack/react-router';
import classes from './VenueMap.module.css';

type Venue = FragmentOf<typeof MapVenueFragment>;

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || '';

type MapContext = {
  venue: Venue | null;
  setVenueId: (venueId: Venue['id'] | null) => void;
};

const MapContext = createContext<MapContext>({
  venue: null,
  setVenueId: () => {},
});

export const VenueMap = () => {
  const { data } = useQuery(MapVenuesQuery);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const [selectedId, setSelectedId] = useState<Venue['id'] | null>(null);

  const [loaded, setLoaded] = useState(false);

  const selected = useMemo(
    () => (selectedId && data?.festival.venues.find((venue) => venue.id === selectedId)) || null,
    [data, selectedId]
  );

  const venueData = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: data
          ? toPairs(groupBy(data.festival.venues, 'building')).map(([_, venues]) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [venues[0].longitude, venues[0].latitude] satisfies LngLatLike,
              },
              properties: venues,
            }))
          : [],
      }) satisfies GeoJSON.FeatureCollection,
    [data]
  );

  useEffect(() => {
    if (!container) return;

    container.innerHTML = '';

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/fauxparse/cjjnanljh3zak2rpbe8j62kxn',
      zoom: 16,
      center: [174.7858539802915, -41.2921901197085],
      trackResize: true,
    });

    map.on('load', () => {
      map.addSource('venues', { type: 'geojson', data: venueData });
      map.addControl(new mapboxgl.NavigationControl());

      for (const feature of venueData.features) {
        const el = document.createElement('div');
        el.id = `venue-${feature.properties[0].id}`;
        el.className = classes.marker;
        el.setAttribute('data-venue-id', feature.properties[0].id);
        new mapboxgl.Marker(el, { offset: [0, -16] })
          .setLngLat(feature.geometry.coordinates)
          .addTo(map);
      }

      setMap(map);
    });
    return () => setMap(null);
  }, [container, venueData]);

  const flyTo = useCallback(
    (venue: Venue) => {
      if (!map) return;

      map.flyTo({
        center: [venue.longitude, venue.latitude] satisfies LngLatLike,
        zoom: 18,
      });
    },
    [map]
  );

  const mapClicked = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isElement(e.target)) return;

      const target = e.target as HTMLElement;
      if (target.classList.contains(classes.marker)) {
        const venueId = target.getAttribute('data-venue-id');
        const venue = data?.festival.venues.find((venue) => venue.id === venueId);
        if (venue) {
          flyTo(venue);
          setSelectedId(venue.id);
        }
      }
    },
    [data, flyTo]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!map) return;

    if (!selected) {
      navigate({ to: '/venues', replace: true });
      return;
    }

    navigate({ to: '/venues/$id', params: { id: selected.id }, replace: true });

    const popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -48] })
      .setLngLat([selected.longitude, selected.latitude])
      .setHTML(`<h3>${selected.building}</h3><div>${selected.address}</>`)
      .addTo(map);

    flyTo(selected);

    return () => {
      popup.remove();
    };
  }, [selected, map, flyTo]);

  return (
    <MapContext.Provider value={{ venue: selected, setVenueId: setSelectedId }}>
      <div ref={setContainer} className={classes.map} onClick={mapClicked} />
      <Outlet />
    </MapContext.Provider>
  );
};

export const JumpTo: React.FC<{ venueId: Venue['id'] | null }> = ({ venueId }) => {
  const { setVenueId } = useContext(MapContext);

  useEffect(() => setVenueId(venueId), [venueId, setVenueId]);

  return null;
};
