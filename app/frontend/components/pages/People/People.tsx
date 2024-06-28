import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import useFestival from '@/hooks/useFestival';
import { Avatar, Box, Card, Image, Text, Title } from '@mantine/core';
import { FestivalPresenter } from './types';

import { Link } from '@tanstack/react-router';
import classes from './People.module.css';

type PeopleProps = {
  people: FestivalPresenter[];
};

export const People: React.FC<PeopleProps> = ({ people }) => {
  const festival = useFestival();
  return (
    <>
      <Header title="People" />
      <Body>
        <section className={classes.section}>
          <Title order={2}>Presenters and performers at NZIF {festival.id}</Title>
          <div className={classes.people}>
            {people.map((person) => (
              <Card
                className={classes.person}
                key={person.id}
                component={Link}
                to="/people/$id"
                params={{ id: person.id }}
                shadow="sm"
                withBorder
              >
                <Card.Section>
                  {person.picture ? (
                    <Image
                      className={classes.portrait}
                      src={person.picture.medium}
                      alt={person.name}
                    />
                  ) : (
                    <Box className={classes.portraitPlaceholder}>
                      <Avatar size={100}>
                        {person.name
                          .split(/\s+/)
                          .map((w) => w[0])
                          .join('')}
                      </Avatar>
                    </Box>
                  )}
                </Card.Section>
                <Text className={classes.personName}>{person.name}</Text>
              </Card>
            ))}
          </div>
        </section>
      </Body>
    </>
  );
};
