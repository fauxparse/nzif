import BlurrableImage from '@/components/molecules/BlurrableImage';
import { useQuery } from '@apollo/client';
import {
  AspectRatio,
  Badge,
  Button,
  Callout,
  Dialog,
  Flex,
  Grid,
  Heading,
  IconButton,
  Inset,
  ScrollArea,
  Separator,
  Skeleton,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { WorkshopDetailsQuery } from './queries';
import { Workshop } from './types';

import Placename from '@/components/atoms/Placename';
import Markdown from '@/helpers/Markdown';
import ClockIcon from '@/icons/ClockIcon';
import CloseIcon from '@/icons/CloseIcon';
import ShowIcon from '@/icons/ShowIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import ordinalize from '@/util/ordinalize';
import sentence from '@/util/sentence';
import { randParagraph } from '@ngneat/falso';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import { usePreferences } from './WorkshopPreferencesProvider';
import classes from './Workshops.module.css';

type WorkshopDetailsProps = {
  workshop: Workshop;
  session: Workshop['sessions'][number] | null;
  open: boolean;
  onClose: () => void;
};

export const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({
  workshop,
  session: requestedSession,
  open,
  onClose,
}) => {
  const { loading, data } = useQuery(WorkshopDetailsQuery, { variables: { slug: workshop.slug } });

  const session = requestedSession || workshop.sessions[0];

  const { getPosition, getSession, add, remove } = usePreferences();

  const activity = data?.festival.activity;

  const position = session ? getPosition(session) : null;

  const cities = useMemo(
    () => uniqBy(map(workshop.presenters, 'city').filter(Boolean), 'id'),
    [workshop.presenters]
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Content size={{ initial: '2', md: '4' }} aria-describedby={undefined}>
        <VisuallyHidden>
          <Dialog.Title>{workshop.name}</Dialog.Title>
        </VisuallyHidden>

        <Grid className={classes.workshopDetails}>
          <Inset className={classes.header}>
            <AspectRatio ratio={16 / 9}>
              <BlurrableImage
                src={data?.festival.activity?.picture?.large ?? workshop.picture?.medium}
                blurhash={workshop.picture?.blurhash ?? ''}
                alt={workshop.picture?.altText ?? ''}
              />
            </AspectRatio>
          </Inset>

          <Inset className={classes.title}>
            <Heading as="h2" size={{ initial: '6', md: '8' }}>
              {workshop.name}
            </Heading>
            <Flex wrap="wrap" gap="2" align="center">
              <Text size="5">{sentence(map(workshop.presenters, 'name'))}</Text>
              {cities.map((city) => city && <Placename key={city.id} city={city} />)}
            </Flex>
            <Text as="div" size="4">
              {session.startsAt.plus({}).toFormat('EEEE d MMMM')}, {formatSessionTime(session)}
            </Text>
          </Inset>

          <IconButton
            variant="ghost"
            size="3"
            radius="full"
            color="gray"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Inset className={classes.body} side="x">
            <ScrollArea className={classes.scrollable}>
              {session.slots.length > 1 && (
                <Callout.Root size="2" mt="4">
                  <Callout.Icon>
                    <ClockIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    This is an all-day workshop, taught in two slots. As such, you will be charged
                    as if it were two workshops.
                  </Callout.Text>
                </Callout.Root>
              )}

              {workshop.show && (
                <Callout.Root size="2" color="crimson" mt="4">
                  <Callout.Icon>
                    <ShowIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    Participants in this workshop may be invited to perform in the show{' '}
                    <b>{workshop.show.name}</b>. Casting is not guaranteed and is at the discretion
                    of the show director.
                  </Callout.Text>
                </Callout.Root>
              )}

              {loading ? (
                <Text size={{ initial: '3', md: '4' }}>
                  <Skeleton loading>{randParagraph()}</Skeleton>
                </Text>
              ) : (
                <Text asChild size={{ initial: '3', md: '4' }}>
                  <Markdown>{String(activity?.description || '')}</Markdown>
                </Text>
              )}
            </ScrollArea>
          </Inset>
          {session && (
            <>
              <Inset side="x">
                <Separator size="4" />
              </Inset>
              <Flex
                gap="3"
                className={classes.actions}
                direction={{ initial: 'column', md: 'row' }}
                justify="between"
              >
                <Flex gap="2" align="center">
                  {position && (
                    <>
                      <Badge radius="full" variant="solid" size="3">
                        {position}
                      </Badge>
                      <Text>{ordinalize(position)} choice for this session</Text>
                    </>
                  )}
                </Flex>
                <Button
                  size={{ initial: '2', md: '3' }}
                  onClick={() => {
                    (position ? remove : add)({ ...session, workshop });
                    onClose();
                  }}
                >
                  {position ? 'Remove' : 'Add'} this workshop
                </Button>
              </Flex>
            </>
          )}
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};
