import { DateTime } from 'luxon';

export const formatSessionTime = (session: { startsAt: DateTime; endsAt: DateTime }) => {
  const { startsAt, endsAt } = session;
  const straddles = Math.floor(startsAt.hour / 12) !== Math.floor(endsAt.hour / 12);
  const startTime = startsAt.toFormat(
    `h${startsAt.minute === 0 ? '' : ':mm'}${straddles ? 'a' : ''}`
  );
  const endTime = endsAt.toFormat(`h${endsAt.minute === 0 ? '' : ':mm'}a`);
  return `${startTime} – ${endTime}`;
};
