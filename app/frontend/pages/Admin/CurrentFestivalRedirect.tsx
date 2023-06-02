import { Navigate } from 'react-router-dom';

import { useCurrentFestivalQuery } from '@/graphql/types';

const CurrentFestivalRedirect: React.FC = () => {
  const { loading, data } = useCurrentFestivalQuery();

  if (loading || !data?.festival) return null;

  return <Navigate to={`/admin/${data.festival.id}`} replace={true} />;
};

export default CurrentFestivalRedirect;
