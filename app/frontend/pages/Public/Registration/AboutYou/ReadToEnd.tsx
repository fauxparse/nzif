import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { motion } from 'framer-motion';

import { useContentPageQuery } from '@/contentful/types';

type ReadToEndProps = {
  onRead: () => void;
};

const ReadToEnd: React.FC<ReadToEndProps> = ({ onRead }) => {
  const { data: codeOfConduct } = useContentPageQuery({
    variables: { slug: 'code-of-conduct' },
    context: { clientName: 'contentful' },
  });

  const cocDocument: Document | undefined = codeOfConduct?.pageCollection?.items?.[0]?.body?.json;

  const [endOfDocument, setEndOfDocument] = useState<HTMLDivElement | null>(null);

  const [read, setRead] = useState(false);

  useEffect(() => {
    if (read || !endOfDocument) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      setRead(true);
      onRead();
    });
    intersectionObserver.observe(endOfDocument);

    return () => intersectionObserver.disconnect();
  }, [read, endOfDocument, onRead]);

  return (
    <div className="read-to-end">
      <div className="content-page__content">
        {cocDocument && documentToReactComponents(cocDocument)}
      </div>
      <div className="end-of-page" ref={setEndOfDocument} />
      <motion.div
        className="read-to-end__instructions"
        animate={read ? 'read' : 'unread'}
        variants={{ read: { y: '100%', opacity: 0 }, unread: { y: 0, opacity: 1 } }}
      >
        <p>Please read to the end before continuing.</p>
      </motion.div>
    </div>
  );
};

export default ReadToEnd;
