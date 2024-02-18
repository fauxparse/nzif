import { FieldPolicy } from '@apollo/client';
import { Document } from '@contentful/rich-text-types';

export const richTextPolicy: FieldPolicy<Document, string> = {
  // biome-ignore lint/suspicious/noExplicitAny: we don't care about the types here
  merge: (_, incoming: any) => {
    if (incoming === null || incoming === undefined) {
      return incoming;
    }
    if (incoming instanceof Document) {
      return incoming;
    }
    return JSON.parse(incoming as string) as Document;
  },
};
