import { UploadedFile } from '@/graphql/types';
import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import { useCallback, useState } from 'react';

export const useUpload = () => {
  const [uppy] = useState(() =>
    new Uppy().use(AwsS3, {
      companionUrl: '/',
    })
  );

  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    (file: File | Blob, name: string) =>
      new Promise<UploadedFile>((resolve, reject) => {
        setUploading(true);
        uppy.addFile({
          name,
          type: file.type,
          data: file,
        });

        uppy
          .upload()
          .then((response) => {
            const [successful] = response.successful;
            if (successful) {
              const data = {
                id: (successful.meta.key as string).replace('cache/', ''),
                size: successful.size,
                mimeType: successful.type || file.type,
                filename: successful.name,
              } satisfies UploadedFile;
              resolve(data);
            }
          })
          .catch(reject)
          .finally(() => setUploading(false));
      }),
    [uppy]
  );

  return { upload, uploading, uppy };
};
