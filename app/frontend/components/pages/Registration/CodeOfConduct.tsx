import { Checkbox } from '@/components/atoms/Checkbox';
import { Spinner } from '@/components/atoms/Spinner';
import { StaticPageQuery, renderOptions } from '@/components/pages/Static';
import { useRegistration } from '@/services/Registration';
import { useMutation, useQuery } from '@apollo/client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { ScrollArea, Text } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Buttons } from './Buttons';
import { AcceptCodeOfConductMutation } from './queries';

import staticClasses from '@/components/pages/Static/Static.module.css';
import classes from './Registration.module.css';

export const CodeOfConduct: React.FC = () => {
  const { loading, registration, goToNextStep } = useRegistration();

  const [readAll, setReadAll] = useState(false);

  const { isIntersecting, ref } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting) {
      setReadAll(true);
    }
  }, [isIntersecting]);

  const [busy, setBusy] = useState(false);

  const [update] = useMutation(AcceptCodeOfConductMutation);

  const form = useForm({
    defaultValues: {
      codeOfConductAcceptedAt: registration?.codeOfConductAcceptedAt ?? null,
      photoPermission: registration?.photoPermission ?? false,
    },
    onSubmit: async ({ value: { codeOfConductAcceptedAt, photoPermission } }) => {
      if (!codeOfConductAcceptedAt) return;

      setBusy(true);
      await update({ variables: { codeOfConductAcceptedAt, photoPermission } });
      setBusy(false);
      goToNextStep();
    },
  });

  const { loading: contentLoading, data } = useQuery(StaticPageQuery, {
    variables: { slug: 'code-of-conduct' },
    context: { clientName: 'contentful' },
  });

  const page = data?.pageCollection?.items?.[0] || null;

  const document: Document | undefined = page?.body?.json;

  return (
    <form
      className={classes.page}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className={classes.codeOfConduct}>
        <p>
          <Text size={{ initial: '3', md: '4' }}>
            We ask everyone coming to the Festival to agree to our Code of Conduct. This important
            document enables us to foster an atmosphere of community and make sure everyone has the
            very best time. Please read this carefully, as it changes from year to year.
          </Text>
        </p>

        <ScrollArea className={classes.scrollable} size="2" type="always" scrollbars="vertical">
          {contentLoading ? <Spinner className={classes.spinner} size="4" color="gray" /> : null}
          {document && (
            <div className={staticClasses.content}>
              {documentToReactComponents(document, renderOptions)}
              <div ref={ref} style={{ height: '1rem' }} />
            </div>
          )}
        </ScrollArea>

        <div className={classes.checkboxes}>
          {registration?.codeOfConductAcceptedAt ? (
            <label>
              <Checkbox size="3" checked disabled />
              <Text weight="medium">
                You agreed to the Code of Conduct on{' '}
                {registration.codeOfConductAcceptedAt.toLocaleString(DateTime.DATE_FULL)}
              </Text>
            </label>
          ) : (
            <form.Field name="codeOfConductAcceptedAt">
              {(field) => (
                <label>
                  <Checkbox
                    size="3"
                    disabled={!readAll}
                    checked={!!field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked ? DateTime.now() : null)
                    }
                  />
                  <Text weight="medium">I have read, and agree to, the NZIF Code of Conduct</Text>
                </label>
              )}
            </form.Field>
          )}
          <form.Field name="photoPermission">
            {(field) => (
              <label>
                <Checkbox
                  size="3"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Text>
                  I am happy for photos of me to be used by the Festival for future marketing or
                  promotion purposes (optional)
                </Text>
              </label>
            )}
          </form.Field>
        </div>
      </div>
      <form.Subscribe<boolean> selector={(state) => !!state.values.codeOfConductAcceptedAt}>
        {(canSubmit) => <Buttons disabled={!canSubmit} />}
      </form.Subscribe>
    </form>
  );
};
