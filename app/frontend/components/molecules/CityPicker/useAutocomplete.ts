import { deburr, uniqBy } from 'lodash-es';
import { useCallback, useRef, useState } from 'react';
import { SearchableOption } from './types';

type Feature = {
  properties: {
    city: string;
    state_code: string;
    country: string;
    country_code: string;
    place_id: string;
  };
};

export const useAutocomplete = () => {
  const controller = useRef<AbortController | null>(null);

  const [busy, setBusy] = useState(false);

  const autocomplete = useCallback(
    (query: string) =>
      new Promise<SearchableOption[]>((resolve) => {
        controller.current?.abort('stale');
        controller.current = new AbortController();

        const { signal } = controller.current;

        setBusy(true);

        const searchParams = new URLSearchParams({
          apiKey: 'afd987582e814d77a443c944d7cb27aa',
          text: query,
          type: 'city',
          lang: 'en',
        });
        const url = new URL(
          `https://api.geoapify.com/v1/geocode/autocomplete?${searchParams.toString()}`
        );
        fetch(url, { signal })
          .then(async (response) => {
            const json: { features: Feature[] } = await response.json();
            resolve(
              uniqBy(
                json.features.map(({ properties }) => ({
                  id: properties.place_id,
                  name:
                    properties.country_code === 'us'
                      ? `${properties.city}, ${properties.state_code}`
                      : properties.city,
                  traditionalNames: [],
                  country: properties.country,
                  search: deburr(properties.city),
                })),
                ({ name, country }) => `${name}:${country}`
              )
            );
          })
          .catch((e) => void 0)
          .finally(() => setBusy(false));
      }),
    []
  );

  return { autocomplete, busy };
};
