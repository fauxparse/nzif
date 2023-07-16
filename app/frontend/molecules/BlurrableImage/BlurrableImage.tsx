import React, { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import clsx from 'clsx';
import { useIntersectionObserver } from 'usehooks-ts';

import './BlurrableImage.css';

type BlurrableImageProps = ComponentPropsWithoutRef<'img'> & {
  blurhash: string;
};

const BlurrableImage: React.FC<BlurrableImageProps> = ({ className, blurhash, src, ...props }) => {
  const container = useRef<HTMLDivElement | null>(null);

  const { isIntersecting = false } = useIntersectionObserver(container, {}) ?? {};

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible((current) => current || isIntersecting);
  }, [isIntersecting]);

  const addLoadHandler = (img: HTMLImageElement) => {
    if (!img) return;

    img.addEventListener('load', () => {
      img.classList.add('blurrable-image__image--loaded');
    });
  };

  return (
    <div className={clsx('blurrable-image', className)} ref={container}>
      {blurhash && (
        <Blurhash
          className="blurrable-image__blurred"
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={240}
          resolutionY={135}
          punch={1}
        />
      )}
      {visible && (
        <img ref={addLoadHandler} className="blurrable-image__image" src={src} {...props} />
      )}
    </div>
  );
};

export default BlurrableImage;
