import { Rect } from './types';

export const cropAndResize = (file: File, rect: Rect, width: number, height: number) =>
  new Promise<Blob>((resolve, reject) => {
    const img = new Image();

    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', String(width));
      canvas.setAttribute('height', String(height));

      const context = canvas.getContext('2d');
      if (!context) throw new Error('Cannot get 2d context');

      const scale = width / rect.width;

      createImageBitmap(img, {
        resizeWidth: img.width * scale,
        resizeHeight: img.height * scale,
        resizeQuality: 'high',
      }).then((bitmap) => {
        context.drawImage(
          bitmap,
          rect.left * scale,
          rect.top * scale,
          rect.width * scale,
          rect.height * scale,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject();
            }
          },
          'image/jpeg',
          1
        );
      });
    });
    img.src = URL.createObjectURL(file);
  });
