import { Box, Button, Dialog, Flex } from '@radix-ui/themes';
import { throttle } from 'lodash-es';
import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { cropAndResize } from './cropAndResize';
import { Rect } from './types';

import classes from './ImageUploader.module.css';

type Action =
  | {
      type: 'drag';
      top: number;
      left: number;
    }
  | ({
      type: 'set';
    } & Rect);

type CropModalProps = {
  file: File | null;
  width: number;
  height: number;
  onCropped: (blob: Blob) => void;
};

export const CropModal: React.FC<CropModalProps> = ({ file, width, height, onCropped }) => {
  const [open, setOpen] = useState(false);

  const [modalWidth, setModalWidth] = useState<number | undefined>(600);

  const preview = useRef<HTMLDivElement>(null);

  const image = useRef<HTMLImageElement>(null);

  const [[originalWidth, originalHeight], setOriginalSize] = useState([width, height]);

  const aspectRatio = width / height / (originalWidth / originalHeight);

  const [{ top, left, width: cropWidth, height: cropHeight }, dispatch] = useReducer(
    (state: Rect, action: Action) => {
      switch (action.type) {
        case 'drag':
          return { ...state, top: action.top, left: action.left };
        case 'set':
          return { top: action.top, left: action.left, width: action.width, height: action.height };
        default:
          return state;
      }
    },
    { top: 0.25, left: 0.25, width: 0.5, height: 0.5 }
  );

  useEffect(() => {
    if (file) {
      setOpen(true);
    }
  }, [file]);

  useLayoutEffect(() => {
    if (!image.current) return;

    setModalWidth(image.current.offsetWidth + 48);
  }, [originalWidth]);

  const src = useMemo(() => file && URL.createObjectURL(file), [file]);

  useEffect(() => {
    if (!src) return;
    const img = document.createElement('img');
    img.addEventListener('load', () => {
      setOriginalSize([img.width, img.height]);
      const scaledWidth =
        img.width / aspectRatio > img.height ? img.height * aspectRatio : img.width;
      const scaledHeight = scaledWidth / aspectRatio;
      dispatch({
        type: 'set',
        top: (img.height - scaledHeight) / 2 / img.height,
        left: (img.width - scaledWidth) / 2 / img.width,
        width: scaledWidth / img.width,
        height: scaledWidth / aspectRatio / img.width,
      });
    });
    img.src = src;
  }, [src, aspectRatio]);

  const onFramePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!preview.current) return;

    const { clientX, clientY } = event;
    const frameRect = event.currentTarget.getBoundingClientRect();
    const outerRect = preview.current.getBoundingClientRect();
    const offsetX = clientX - frameRect.left;
    const offsetY = clientY - frameRect.top;

    const move = throttle(
      (moveEvent: PointerEvent) => {
        const x = Math.max(
          0,
          Math.min(1 - cropWidth, (moveEvent.clientX - outerRect.left - offsetX) / outerRect.width)
        );
        const y = Math.max(
          0,
          Math.min(1 - cropHeight, (moveEvent.clientY - outerRect.top - offsetY) / outerRect.height)
        );
        dispatch({ type: 'drag', top: y, left: x });
      },
      25,
      { leading: true, trailing: true }
    );

    window.addEventListener('pointermove', move);
    window.addEventListener(
      'pointerup',
      () => {
        window.removeEventListener('pointermove', move);
      },
      { once: true }
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (!preview.current) return;

    const xEdge = event.currentTarget.dataset.x as 'left' | 'right';
    const yEdge = event.currentTarget.dataset.y as 'top' | 'bottom';

    const outerRect = preview.current.getBoundingClientRect();

    const x1 = left;
    const x2 = left + cropWidth;
    const y1 = top;
    const y2 = top + cropHeight;

    const move = throttle(
      (moveEvent: PointerEvent) => {
        const x = Math.max(0, Math.min(1, (moveEvent.clientX - outerRect.left) / outerRect.width));
        const y = Math.max(0, Math.min(1, (moveEvent.clientY - outerRect.top) / outerRect.height));

        const rect = {
          left: xEdge === 'left' ? x : x1,
          right: xEdge === 'right' ? x : x2,
          top: yEdge === 'top' ? y : y1,
          bottom: yEdge === 'bottom' ? y : y2,
        };

        dispatch({ type: 'set', ...closestConformingRect({ rect, aspectRatio, xEdge, yEdge }) });
      },
      25,
      { leading: true, trailing: true }
    );

    window.addEventListener('pointermove', move);
    window.addEventListener(
      'pointerup',
      () => {
        window.removeEventListener('pointermove', move);
      },
      { once: true }
    );
  };

  const confirm = () => {
    if (!file) return;

    const rect = {
      left: left * originalWidth,
      top: top * originalHeight,
      width: cropWidth * originalWidth,
      height: cropHeight * originalHeight,
    };

    cropAndResize(file, rect, width, height).then((blob) => {
      onCropped(blob);
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content className={classes.cropModal} width={`${modalWidth}px`} maxWidth="none">
        <Dialog.Title>Crop image</Dialog.Title>

        {src && (
          <Box
            ref={preview}
            className={classes.cropImage}
            style={
              {
                '--top': `${top * 100}%`,
                '--left': `${left * 100}%`,
                '--width': `${cropWidth * 100}%`,
                '--height': `${cropHeight * 100}%`,
              } as CSSProperties
            }
          >
            <img ref={image} src={src} className={classes.cropPreview} alt="Preview" />
            <div className={classes.cropOverlay} />
            <div className={classes.cropFrame} onPointerDown={onFramePointerDown}>
              <div
                className={classes.cropHandle}
                data-x="left"
                data-y="top"
                onPointerDown={handlePointerDown}
              />
              <div
                className={classes.cropHandle}
                data-x="left"
                data-y="bottom"
                onPointerDown={handlePointerDown}
              />
              <div
                className={classes.cropHandle}
                data-x="right"
                data-y="top"
                onPointerDown={handlePointerDown}
              />
              <div
                className={classes.cropHandle}
                data-x="right"
                data-y="bottom"
                onPointerDown={handlePointerDown}
              />
            </div>
          </Box>
        )}
        <Flex gap="3" className={classes.cropButtons}>
          <Button type="button" variant="outline" size="3" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="solid" size="3" onClick={confirm}>
            Crop and resize
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const closestConformingRect = ({
  rect: { top, left, right, bottom },
  aspectRatio,
  xEdge,
  yEdge,
}: {
  rect: { top: number; left: number; right: number; bottom: number };
  aspectRatio: number;
  xEdge: 'left' | 'right';
  yEdge: 'top' | 'bottom';
}) => {
  const rect = {
    left,
    top: yEdge === 'top' ? bottom - (right - left) / aspectRatio : top,
    right,
    bottom: yEdge === 'bottom' ? top + (right - left) / aspectRatio : bottom,
  };

  return {
    top: rect.top,
    left: rect.left,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  };
};
