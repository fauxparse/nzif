import {
  PersonAttributes,
  useCreatePersonMutation,
  usePersonSearchLazyQuery,
} from '@/graphql/types';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';

const usePresenters = () => {
  const [createPresenter] = useCreatePersonMutation();

  const [searchPresenters] = usePersonSearchLazyQuery();

  const handleSearchPresenters = (query: string) =>
    searchPresenters({ variables: { query } }).then(({ data }) =>
      (data?.search || []).flatMap((result) => ('person' in result ? [result.person] : []))
    );

  const handleCreatePresenter = ({ id, name, ...rest }: Profile) =>
    new Promise<Profile>((resolve) => {
      createPresenter({
        variables: {
          attributes: { name } as PersonAttributes,
        },
      }).then(({ data }) => {
        if (data?.createPerson?.profile) {
          const profile = { ...data.createPerson.profile, ...rest } as Profile;
          resolve(profile);
        }
      });
    });

  return { handleSearchPresenters, handleCreatePresenter };
};

export default usePresenters;
