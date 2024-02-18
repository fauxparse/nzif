import { FieldPolicy } from '@apollo/client';
import { DateTime } from 'luxon';

export const dateTimePolicy: FieldPolicy<DateTime, string> = {
  // biome-ignore lint/suspicious/noExplicitAny:
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    }
    if (incoming instanceof DateTime) {
      return incoming;
    }
    return DateTime.fromISO(incoming as string, { zone: 'Pacific/Auckland' });
  },
};

export const datePolicy: FieldPolicy<DateTime, string> = {
  // biome-ignore lint/suspicious/noExplicitAny:
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    }
    if (incoming instanceof DateTime) {
      return incoming.startOf('day');
    }
    return DateTime.fromISO(incoming as string).startOf('day');
  },
};
