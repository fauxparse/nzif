import { Money } from '@/components/atoms/Money';
import { DataMeter } from '@/components/molecules/DataMeter';
import { ActivityType } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { Button, Card, Flex, Skeleton, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import classes from './Dashboard.module.css';
import { DashboardQuery } from './queries';

export const Dashboard: React.FC = () => {
  const { loading, data } = useQuery(DashboardQuery);

  return (
    <div className={classes.dashboard}>
      <Card>
        <Flex direction="column" gap="2" align="stretch">
          <DataMeter
            loading={loading}
            title="Registrations"
            value={data?.dashboard?.registrations.current ?? 0}
            max={data?.dashboard?.registrations.max ?? 100}
            mb="-33%"
          />
          <Text size="9" weight="bold" align="center">
            <Skeleton loading={loading}>{data?.dashboard?.registrations.current ?? 0}</Skeleton>
          </Text>
          <Text size="6" weight="medium" align="center">
            <Skeleton loading={loading}>registrations</Skeleton>
          </Text>
          <Button asChild size={{ initial: '2', sm: '3' }}>
            <Link to="/admin/registrations">Registrations</Link>
          </Button>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" gap="2" align="stretch">
          <DataMeter
            loading={loading}
            title="Workshop places"
            value={data?.dashboard?.workshopPlaces.current ?? 0}
            max={data?.dashboard?.workshopPlaces.max ?? 100}
            mb="-33%"
          />
          <Text size="9" weight="bold" align="center">
            <Skeleton loading={loading}>{data?.dashboard?.workshopPlaces.current ?? 0}</Skeleton>
          </Text>
          <Text size="6" weight="medium" align="center">
            <Skeleton
              loading={loading}
            >{`of ${data?.dashboard?.workshopPlaces.max} workshop places`}</Skeleton>
          </Text>
          <Button asChild size={{ initial: '2', sm: '3' }}>
            <Link to="/admin/$activityType" params={{ activityType: ActivityType.Workshop }}>
              Workshops
            </Link>
          </Button>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" gap="2" align="stretch">
          <DataMeter
            loading={loading}
            title="Payments"
            value={data?.dashboard?.income.current ?? 0}
            max={data?.dashboard?.income.max ?? 100}
            mb="-33%"
          />
          <Text size="9" weight="bold" align="center">
            <Skeleton loading={loading}>
              <Money cents={data?.dashboard?.income.current ?? 0} />
            </Skeleton>
          </Text>
          <Text size="6" weight="medium" align="center">
            <Skeleton loading={loading}>
              of <Money cents={data?.dashboard?.income.max ?? 0} />
            </Skeleton>
          </Text>
          <Button asChild size={{ initial: '2', sm: '3' }}>
            <Link to="/admin/payments">Payments</Link>
          </Button>
        </Flex>
      </Card>
    </div>
  );
};
