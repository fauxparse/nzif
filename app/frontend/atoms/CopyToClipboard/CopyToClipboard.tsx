import clsx from 'clsx';
import React, { ElementType, forwardRef } from 'react';

import { useToaster } from '@/molecules/Toaster';
import Ghost from '../../pages/Admin/Festival/Timetable/Grid/Ghost';
import Button, { ButtonSize, ButtonVariant } from '../Button';

import { CopyToClipboardProps } from './CopyToClipboard.types';

import './CopyToClipboard.css';

export const CopyToClipboard = forwardRef<HTMLButtonElement, CopyToClipboardProps>(
  ({ className, text, onClick }, ref) => {
    const { notify } = useToaster();

    const clicked = (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        navigator.clipboard.writeText(text);
        notify('Copied!');
      } catch (e) {
        notify('Couldn’t copy to clipboard');
      }
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        small
        ghost
        className={clsx('copy-to-clipboard', className)}
        icon="clipboard"
        onClick={clicked}
      />
    );
  }
);

CopyToClipboard.displayName = 'CopyToClipboard';

export default CopyToClipboard;
