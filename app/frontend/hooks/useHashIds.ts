import Hashids from 'hashids';
import { useMemo } from 'react';

const useHashIds = (salt: string) =>
  useMemo(
    () => new Hashids(salt, 6, 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789'),
    [salt]
  );

export default useHashIds;
