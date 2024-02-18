import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import useCodeOfConduct from './useCodeOfConduct';

type ReadToEndProps = {
  onRead: () => void;
};

const ReadToEnd: React.FC<ReadToEndProps> = ({ onRead }) => {
  const { loading, document: cocDocument } = useCodeOfConduct();

  const [endOfDocument, setEndOfDocument] = useState<HTMLDivElement | null>(null);

  const [read, setRead] = useState(false);

  useEffect(() => {
    if (loading || read || !endOfDocument) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      setRead(true);
      onRead();
    });
    intersectionObserver.observe(endOfDocument);

    return () => intersectionObserver.disconnect();
  }, [loading, read, endOfDocument, onRead]);

  return (
    <div className="read-to-end">
      <div className="content-page__content">{cocDocument}</div>
      <div className="end-of-page" ref={setEndOfDocument} aria-label="End of document" />
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
