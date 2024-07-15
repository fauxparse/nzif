import { cache } from '@/graphql';
import { PlacenamesProvider } from '@/services/Placenames';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { StoryDefault } from '@ladle/react';
import { MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { CityPicker } from './';

const MOCKS = [
  {
    request: {
      query: gql`
        query Cities {
          cities {
            id
            name
            traditionalNames
            country
          }
        }
      `,
      variables: {},
    },
    result: {
      data: {
        cities: [
          {
            id: 'nzXLQr',
            name: 'Wellington',
            traditionalNames: ['Te Whanganui-a-Tara', 'Pōneke'],
            country: 'NZ',
          },
          {
            id: 'xkE6kX',
            name: 'Auckland',
            traditionalNames: ['Tāmaki Makaurau'],
            country: 'NZ',
          },
          {
            id: 'k5XvNX',
            name: 'Christchurch',
            traditionalNames: ['Ōtautahi'],
            country: 'NZ',
          },
          {
            id: 'GY4gvr',
            name: 'Dunedin',
            traditionalNames: ['Ōtepoti'],
            country: 'NZ',
          },
          {
            id: 'Ma42z4',
            name: 'Hamilton',
            traditionalNames: ['Kirikiriroa'],
            country: 'NZ',
          },
          {
            id: 'jzXkDr',
            name: 'Nelson',
            traditionalNames: ['Whakatū'],
            country: 'NZ',
          },
          {
            id: '7PrK6X',
            name: 'Gisborne',
            traditionalNames: ['Ahuriri'],
            country: 'NZ',
          },
          {
            id: 'RBXmRr',
            name: 'Palmerston North',
            traditionalNames: ['Te Papaioea'],
            country: 'NZ',
          },
          {
            id: 'Dwr1Qr',
            name: 'New Plymouth',
            traditionalNames: ['Ngā Motu'],
            country: 'NZ',
          },
          {
            id: 'zMEbkX',
            name: 'Melbourne',
            traditionalNames: ['Naarm'],
            country: 'AU',
          },
          {
            id: 'P7XRor',
            name: 'Brisbane',
            traditionalNames: ['Meanjin'],
            country: 'AU',
          },
          {
            id: '6nX5k4',
            name: 'Sydney',
            traditionalNames: ['Eora'],
            country: 'AU',
          },
          {
            id: 'Q2E3WE',
            name: 'Adelaide',
            traditionalNames: ['Tandanya'],
            country: 'AU',
          },
          {
            id: 'WD4Ym4',
            name: 'Canberra',
            traditionalNames: ['Ngambra'],
            country: 'AU',
          },
          {
            id: '1WXj7r',
            name: 'New York',
            traditionalNames: ['Lanapehoking'],
            country: 'US',
          },
        ],
      },
    },
  },
] as const;

const CityPickerStory = () => {
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  return (
    <MantineProvider>
      <MockedProvider mocks={MOCKS} cache={cache}>
        <PlacenamesProvider>
          <CityPicker
            city={city}
            country={country}
            placeholder="Select a city"
            onChange={(city, country) => {
              setCity(city);
              setCountry(country);
            }}
          />
        </PlacenamesProvider>
      </MockedProvider>
    </MantineProvider>
  );
};

export { CityPickerStory as CityPicker };

export default {
  title: 'Molecules',
} satisfies StoryDefault;
