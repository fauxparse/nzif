import { UploadedFile } from '@/graphql/types';
import { Box, Button, Divider, Text } from '@mantine/core';
import { isString, uniqueId } from 'lodash-es';
import { CSSProperties, ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import { acceptedBy } from './acceptedBy';
import { useUpload } from './useUpload';

import './ImageUploader.css';

type ImageUploaderProps = {
  value: string | UploadedFile | null;
  accept?: ComponentProps<'input'>['accept'];
  width?: number;
  height?: number;
  onChange: (uploaded: UploadedFile) => void;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  accept = 'image/*',
  width,
  height,
  onChange,
}) => {
  const { upload, uploading, uppy } = useUpload();

  const id = useMemo(() => uniqueId('image-uploader-'), []);

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!value) setSrc(null);
    if (isString(value)) setSrc(value);
  }, [value]);

  const dragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const updatePreview = useCallback((file: File) => {
    if (!window.FileReader) return;

    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => setSrc(fileReader.result as string));
    fileReader.readAsDataURL(file);
  }, []);

  const drop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const [file] = (
        event.dataTransfer.items
          ? Array.from(event.dataTransfer.items).map((item) => item.getAsFile())
          : Array.from(event.dataTransfer.files)
      ).filter(Boolean) as File[];

      if (file && acceptedBy(accept, file)) {
        updatePreview(file);
        upload(file).then(onChange);
      }
    },
    [accept, upload, updatePreview]
  );

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    uppy
      .on('upload', () => {
        setPercentage(0);
      })
      .on('upload-progress', (_, { bytesUploaded, bytesTotal }) =>
        setPercentage(Math.ceil((bytesUploaded * 100) / (bytesTotal || 1)))
      )
      .on('upload-success', (_, response) => {
        setPercentage(100);
      })
      .on('upload-error', (_, error) => {
        // TODO: Handle error
      });
  }, [uppy]);

  return (
    <Box className="image-uploader" __vars={{ '--aspect-ratio': aspectRatio }}>
      {src && (
        <img
          className="image-uploader__preview"
          alt="Image preview"
          src={src}
          style={{ '--progress': uploading ? `${percentage / 100}` : 1 } as CSSProperties}
        />
      )}
      <Box className="image-uploader__target" onDragOver={dragOver} onDrop={drop}>
        <input type="file" id={id} accept={accept} />
        <Text>
          Drag and drop a file to upload
          {!!width && !!height && (
            <>
              <br />
              {`(ideally ${width}×${height} in JPEG format)`}
            </>
          )}
        </Text>
        <Divider label="OR" labelPosition="center" />
        <Button component="label" htmlFor={id} variant="outline">
          Browse for an image
        </Button>
      </Box>
    </Box>
  );
};
