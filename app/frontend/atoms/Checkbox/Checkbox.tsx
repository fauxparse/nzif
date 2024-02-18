import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import Icon from '../Icon';
import Radio from '../Radio';

import { CheckboxProps } from './Checkbox.types';

import './Checkbox.css';

export const CheckboxIcon = () => (
  <Icon>
    <rect x={3} y={3} width={18} height={18} rx={2} />
    <path d="m7.5 12 3 3 6-6" pathLength={1} />
  </Icon>
);

const SUPPORTS_HAS_SELECTOR = CSS.supports('selector(:has(*))');

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, children = <CheckboxIcon />, preference, ...props }, ref) => {
    const ownRef = useRef<HTMLInputElement>(null);

    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (ownRef.current && indeterminate !== undefined) {
        ownRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    useEffect(() => {
      const el = ownRef.current;
      if (!el || SUPPORTS_HAS_SELECTOR) return;
      setChecked(el.checked);
      const changed = (e: Event) => {
        setChecked((e.target as HTMLInputElement).checked);
      };
      el.addEventListener('change', changed);
      return () => el.removeEventListener('change', changed);
    }, []);

    return (
      <Radio
        ref={mergeRefs([ref, ownRef])}
        type="checkbox"
        className={clsx('checkbox', className)}
        data-checked={SUPPORTS_HAS_SELECTOR || !checked ? undefined : true}
        preference={preference || undefined}
        {...props}
      >
        {children}
      </Radio>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
