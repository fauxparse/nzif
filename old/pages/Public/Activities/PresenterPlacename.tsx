import { Maybe } from 'graphql/jsutils/Maybe';

import Placename from '@/atoms/Placename';

type Place = {
  id: string;
  name: string;
  traditionalName: Maybe<string>;
};

type PresenterPlacenameProps = {
  city: Maybe<Place>;
  country: Maybe<Place>;
};

const toSentence = (list: (string | null | undefined)[]) => list.filter(Boolean).join(', ');

const PresenterPlacename = ({ city, country }: PresenterPlacenameProps) => {
  const local = (!!city && country?.id === 'NZ') || country?.id === 'AU';

  if (!city && !country) return null;

  return (
    <Placename
      key={city?.id || country?.id}
      name={(local && city?.name) || toSentence([city?.name, country?.name])}
      traditionalName={
        (local && city?.traditionalName) ||
        toSentence([city?.traditionalName, country?.traditionalName || country?.name])
      }
    />
  );
};

export default PresenterPlacename;
