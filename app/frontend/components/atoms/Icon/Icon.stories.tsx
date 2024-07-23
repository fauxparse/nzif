import { StoryDefault } from '@ladle/react';
import { Card, Flex, Grid, Tooltip } from '@radix-ui/themes';
import React from 'react';
import { IconProps } from '.';

const icons = await Promise.all(
  Object.entries(import.meta.glob('@/icons/**/*', { import: 'default' })).map(
    async ([path, importer]) => {
      const name = path.split('/').pop()?.split('.')[0] as string;
      const component = (await importer()) as React.FC<IconProps>;
      return { name, component };
    }
  )
);

export const Icon = () => {
  return (
    <Grid columns="repeat(auto-fit, minmax(6rem, 1fr)" gap="2">
      {icons.map(({ name, component }) => (
        <IconWell key={name} name={name} icon={component} />
      ))}
    </Grid>
  );
};

const IconWell: React.FC<{ name: string; icon: React.FC<IconProps> }> = ({
  name,
  icon: Component,
}) => {
  if (name === 'CheckboxIcon' || name === 'ActivityIcon') return null;

  return (
    <Tooltip content={name}>
      <Card key={name} size="3" onClick={() => navigator.clipboard.writeText(`<${name} />`)}>
        <Flex align="stretch" style={{ aspectRatio: 1, justifyContent: 'stretch' }}>
          <Component style={{ width: 'auto', height: 'auto', flex: 1 }} />
        </Flex>
      </Card>
    </Tooltip>
  );
};

export default {
  title: 'Atoms',
} satisfies StoryDefault;
