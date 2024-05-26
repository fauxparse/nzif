import { Button, Group } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  component: () => (
    <div style={{ padding: '100px' }}>
      <Group gap="lg">
        <Button variant="default">Hello</Button>
        <Button variant="filled" data-color="default">
          Hello
        </Button>
        <Button variant="filled">Hello</Button>
        <Button variant="light">Hello</Button>
        <Button variant="outline">Hello</Button>
        <Button variant="subtle">Hello</Button>
        <Button variant="transparent">Hello</Button>
        <Button variant="white">Hello</Button>
      </Group>
    </div>
  ),
});
