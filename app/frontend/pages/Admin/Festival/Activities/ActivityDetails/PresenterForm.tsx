import { AdminActivityDetailsFragment } from '@/graphql/types';
import Profile from '@/pages/Admin/People/Person/Profile';

type PresenterFormProps = {
  presenter: AdminActivityDetailsFragment['presenters'][number];
};

const PresenterForm: React.FC<PresenterFormProps> = ({ presenter }) => {
  return (
    <Profile
      person={presenter}
      showPermissions={false}
      saveLabel={`Save ${presenter.name.split(/\s+/)[0]}`}
    />
  );
};

export default PresenterForm;
