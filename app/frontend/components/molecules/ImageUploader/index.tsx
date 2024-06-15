import { UploadedFile } from '@/graphql/types';
import { ActionIcon, Box, BoxProps, Button, Divider, Text } from '@mantine/core';
import { isString, uniqueId } from 'lodash-es';
import { CSSProperties, ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import { acceptedBy } from './acceptedBy';
import { useUpload } from './useUpload';

import './ImageUploader.css';
import ImageIcon from '@/icons/ImageIcon';
import clsx from 'clsx';
import { CropModal } from './CropModal';

type ImageUploaderProps = BoxProps & {
  value: string | UploadedFile | null;
  accept?: ComponentProps<'input'>['accept'];
  width?: number;
  height?: number;
  compact?: boolean;
  onChange: (uploaded: UploadedFile) => void;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  className,
  value,
  accept = 'image/*',
  width,
  height,
  compact,
  onChange,
}) => {
  const { upload, uploading, uppy } = useUpload();

  const id = useMemo(() => uniqueId('image-uploader-'), []);

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  const [src, setSrc] = useState<string | null>(null);

  const [fileToResize, setFileToResize] = useState<File | null>(null);

  useEffect(() => {
    if (!value) setSrc(null);
    if (isString(value)) setSrc(value);
  }, [value]);

  const dragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
        setFileToResize(file);
      }
    },
    [accept, upload]
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

  const cropped = (blob: Blob) => {
    const name = fileToResize?.name || 'image.jpg';
    setSrc(URL.createObjectURL(blob));
    upload(blob, name).then((value) => {
      onChange(value);
      setFileToResize(null);
    });
  };

  return (
    <Box className={clsx('image-uploader', className)} __vars={{ '--aspect-ratio': aspectRatio }}>
      {src && (
        <img
          className="image-uploader__preview"
          alt="Image preview"
          src={src}
          style={{ '--progress': uploading ? `${percentage / 100}` : 1 } as CSSProperties}
        />
      )}
      <Box className="image-uploader__target" onDragOver={dragOver} onDrop={drop}>
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={(e) => {
            const [file] = e.currentTarget.files || [];
            setFileToResize(file);
          }}
        />
        {compact ? (
          <ActionIcon component="label" variant="transparent" data-color="neutral" htmlFor={id}>
            <ImageIcon />
          </ActionIcon>
        ) : (
          <>
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
          </>
        )}
      </Box>
      {width && height && (
        <CropModal file={fileToResize} width={width} height={height} onCropped={cropped} />
      )}
    </Box>
  );
};
