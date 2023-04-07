import { FieldPolicy } from '@apollo/client';
import { Document } from '@contentful/rich-text-types';

export const richTextPolicy: FieldPolicy<Document, string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    } else if (incoming instanceof Document) {
      return incoming;
    } else {
      return JSON.parse(incoming as string) as Document;
    }
  },
};
