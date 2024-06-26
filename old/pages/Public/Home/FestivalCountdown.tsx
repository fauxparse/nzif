import { DateTime } from 'luxon';

import Countdown from '@/atoms/Countdown';
import { CurrentFestivalQuery, RegistrationPhase, useCurrentFestivalQuery } from '@/graphql/types';

const TITLES: Record<RegistrationPhase, string> = {
  [RegistrationPhase.Pending]: 'Registrations open in',
  [RegistrationPhase.Earlybird]: 'Earlybird registrations close in',
  [RegistrationPhase.Paused]: 'General registrations open in',
  [RegistrationPhase.General]: 'NZIF 2023 starts in',
  [RegistrationPhase.Closed]: 'NZIF 2023 ends in',
};

const TARGETS: Record<RegistrationPhase, keyof CurrentFestivalQuery['festival']> = {
  [RegistrationPhase.Pending]: 'earlybirdOpensAt',
  [RegistrationPhase.Earlybird]: 'earlybirdClosesAt',
  [RegistrationPhase.Paused]: 'generalOpensAt',
  [RegistrationPhase.General]: 'startDate',
  [RegistrationPhase.Closed]: 'endDate',
};

const FestivalCountdown: React.FC = () => {
  const { data } = useCurrentFestivalQuery();
  const festival = data?.festival;

  const registrationPhase = festival?.registrationPhase || RegistrationPhase.Closed;

  if (!festival) return null;

  return (
    <Countdown
      to={festival[TARGETS[registrationPhase]] as DateTime}
      title={TITLES[registrationPhase]}
    />
  );
};
export default FestivalCountdown;
