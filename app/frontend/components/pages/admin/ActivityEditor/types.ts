import { TimetableActivityFragment } from '@/components/organisms/TimetableEditor/queries';
import { ActivityType, UploadedFile } from '@/graphql/types';
import { FragmentOf, ResultOf } from 'gql.tada';
import { ActivityDetailsQuery, PresenterDetailsFragment, WorkshopShowFragment } from './queries';

export type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;

export type Session = Activity['sessions'][number];

export type Tab =
  | 'details'
  | { session: Session }
  | { show: FragmentOf<typeof WorkshopShowFragment>['sessions'][number] }
  | 'feedback';

export type Presenter = FragmentOf<typeof PresenterDetailsFragment>;

export type ActivityDetails = Pick<Activity, 'name' | 'type' | 'slug' | 'description'> & {
  presenters: Array<Presenter>;
  attachedActivityId: string | null;
  bookingLink: string | null;
};

export type AttachedActivity = FragmentOf<typeof TimetableActivityFragment>;

export type Workshop = Extract<Activity, { tutors: Presenter[] }>;
export type Show = Extract<Activity, { directors: Presenter[] }>;

export const isWorkshop = (activity: Activity): activity is Workshop =>
  activity.type === ActivityType.Workshop;
export const isShow = (activity: Activity): activity is Show => activity.type === ActivityType.Show;

export type WithUploadedPicture<T> = T & {
  uploadedPicture: UploadedFile | null;
  pictureAltText: string;
};

export const isSessionTab = (tab: Tab): tab is { session: Session } =>
  typeof tab === 'object' && 'session' in tab;

export const isShowTab = (
  tab: Tab
): tab is { show: FragmentOf<typeof WorkshopShowFragment>['sessions'][number] } =>
  typeof tab === 'object' && 'show' in tab;

export const isFeedbackTab = (tab: Tab): tab is 'feedback' => tab === 'feedback';

export const isDetailsTab = (tab: Tab): tab is 'details' => tab === 'details';
