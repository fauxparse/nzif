import { HTMLMotionProps } from 'framer-motion';

export type DialogProps = HTMLMotionProps<'div'> & {
  open: boolean;
  modal?: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestClose?: () => Promise<boolean>;
};
