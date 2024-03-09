import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Container } from '@mantine/core';
import Header from '@/components/organisms/Header';
import { PluralActivityType } from '@/constants/activityTypes';
import Body from '@/components/organisms/Body';
import ActivityTypeTabs, { tabSwitchDirection } from '@/components/molecules/ActivityTypeTabs';
import { usePrevious } from '@mantine/hooks';
import RouteTransition from '@/components/helpers/RouteTransition';

const Component = () => {
  const params = Route.useParams();
  const plural = params.activityType as PluralActivityType;
  const navigate = useNavigate();
  const activityType = params.activityType as PluralActivityType;
  const previousActivityType = usePrevious(activityType);
  const direction = tabSwitchDirection(previousActivityType, activityType);

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
        <RouteTransition direction={direction} routeKey={plural} />
      </Body>
    </Container>
  );
};

export const Route = createFileRoute('/_public/$activityType/_list')({
  component: Component,
});
