import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

import { useContentPageQuery } from '@/contentful/types';

const useCodeOfConduct = () => {
  const { loading, data: codeOfConduct } = useContentPageQuery({
    variables: { slug: 'code-of-conduct' },
    context: { clientName: 'contentful' },
  });

  const document: Document | undefined = codeOfConduct?.pageCollection?.items?.[0]?.body?.json;

  return { loading, document: document && documentToReactComponents(document) };
};

export default useCodeOfConduct;
