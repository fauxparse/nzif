import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { FestivalPresenter } from './types';

import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import classes from './People.module.css';

type PeopleProps = {
  people: FestivalPresenter[];
};

export const People: React.FC<PeopleProps> = ({ people }) => (
  <>
    <Header title="People" />
    <Body>
      <section className={classes.section}>
        <div className={classes.people}>
          {people.map((person) => (
            <Card key={person.id} size="1" asChild>
              <Link to="/people/$id" params={{ id: person.id }}>
                <Flex gap="3" align="center">
                  <Avatar
                    size="3"
                    src={person.picture?.medium}
                    radius="full"
                    fallback={person.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join('')}
                  />
                  <Text truncate>{person.name}</Text>
                </Flex>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </Body>
  </>
);
