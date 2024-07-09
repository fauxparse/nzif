import { size } from '@ladle/helpers/size';
import type { Story, StoryDefault } from '@ladle/react';
import { Badge, Box, Button, Card, CardProps, Flex, Group, Image, Text } from '@mantine/core';

type CardStoryProps = CardProps & {};

const CardStory: Story<CardStoryProps> = ({ shadow, ...props }) => (
  <Flex direction="column" align="start">
    <Card shadow={shadow === '(none)' ? undefined : shadow} w="20rem" {...props}>
      <Card.Section inheritPadding>
        <Group justify="space-between" mt="md" mb="md">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge size="sm">On Sale</Badge>
        </Group>
      </Card.Section>

      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Text size="sm" c="dimmed" mt="md">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and
        activities on and around the fjords of Norway
      </Text>

      <Card.Section>
        <Box p="md">
          <Button variant="filled" fullWidth mt="md" data-color="primary">
            Book classic tour now
          </Button>
        </Box>
      </Card.Section>
    </Card>
  </Flex>
);

export { CardStory as Card };

export default {
  title: 'Organisms',
  args: {
    padding: 'lg',
    radius: 'md',
    shadow: 'sm',
    withBorder: true,
  },
  argTypes: {
    padding: size,
    radius: size,
    shadow: {
      ...size,
      options: ['(none)', ...size.options],
    },
    withBorder: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault;
