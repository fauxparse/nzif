import { Spinner } from '@/components/atoms/Spinner';
import { useToast } from '@/components/molecules/Toast';
import {
  sessionKey,
  sessionPeriod,
} from '@/components/pages/Registration/Workshops/useWorkshopPreferences';
import CloseIcon from '@/icons/CloseIcon';
import CopyIcon from '@/icons/CopyIcon';
import { useQuery } from '@apollo/client';
import {
  Badge,
  Dialog,
  Flex,
  IconButton,
  Inset,
  Separator,
  Table,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { groupBy, sortBy, values } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { RegistrationDetailsQuery } from './queries';

type TableRow = {
  id: string;
  name: string;
  email: string;
  workshops: number;
  completedAt: DateTime | null;
};

type RegistrationDetailsProps = {
  registration: TableRow;
  onClose: () => void;
};

export const RegistrationDetails: React.FC<RegistrationDetailsProps> = ({
  registration,
  onClose,
}) => {
  const { loading, data } = useQuery(RegistrationDetailsQuery, {
    variables: { id: registration.id },
  });

  const grouped = useMemo(() => {
    if (!data) return [];

    return values(
      groupBy(
        sortBy(
          data.registration.preferences.flatMap((p) =>
            p.session.slots.map((s) => ({
              position: p.position,
              slot: sessionKey(s),
              date: s.startsAt.plus({}),
              period: sessionPeriod(s),
              name: p.session.activity?.name,
            }))
          ),
          ['date', 'position']
        ),
        'slot'
      )
    );
  }, [data]);

  const { notify } = useToast();

  const copyEmail = () => {
    navigator.clipboard.writeText(registration.email);
    notify({ description: 'Email copied to clipboard' });
  };

  return (
    <Dialog.Content>
      <Flex justify="between" align="start">
        <Flex direction="column">
          <Dialog.Title mb="0">{registration.name}</Dialog.Title>
          <Flex gap="2">
            <Text>{registration.email}</Text>
            <IconButton variant="ghost" radius="full" color="gray">
              <CopyIcon onClick={copyEmail} />
            </IconButton>
          </Flex>
        </Flex>
        <IconButton variant="ghost" radius="full" color="gray" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Flex>
      <VisuallyHidden>
        <Dialog.Description>Registration for {registration.name}</Dialog.Description>
      </VisuallyHidden>
      <Inset side="x">
        <Separator size="4" mt="4" mb="5" />
      </Inset>
      <Inset>
        {loading ? (
          <Flex justify="center" align="center" style={{ minHeight: '10rem' }}>
            <Spinner size="4" />
          </Flex>
        ) : (
          <Table.Root>
            <Table.Body>
              {grouped.map((group) => (
                <Table.Row key={group[0].slot}>
                  <Table.RowHeaderCell>
                    <Text>
                      {group[0].date.toFormat('EEE d')} ({group[0].period})
                    </Text>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <Flex direction="column" gap="2">
                      {group.map((g) => (
                        <Flex key={g.position} gap="2" align="baseline">
                          <Badge size="2">{g.position}</Badge>
                          <Text>{g.name}</Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Inset>
    </Dialog.Content>
  );
};
