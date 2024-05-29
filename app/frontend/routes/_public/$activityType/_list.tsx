import ActivityTypeTabs from '@/components/molecules/ActivityTypeTabs';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { pluralFromActivityType } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { Container } from '@mantine/core';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';

const Component = () => {
  const activityType = Route.useParams().activityType as ActivityType;
  const navigate = useNavigate();

  return (
    <Container>
      <Header
        title="Festival programme"
        tabs={
          <ActivityTypeTabs
            value={activityType}
            onChange={(value) => {
              if (!value) return;
              navigate({
                to: '/$activityType',
                params: { activityType: pluralFromActivityType(value) },
              });
            }}
          />
        }
      />
      <Body>
        <Outlet />
      </Body>
    </Container>
  );
};

export const Route = createFileRoute('/_public/$activityType/_list')({
  component: Component,
  pendingComponent: () => <div style={{ height: '100vh' }} />,
});
