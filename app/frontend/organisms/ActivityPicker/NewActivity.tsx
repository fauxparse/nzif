import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { camelCase, deburr, kebabCase } from 'lodash-es';
import { z } from 'zod';

import Button from '@/atoms/Button';
import FormError from '@/atoms/FormError';
import { IconName } from '@/atoms/Icon';
import Input from '@/atoms/Input';
import { Activity, ActivityType } from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import InputGroup from '@/molecules/InputGroup';
import Popover, { usePopoverContext } from '@/molecules/Popover';
import activityTypeLabel from '@/util/activityTypeLabel';

type NewActivityForm = HTMLFormElement & {
  name: HTMLTextAreaElement;
  slug: HTMLInputElement;
};

const formSchema = z.object({
  name: z.string().nonempty('Activity name can’t be blank'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

type FormSchemaType = z.infer<typeof formSchema>;

type NewActivityProps = {
  activityType: ActivityType;
  defaultName?: string;
  onBack: () => void;
  onCreate: (attributes: Pick<Activity, 'name' | 'slug'>) => void;
};

export const NewActivity: React.FC<NewActivityProps> = ({
  activityType,
  defaultName = '',
  onBack,
  onCreate,
}) => {
  const { setOpen } = usePopoverContext();

  const slugCustomised = useRef(false);

  const form = useRef<NewActivityForm>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const nameChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (slugCustomised.current || !form.current) return;
    const { value } = e.currentTarget;
    setValue('slug', kebabCase(deburr(value)).substring(0, 32));
  };

  const nameKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const slugChanged = () => {
    slugCustomised.current = true;
  };

  useEffect(() => {
    const name = form.current?.name;
    if (!name) return;
    const timeout = setTimeout(() => name.focus(), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <header className="activity-picker__header">
        <Button ghost icon="arrowLeft" onClick={onBack} />
        <h3 className="popover__title">New {activityTypeLabel(activityType)}</h3>
        <Popover.Close />
      </header>
      <form ref={form} onSubmit={handleSubmit(onCreate)}>
        <fieldset>
          <div className="validated-field">
            <InputGroup>
              <InputGroup.Icon name={camelCase(activityType) as IconName} />
              <AutoResize>
                <Input
                  as="textarea"
                  placeholder={`${activityType} name`}
                  onInput={nameChanged}
                  onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => e.currentTarget.focus()}
                  onKeyDown={nameKeyDown}
                  {...register('name')}
                />
              </AutoResize>
            </InputGroup>
            <FormError errors={errors} field="name" />
          </div>
          <div className="validated-field">
            <InputGroup>
              <InputGroup.Icon name="link" />
              <Input
                type="text"
                placeholder="Short name"
                onInput={slugChanged}
                {...register('slug')}
              />
            </InputGroup>
            <FormError errors={errors} field="slug" />
          </div>
          <InputGroup disabled>
            <InputGroup.Icon name="user" />
            <Input placeholder="Tutor" />
          </InputGroup>
          <div className="buttons">
            <Button ghost text="Cancel" onClick={() => setOpen(false)} />
            <Button primary icon="check" text="Save" type="submit" />
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default NewActivity;
