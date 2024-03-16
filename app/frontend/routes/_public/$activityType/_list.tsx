import RouteTransition from '@/components/helpers/RouteTransition';
import ActivityTypeTabs, { tabSwitchDirection } from '@/components/molecules/ActivityTypeTabs';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import type { PluralActivityType } from '@/constants/activityTypes';
import { Container } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';

const Component = () => {
  const params = Route.useParams();
  const plural = params.activityType as PluralActivityType;
  const navigate = useNavigate();
  // const activityType = params.activityType as PluralActivityType;
  // const previousActivityType = usePrevious(activityType);
  // const direction = tabSwitchDirection(previousActivityType, activityType);

  return (
    <Container>
      <Header
        title="Festival programme"
        tabs={
          <ActivityTypeTabs
            value={plural}
            onChange={(value) => {
              if (!value) return;
              navigate({ to: '/$activityType', params: { activityType: value } });
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
