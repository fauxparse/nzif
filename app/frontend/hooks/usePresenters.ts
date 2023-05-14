import {
  ProfileAttributes,
  useCreateProfileMutation,
  usePersonSearchLazyQuery,
} from '@/graphql/types';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';

const usePresenters = () => {
  const [createPresenter] = useCreateProfileMutation();

  const [searchPresenters] = usePersonSearchLazyQuery();

  const handleSearchPresenters = (query: string) =>
    searchPresenters({ variables: { query } }).then(({ data }) =>
      (data?.search || []).flatMap((result) => ('person' in result ? [result.person] : []))
    );

  const handleCreatePresenter = ({ id, name, ...rest }: Profile) =>
    new Promise<Profile>((resolve) => {
      createPresenter({
        variables: {
          attributes: { name } as ProfileAttributes,
        },
      }).then(({ data }) => {
        if (data?.createProfile?.profile) {
          const profile = { ...data.createProfile.profile, ...rest } as Profile;
          resolve(profile);
        }
      });
    });

  return { handleSearchPresenters, handleCreatePresenter };
};

export default usePresenters;
