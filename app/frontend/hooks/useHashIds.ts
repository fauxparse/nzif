import { useMemo } from 'react';
import Hashids from 'hashids';

const useHashIds = (salt: string) =>
  useMemo(
    () => new Hashids(salt, 6, 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789'),
    [salt]
  );

export default useHashIds;
