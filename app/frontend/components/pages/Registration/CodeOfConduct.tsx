import { Checkbox } from '@/components/atoms/Checkbox';
import { Spinner } from '@/components/atoms/Spinner';
import { StaticPageQuery, renderOptions } from '@/components/pages/Static';
import { useRegistration } from '@/services/Registration';
import { useMutation, useQuery } from '@apollo/client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Inset,
  Link as RadixLink,
  ScrollArea,
  Section,
  Separator,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { Link, useChildMatches, useNavigate } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Buttons } from './Buttons';
import { AcceptCodeOfConductMutation } from './queries';

import staticClasses from '@/components/pages/Static/Static.module.css';
import clsx from 'clsx';
import classes from './Registration.module.css';

export const CodeOfConduct: React.FC = () => {
  const childMatches = useChildMatches();

  const showMediaPolicy = !!childMatches.some((match) => match.id.endsWith('media'));

  const navigate = useNavigate();

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
      className={clsx(classes.page, classes.codeOfConduct)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Section maxWidth="40em" pb="6">
        <Heading as="h1" size="6">
          Code of conduct
        </Heading>
        <p>
          <Text size={{ initial: '3', md: '4' }}>
            We ask everyone coming to the Festival to agree to our Code of Conduct. This important
            document enables us to foster an atmosphere of community and make sure everyone has the
            very best time. Please read this carefully, as it changes from year to year.
          </Text>
        </p>
      </Section>

      <Separator size="4" mb="6" />

      {contentLoading ? <Spinner className={classes.spinner} size="4" color="gray" /> : null}
      {document && (
        <div className={staticClasses.content}>
          {documentToReactComponents(document, renderOptions)}
          <div ref={ref} style={{ height: '1rem' }} />
        </div>
      )}

      <Card size="3" className={classes.checkboxes}>
        <form.Field name="codeOfConductAcceptedAt">
          {(field) => (
            <label>
              <Checkbox
                size="3"
                disabled={!readAll || !!registration?.codeOfConductAcceptedAt}
                checked={!!registration?.codeOfConductAcceptedAt || !!field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked ? DateTime.now() : null)}
              />
              <Text weight="medium">I have read, and agree to, the NZIF Code of Conduct</Text>
            </label>
          )}
        </form.Field>
        <form.Field name="photoPermission">
          {(field) => (
            <label>
              <Checkbox
                size="3"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <Text>
                I am happy for photos and videos of me to be used by the Festival for future
                marketing or promotion purposes, as per the Festival’s{' '}
                <RadixLink asChild>
                  <Link to="/register/code-of-conduct/media" replace>
                    media and advertising policy
                  </Link>
                </RadixLink>
                .
              </Text>
            </label>
          )}
        </form.Field>
      </Card>
      <form.Subscribe<boolean> selector={(state) => !!state.values.codeOfConductAcceptedAt}>
        {(canSubmit) => <Buttons disabled={!canSubmit} />}
      </form.Subscribe>
      <MediaPolicy
        open={showMediaPolicy}
        onAgree={() => form.setFieldValue('photoPermission', true)}
        onClose={() => navigate({ to: '/register/code-of-conduct', replace: true })}
      />
    </form>
  );
};

const MediaPolicy: React.FC<{ open: boolean; onClose: () => void; onAgree: () => void }> = ({
  open,
  onClose,
  onAgree,
}) => {
  const { loading: contentLoading, data } = useQuery(StaticPageQuery, {
    variables: { slug: 'media-consent' },
    context: { clientName: 'contentful' },
  });

  const page = data?.pageCollection?.items?.[0] || null;

  const document: Document | undefined = page?.body?.json;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Content size="4" maxWidth="60rem">
        <Dialog.Title>Media and advertising policy</Dialog.Title>

        <VisuallyHidden>
          <Dialog.Description>Our policy on the use of photography and video.</Dialog.Description>
        </VisuallyHidden>

        <Inset side="x">
          <Box asChild maxHeight="50vh">
            <ScrollArea size="2" type="always" scrollbars="vertical">
              {contentLoading ? (
                <Spinner className={classes.spinner} size="4" color="gray" />
              ) : null}
              {document && (
                <Box className={staticClasses.content} px="6">
                  {documentToReactComponents(document, renderOptions)}
                </Box>
              )}
            </ScrollArea>
          </Box>
        </Inset>

        <Flex justify="end" gap="2" mt="4">
          <Button size="3" type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            size="3"
            type="button"
            onClick={() => {
              onAgree();
              onClose();
            }}
          >
            I agree
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
