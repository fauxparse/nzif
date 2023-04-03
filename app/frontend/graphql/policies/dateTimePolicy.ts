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
      return DateTime.fromISO(incoming as string);
    }
  },
};
