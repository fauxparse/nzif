import { FieldPolicy } from '@apollo/client';
import { DateTime } from 'luxon';

export const dateTimePolicy: FieldPolicy<DateTime, string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    } else if (incoming instanceof DateTime) {
      return incoming;
    } else {
      return DateTime.fromISO(incoming as string, { zone: 'Pacific/Auckland' });
    }
  },
};

export const datePolicy: FieldPolicy<DateTime, string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    } else if (incoming instanceof DateTime) {
      return incoming.startOf('day');
    } else {
      return DateTime.fromISO(incoming as string).startOf('day');
    }
  },
};
