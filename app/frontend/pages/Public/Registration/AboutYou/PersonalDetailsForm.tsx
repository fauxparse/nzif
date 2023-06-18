import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Section from '../Section';
import Checkbox from '@/atoms/Checkbox';
import Input from '@/atoms/Input';
import { useRegistrationStatusQuery } from '@/graphql/types';
import Labelled from '@/helpers/Labelled';
import Skeleton from '@/helpers/Skeleton';
import CountryPicker from '@/molecules/CountryPicker';

import ReadToEnd from './ReadToEnd';

const formSchema = z.object({
  name: z.string().regex(/^[^\s]+(\s+[^\s]+)+$/, 'We need your full (first and last) name'),
  email: z.string().email('This doesn’t look like an email address'),
  pronouns: z.string().optional(),
  city: z.string().min(1, 'Please tell us where you’re from'),
  country: z.string().min(1, 'Please tell us where you’re from'),
  phone: z
    .string()
    .regex(/^(\+?\d+([.\-\s]\s+)*)?$/, 'This doesn’t look like a phone number')
    .optional(),
  codeOfConductAccepted: z.boolean().refine((v) => v, 'You must accept the Code of Conduct'),
});

type FormSchemaType = z.infer<typeof formSchema>;

const PersonalDetailsForm: React.FC = () => {
  const { loading, data } = useRegistrationStatusQuery();

  const { festival, registration } = data || {};

  const [codeOfConductRead, setCodeOfConductRead] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: 'NZ',
    },
  });

  const { user, codeOfConductAcceptedAt } = registration || {};
  const { profile } = user || {};

  useEffect(() => {
    setValue('name', profile?.name || '');
    setValue('pronouns', profile?.pronouns || '');
    setValue('phone', profile?.phone || '');
    setValue('country', profile?.country?.id || 'NZ');
    setValue('email', user?.email || '');
    setValue('codeOfConductAccepted', !!codeOfConductAcceptedAt);
  }, [profile, user, codeOfConductAcceptedAt, setValue]);

  const onSubmit = () => console.log(getValues());

  return (
    <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
      <Section
        title="About you"
        description={
          <>
            Just so we know how to talk to (and about) you. To find out why we ask for this
            information, check out our{' '}
            <a href="/privacy" target="_blank">
              privacy policy
            </a>
            .
          </>
        }
        aside={
          <>
            <h4>Please give us your first and last name</h4>
            <p>
              No matter how unique your name might seem, we do need to be able to tell you apart
              from the other participants.
            </p>
          </>
        }
      >
        <Labelled label="Your name" name="name" errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input type="text" id="name" autoComplete="name" {...register('name')} />
          </Skeleton>
        </Labelled>
        <Labelled label="Your email address" name="email" errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input type="email" id="email" autoComplete="email" {...register('email')} />
          </Skeleton>
        </Labelled>
        <Labelled
          label="Your pronouns"
          name="pronouns"
          hint="e.g. she/her, he/him, they/them"
          errors={errors}
        >
          <Skeleton rounded loading={loading}>
            <Input type="text" id="pronouns" {...register('pronouns')} />
          </Skeleton>
        </Labelled>
        <Labelled label="City" name="city" errors={errors}>
          <Skeleton rounded loading={loading}>
            <Input type="text" id="city" autoComplete="address-level2" {...register('city')} />
          </Skeleton>
        </Labelled>
        <Labelled label="Country" name="country" errors={errors}>
          <input type="hidden" id="country" {...register('country')} />
          <Skeleton rounded loading={loading}>
            <CountryPicker
              value={getValues('country')}
              onChange={(country) => setValue('country', country)}
            />
          </Skeleton>
        </Labelled>
        <Labelled
          label="NZ phone number (optional)"
          name="phone"
          hint="So we can get in touch during the Festival"
          errors={errors}
        >
          <Skeleton rounded loading={loading}>
            <Input type="tel" id="phone" name="phone" autoComplete="tel" />
          </Skeleton>
        </Labelled>
      </Section>
      <Section
        className="code-of-conduct"
        title="Code of conduct"
        description={
          <>
            <p>
              We ask all our participants, team, and volunteers to adhere to our Festival Code of
              Conduct. Please read this carefully and make sure you’re familiar with it (even if
              you’ve been to NZIF before), as failure to abide by the Code may result in your being
              asked to leave the Festival.
            </p>
            <p>
              The most up-to-date version of the Code of Conduct is always available on this
              website.
            </p>
          </>
        }
      >
        <ReadToEnd onRead={() => setCodeOfConductRead(true)} />
        <label className="code-of-conduct__read">
          <Checkbox
            disabled={!codeOfConductRead || undefined}
            {...register('codeOfConductAccepted')}
          />
          <span>
            Yes, I have read the {festival?.id} NZIF Code of Conduct and agree to abide by it
            before, during, and after the Festival. I understand that failure to do so may result in
            my being restricted from participation in this and/or future Festivals.
          </span>
        </label>
      </Section>
    </form>
  );
};

export default PersonalDetailsForm;
