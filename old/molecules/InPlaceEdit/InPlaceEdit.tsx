import { useInterpret, useSelector } from '@xstate/react';
import clsx from 'clsx';
import React, { ElementType, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { isPromiseLike } from 'xstate/lib/utils';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import AutoResize from '@/helpers/AutoResize';

import { InPlaceEditComponent } from './InPlaceEdit.types';
import InPlaceEditMachine from './InPlaceEditMachine';

import './InPlaceEdit.css';

export const InPlaceEdit: InPlaceEditComponent = forwardRef(
  ({ as, className, value, placeholder, onChange, onFocus, onBlur, onKeyDown, ...props }, ref) => {
    const Component = (as || 'input') as ElementType;

    const inputRef = useRef<HTMLElement>(null);

    const machine = useInterpret(InPlaceEditMachine, {
      services: {
        confirm: (_, event) => {
          const result = onChange(event.value);
          return isPromiseLike(result) ? result : Promise.resolve(event.value);
        },
      },
      actions: {
        resetValue: () => null,
      },
    });

    const state = useSelector(machine, (state) => state);

    const editing = state.matches('editing');

    const focus = (e: React.FocusEvent) => {
      (e.currentTarget as HTMLInputElement).select?.();
      onFocus?.(e);
    };

    const blur = (e: React.FocusEvent) => {
      machine.send('CONFIRM', { value: (e.currentTarget as HTMLInputElement).value });
      onBlur?.(e);
    };

    const keyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          machine.send('CANCEL');
          break;
        case 'Enter':
          e.preventDefault();
          machine.send('CONFIRM', { value: (e.currentTarget as HTMLInputElement).value });
          break;
      }
      onKeyDown?.(e);
    };

    return (
      <div
        className="in-place-edit__wrapper"
        data-editing={editing || undefined}
        data-saving={state.matches('confirming') || undefined}
      >
        {editing ? (
          <AutoResize>
            <Input
              as={Component}
              ref={mergeRefs([ref, inputRef])}
              className={clsx('in-place-edit', className)}
              autoFocus
              defaultValue={value}
              onFocus={focus}
              onBlur={blur}
              onKeyDown={keyDown}
              {...props}
            />
          </AutoResize>
        ) : (
          <>
            {value ? (
              <div className="in-place-edit__value">{value}</div>
            ) : (
              placeholder && <div className="in-place-edit__placeholder">{placeholder}</div>
            )}
            <Button
              ghost
              icon="edit"
              className="in-place-edit__toggle"
              onClick={() => machine.send('EDIT')}
              aria-label="Edit"
            />
          </>
        )}
      </div>
    );
  }
);

InPlaceEdit.displayName = 'InPlaceEdit';

export default InPlaceEdit;
