import FormError from '@/atoms/FormError';
import { PersonAttributes, useProfileQuery, useUpdatePersonMutation } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import PageHeader from '@/molecules/PageHeader';
import { PersonDetails } from '@/pages/Admin/People/Person/Person.types';
import Profile from '@/pages/Admin/People/Person/Profile';

type ErrorShape = {
  name?: string[];
};

export const Component: React.FC = () => {
  const { loading, data } = useProfileQuery();

  const profile = data?.user?.profile;

  const [updatePerson, { error }] = useUpdatePersonMutation();

  const handleRename = (name: string) => {
    if (!profile) return;

    updatePerson({
      variables: { id: profile.id, attributes: { name } as PersonAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePerson: {
          __typename: 'UpdatePersonPayload',
          profile: {
            ...profile,
            name,
          } as PersonDetails,
        },
      },
    });
  };

  const errors = (error?.graphQLErrors?.[0]?.extensions?.errors || {}) as ErrorShape;

  return (
    <div className="profile page">
      <PageHeader>
        <h1>
          {loading || !profile ? (
            <Skeleton text loading>
              Loading…
            </Skeleton>
          ) : (
            <InPlaceEdit value={profile.name} onChange={handleRename} />
          )}
        </h1>
        {errors?.name && (
          <FormError errors={{ name: { type: 'invalid', message: errors.name[0] } }} field="name" />
        )}
      </PageHeader>
      {profile && <Profile person={profile} showPermissions={false} />}
    </div>
  );
};

Component.displayName = 'ProfilePage';
