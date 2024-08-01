import { UploadedFile } from '@/graphql/types';
import ImageIcon from '@/icons/ImageIcon';
import { Box, BoxProps, Button, IconButton, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { isString, uniqueId } from 'lodash-es';
import { CSSProperties, ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import { CropModal } from './CropModal';
import { acceptedBy } from './acceptedBy';
import { useUpload } from './useUpload';

import classes from './ImageUploader.module.css';

type ImageUploaderProps = Omit<BoxProps, 'onChange'> & {
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
    <Box
      className={clsx(classes.root, className)}
      style={{ '--aspect-ratio': aspectRatio } as CSSProperties}
    >
      {src && (
        <img
          className={classes.preview}
          alt="Image preview"
          src={src}
          style={{ '--progress': uploading ? `${percentage / 100}` : 1 } as CSSProperties}
        />
      )}
      <Box className={classes.target} onDragOver={dragOver} onDrop={drop}>
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
          <IconButton asChild variant="ghost" color="gray">
            <label htmlFor={id}>
              <ImageIcon />
            </label>
          </IconButton>
        ) : (
          <>
            <Text as="p">
              Drag and drop a file to upload
              {!!width && !!height && (
                <>
                  <br />
                  {`(ideally ${width}×${height} in JPEG format)`}
                </>
              )}
            </Text>
            {/* <Divider label="OR" labelPosition="center" /> */}
            <Button asChild variant="outline">
              <label htmlFor={id}>Browse for an image</label>
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
