import { Venue } from '@/graphql/types';

export const mapLink = ({ building, address }: Pick<Venue, 'building' | 'address'>) => {
  const url = new URL('https://maps.google.com/');
  url.searchParams.set(
    'q',
    [building, address, 'Wellington', 'New Zealand'].filter(Boolean).join(', ')
  );
  return url.toString();
};
