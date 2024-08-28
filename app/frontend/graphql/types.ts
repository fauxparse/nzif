/* eslint-disable */
import { DateTime } from 'luxon';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Country: string;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: DateTime;
  ISODate: DateTime;
  Money: number;
  Upload: File;
};

export type Activity = {
  bookingLink: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  missingInfo: Array<Scalars['String']>;
  name: Scalars['String'];
  picture: Maybe<ActivityPicture>;
  presenters: Array<Person>;
  sessions: Array<Session>;
  slug: Scalars['String'];
  type: ActivityType;
};

export type ActivityAttributes = {
  attachedActivityId: InputMaybe<Scalars['ID']>;
  bookingLink: InputMaybe<Scalars['String']>;
  description: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  picture: InputMaybe<Scalars['Upload']>;
  pictureAltText: InputMaybe<Scalars['String']>;
  profileIds: InputMaybe<Array<Scalars['ID']>>;
  slug: InputMaybe<Scalars['String']>;
  suitability: InputMaybe<Scalars['String']>;
  uploadedPicture: InputMaybe<UploadedFile>;
};

export type ActivityCount = {
  __typename: 'ActivityCount';
  count: Scalars['Int'];
  id: ActivityType;
};

export type ActivityPicture = {
  __typename: 'ActivityPicture';
  altText: Maybe<Scalars['String']>;
  blurhash: Scalars['String'];
  id: Scalars['ID'];
  /** 1920x1080 */
  large: Scalars['String'];
  /** 1280x720 */
  medium: Scalars['String'];
  /** 480x270 */
  small: Scalars['String'];
  /** 48x27 */
  tiny: Scalars['String'];
};

export type ActivityResult = SearchResult & {
  __typename: 'ActivityResult';
  activity: Activity;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export enum ActivityType {
  /** Conference */
  Conference = 'Conference',
  /** Show */
  Show = 'Show',
  /** SocialEvent */
  SocialEvent = 'SocialEvent',
  /** Workshop */
  Workshop = 'Workshop'
}

/** Autogenerated return type of AddPayment. */
export type AddPaymentPayload = {
  __typename: 'AddPaymentPayload';
  payment: Payment;
};

/** Autogenerated return type of AddPreference. */
export type AddPreferencePayload = {
  __typename: 'AddPreferencePayload';
  preference: Preference;
};

/** Autogenerated return type of AddSessionCast. */
export type AddSessionCastPayload = {
  __typename: 'AddSessionCastPayload';
  cast: Person;
};

/** Autogenerated return type of AddToSession. */
export type AddToSessionPayload = {
  __typename: 'AddToSessionPayload';
  registration: Registration;
  session: Session;
};

/** Autogenerated return type of AddToWaitlist. */
export type AddToWaitlistPayload = {
  __typename: 'AddToWaitlistPayload';
  waitlist: Waitlist;
};

/** Autogenerated return type of AddVoucher. */
export type AddVoucherPayload = {
  __typename: 'AddVoucherPayload';
  voucher: Voucher;
};

export type Appearance = {
  __typename: 'Appearance';
  activity: Activity;
  id: Scalars['ID'];
  role: Role;
  sessions: Array<Session>;
};

/** Autogenerated return type of ApprovePayment. */
export type ApprovePaymentPayload = {
  __typename: 'ApprovePaymentPayload';
  payment: Payment;
};

export type Balance = {
  __typename: 'Balance';
  id: Scalars['ID'];
  paid: Scalars['Money'];
  total: Scalars['Money'];
};

export type BooleanSetting = Setting & {
  __typename: 'BooleanSetting';
  description: Scalars['String'];
  id: Scalars['String'];
  value: Scalars['Boolean'];
};

export type CalendarSession = {
  __typename: 'CalendarSession';
  hidden: Scalars['Boolean'];
  id: Scalars['ID'];
  session: Session;
  waitlisted: Scalars['Boolean'];
};

/** Autogenerated return type of CancelPayment. */
export type CancelPaymentPayload = {
  __typename: 'CancelPaymentPayload';
  payment: Payment;
};

export type Cart = {
  __typename: 'Cart';
  discount: Scalars['Money'];
  id: Scalars['ID'];
  outstanding: Scalars['Money'];
  paid: Scalars['Money'];
  total: Scalars['Money'];
  value: Scalars['Money'];
  workshopsCount: Scalars['Int'];
};

export type City = {
  __typename: 'City';
  country: Scalars['Country'];
  id: Scalars['ID'];
  name: Scalars['String'];
  traditionalNames: Array<Scalars['String']>;
};

export type CityAttributes = {
  country: Scalars['String'];
  name: Scalars['String'];
  traditionalNames: InputMaybe<Array<Scalars['String']>>;
};

export type Conference = Activity & {
  __typename: 'Conference';
  bookingLink: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  missingInfo: Array<Scalars['String']>;
  name: Scalars['String'];
  picture: Maybe<ActivityPicture>;
  presenters: Array<Person>;
  sessions: Array<Session>;
  slug: Scalars['String'];
  /** Speakers */
  speakers: Array<Person>;
  type: ActivityType;
};

/** Autogenerated return type of CreateActivity. */
export type CreateActivityPayload = {
  __typename: 'CreateActivityPayload';
  activity: Activity;
  session: Maybe<Session>;
};

/** Autogenerated return type of CreateDonation. */
export type CreateDonationPayload = {
  __typename: 'CreateDonationPayload';
  donation: Donation;
  paymentIntentSecret: Scalars['String'];
};

/** Autogenerated return type of CreateMultipleSessions. */
export type CreateMultipleSessionsPayload = {
  __typename: 'CreateMultipleSessionsPayload';
  sessions: Array<Session>;
};

/** Autogenerated return type of CreatePerson. */
export type CreatePersonPayload = {
  __typename: 'CreatePersonPayload';
  profile: Person;
};

/** Autogenerated return type of CreateSession. */
export type CreateSessionPayload = {
  __typename: 'CreateSessionPayload';
  session: Session;
};

/** Autogenerated return type of CreateTranslation. */
export type CreateTranslationPayload = {
  __typename: 'CreateTranslationPayload';
  translation: Translation;
};

export type Credential = {
  __typename: 'Credential';
  accessToken: Scalars['String'];
  client: Scalars['String'];
  expiry: Scalars['Int'];
  tokenType: Scalars['String'];
  uid: Scalars['String'];
};

export type CreditCardPayment = Payment & {
  __typename: 'CreditCardPayment';
  amount: Scalars['Money'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  reference: Scalars['String'];
  registration: Registration;
  state: PaymentState;
};

/** Autogenerated return type of DemoteSessionParticipant. */
export type DemoteSessionParticipantPayload = {
  __typename: 'DemoteSessionParticipantPayload';
  session: Session;
};

export type Donation = {
  __typename: 'Donation';
  amount: Scalars['Money'];
  anonymous: Scalars['Boolean'];
  email: Scalars['String'];
  id: Scalars['ID'];
  message: Maybe<Scalars['String']>;
  name: Scalars['String'];
  newsletter: Scalars['Boolean'];
};

export type Feedback = {
  __typename: 'Feedback';
  constructive: Scalars['String'];
  id: Scalars['ID'];
  positive: Scalars['String'];
  rating: Maybe<Scalars['Int']>;
  registration: Registration;
  session: Session;
  testimonial: Scalars['String'];
};

export type FeedbackAttributes = {
  constructive: InputMaybe<Scalars['String']>;
  positive: InputMaybe<Scalars['String']>;
  rating: InputMaybe<Scalars['Int']>;
  testimonial: InputMaybe<Scalars['String']>;
};

export type Festival = {
  __typename: 'Festival';
  activities: Array<Activity>;
  activity: Maybe<Activity>;
  activityCounts: Array<ActivityCount>;
  balance: Balance;
  earlybirdClosesAt: Maybe<Scalars['ISO8601DateTime']>;
  earlybirdOpensAt: Maybe<Scalars['ISO8601DateTime']>;
  endDate: Scalars['ISODate'];
  generalOpensAt: Maybe<Scalars['ISO8601DateTime']>;
  id: Scalars['ID'];
  payments: Maybe<Array<Payment>>;
  people: Array<Person>;
  registrationPhase: RegistrationPhase;
  registrations: Array<Registration>;
  session: Session;
  slots: Array<Slot>;
  startDate: Scalars['ISODate'];
  state: FestivalState;
  timetable: Timetable;
  venues: Array<Venue>;
  workshopAllocation: Maybe<WorkshopAllocation>;
  workshopPricing: Pricing;
  workshopTotal: Scalars['Money'];
  workshops: Array<Workshop>;
};


export type FestivalActivitiesArgs = {
  type: InputMaybe<ActivityType>;
};


export type FestivalActivityArgs = {
  slug: Scalars['String'];
  type: ActivityType;
};


export type FestivalRegistrationsArgs = {
  name: InputMaybe<Scalars['String']>;
};


export type FestivalSessionArgs = {
  id: Scalars['ID'];
};


export type FestivalSlotsArgs = {
  type: InputMaybe<ActivityType>;
};

export enum FestivalState {
  /** In the past */
  Finished = 'Finished',
  /** Happening right now */
  Happening = 'Happening',
  /** In the future */
  Upcoming = 'Upcoming'
}

export type InternetBankingPayment = Payment & {
  __typename: 'InternetBankingPayment';
  amount: Scalars['Money'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  reference: Scalars['String'];
  registration: Registration;
  state: PaymentState;
};

/** Autogenerated return type of JobProgress. */
export type JobProgressPayload = {
  __typename: 'JobProgressPayload';
  error: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  progress: Scalars['Int'];
  state: JobState;
  total: Scalars['Int'];
};

export enum JobState {
  /** Job is completed */
  Completed = 'completed',
  /** Job has failed */
  Failed = 'failed',
  /** Job is pending */
  Pending = 'pending',
  /** Job is working */
  Working = 'working'
}

/** Autogenerated return type of MergePeople. */
export type MergePeoplePayload = {
  __typename: 'MergePeoplePayload';
  profile: Person;
};

export type Message = {
  __typename: 'Message';
  content: Maybe<Scalars['String']>;
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  sender: User;
  subject: Maybe<Scalars['String']>;
};

/** Autogenerated return type of MoveActivity. */
export type MoveActivityPayload = {
  __typename: 'MoveActivityPayload';
  activity: Activity;
};

/** Autogenerated return type of MoveAllocatedParticipant. */
export type MoveAllocatedParticipantPayload = {
  __typename: 'MoveAllocatedParticipantPayload';
  affectedSessions: Array<WorkshopAllocationSession>;
};

/** Autogenerated return type of MoveWaitlistParticipant. */
export type MoveWaitlistParticipantPayload = {
  __typename: 'MoveWaitlistParticipantPayload';
  waitlist: Array<Waitlist>;
};

export type MultipleSessionAttributes = {
  activityId: InputMaybe<Scalars['ID']>;
  activityType: ActivityType;
  capacity: InputMaybe<Scalars['Int']>;
  festivalId: Scalars['ID'];
  timeRanges: Array<TimeRangeAttributes>;
  venueIds: Array<Scalars['ID']>;
};

export type Mutation = {
  __typename: 'Mutation';
  addPayment: Maybe<AddPaymentPayload>;
  addPreference: Maybe<AddPreferencePayload>;
  addSessionCast: Maybe<AddSessionCastPayload>;
  addToSession: Maybe<AddToSessionPayload>;
  addToWaitlist: Maybe<AddToWaitlistPayload>;
  addVoucher: Maybe<AddVoucherPayload>;
  allocateWorkshops: Maybe<AllocateWorkshopsPayload>;
  approvePayment: Maybe<ApprovePaymentPayload>;
  cancelPayment: Maybe<CancelPaymentPayload>;
  createActivity: Maybe<CreateActivityPayload>;
  createDonation: Maybe<CreateDonationPayload>;
  createPerson: Maybe<CreatePersonPayload>;
  createSession: Maybe<CreateSessionPayload>;
  createSessions: Maybe<CreateMultipleSessionsPayload>;
  createTranslation: Maybe<CreateTranslationPayload>;
  demoteSessionParticipant: Maybe<DemoteSessionParticipantPayload>;
  destroySession: Maybe<Scalars['Boolean']>;
  destroyTranslation: Maybe<Scalars['Boolean']>;
  finaliseRegistration: Maybe<FinaliseRegistrationPayload>;
  mergePeople: Maybe<MergePeoplePayload>;
  moveActivity: Maybe<MoveActivityPayload>;
  moveAllocatedParticipant: Maybe<MoveAllocatedParticipantPayload>;
  moveWaitlistParticipant: Maybe<MoveWaitlistParticipantPayload>;
  promiseInternetBankingPayment: Maybe<PromiseInternetBankingPaymentPayload>;
  promoteWaitlistParticipant: Maybe<PromoteWaitlistParticipantPayload>;
  removeFromSession: Maybe<RemoveFromSessionPayload>;
  removeFromWaitlist: Maybe<Scalars['Boolean']>;
  removePreference: Maybe<Scalars['Boolean']>;
  removeSessionCast: Maybe<Scalars['Boolean']>;
  renameActivity: Maybe<RenameActivityPayload>;
  resetPasswordAndLogIn: Maybe<ResetPasswordAndLogInPayload>;
  saveFeedback: Maybe<SaveFeedbackPayload>;
  sendMessage: Maybe<SendMessagePayload>;
  setSessionVisibility: Maybe<CalendarSession>;
  updateActivity: Maybe<UpdateActivityPayload>;
  updatePayment: Maybe<UpdatePaymentPayload>;
  updatePerson: Maybe<UpdatePersonPayload>;
  updatePreferences: Maybe<UpdatePreferencesPayload>;
  updateProfile: Maybe<Person>;
  updateRegistrationUserDetails: Maybe<UpdateUserDetailsPayload>;
  updateSession: Maybe<UpdateSessionPayload>;
  updateSetting: Maybe<UpdateSettingPayload>;
  updateTranslation: Maybe<UpdateTranslationPayload>;
  updateUser: Maybe<UpdateUserPayload>;
  userConfirmRegistrationWithToken: Maybe<UserConfirmRegistrationWithTokenPayload>;
  userLogin: Maybe<UserLoginPayload>;
  userLogout: Maybe<UserLogoutPayload>;
  userRegister: Maybe<UserRegisterPayload>;
  userResendConfirmationWithToken: Maybe<UserResendConfirmationWithTokenPayload>;
  userSendPasswordResetWithToken: Maybe<UserSendPasswordResetWithTokenPayload>;
  userUpdatePasswordWithToken: Maybe<UserUpdatePasswordWithTokenPayload>;
};


export type MutationAddPaymentArgs = {
  amount: Scalars['Money'];
  registrationId: Scalars['ID'];
  type?: InputMaybe<PaymentType>;
};


export type MutationAddPreferenceArgs = {
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationAddSessionCastArgs = {
  profileId: Scalars['ID'];
  role: Role;
  sessionId: Scalars['ID'];
};


export type MutationAddToSessionArgs = {
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationAddToWaitlistArgs = {
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationAddVoucherArgs = {
  registrationId: Scalars['ID'];
  workshops: Scalars['Int'];
};


export type MutationApprovePaymentArgs = {
  id: Scalars['ID'];
};


export type MutationCancelPaymentArgs = {
  id: Scalars['ID'];
};


export type MutationCreateActivityArgs = {
  attributes: ActivityAttributes;
  festivalId: InputMaybe<Scalars['ID']>;
  sessionId: InputMaybe<Scalars['ID']>;
  type: ActivityType;
};


export type MutationCreateDonationArgs = {
  amountCents: Scalars['Int'];
  anonymous?: InputMaybe<Scalars['Boolean']>;
  email: Scalars['String'];
  message: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  newsletter?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreatePersonArgs = {
  attributes: PersonAttributes;
};


export type MutationCreateSessionArgs = {
  attributes: SessionAttributes;
  festivalId: Scalars['ID'];
};


export type MutationCreateSessionsArgs = {
  attributes: MultipleSessionAttributes;
};


export type MutationCreateTranslationArgs = {
  name: Scalars['String'];
  traditionalName: Scalars['String'];
};


export type MutationDemoteSessionParticipantArgs = {
  position: Scalars['Int'];
  registrationId: Scalars['ID'];
  sessionId: Scalars['ID'];
};


export type MutationDestroySessionArgs = {
  id: Scalars['ID'];
};


export type MutationDestroyTranslationArgs = {
  id: Scalars['ID'];
};


export type MutationMergePeopleArgs = {
  attributes: ProfileMergeAttributes;
  profileIds: Array<Scalars['ID']>;
};


export type MutationMoveActivityArgs = {
  id: Scalars['ID'];
  slug: Scalars['String'];
};


export type MutationMoveAllocatedParticipantArgs = {
  newSessionId?: InputMaybe<Scalars['ID']>;
  oldSessionId?: InputMaybe<Scalars['ID']>;
  registrationId: Scalars['ID'];
  waitlist?: InputMaybe<Scalars['Boolean']>;
};


export type MutationMoveWaitlistParticipantArgs = {
  position: Scalars['Int'];
  registrationId: Scalars['ID'];
  sessionId: Scalars['ID'];
};


export type MutationPromiseInternetBankingPaymentArgs = {
  amount: Scalars['Money'];
  registrationId: Scalars['ID'];
};


export type MutationPromoteWaitlistParticipantArgs = {
  registrationId: Scalars['ID'];
  sessionId: Scalars['ID'];
};


export type MutationRemoveFromSessionArgs = {
  promote: InputMaybe<Scalars['Boolean']>;
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationRemoveFromWaitlistArgs = {
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationRemovePreferenceArgs = {
  registrationId: InputMaybe<Scalars['ID']>;
  sessionId: Scalars['ID'];
};


export type MutationRemoveSessionCastArgs = {
  profileId: Scalars['ID'];
  role: Role;
  sessionId: Scalars['ID'];
};


export type MutationRenameActivityArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationResetPasswordAndLogInArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  resetPasswordToken: Scalars['String'];
};


export type MutationSaveFeedbackArgs = {
  attributes: FeedbackAttributes;
  sessionId: Scalars['ID'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  sessionId: Scalars['ID'];
  subject: Scalars['String'];
};


export type MutationSetSessionVisibilityArgs = {
  hidden: Scalars['Boolean'];
  sessionId: Scalars['ID'];
};


export type MutationUpdateActivityArgs = {
  attributes: ActivityAttributes;
  id: Scalars['ID'];
};


export type MutationUpdatePaymentArgs = {
  attributes: PaymentAttributes;
  id: Scalars['ID'];
};


export type MutationUpdatePersonArgs = {
  attributes: PersonAttributes;
  id: Scalars['ID'];
};


export type MutationUpdatePreferencesArgs = {
  preferences: Array<PreferenceAttributes>;
};


export type MutationUpdateProfileArgs = {
  attributes: ProfileAttributes;
};


export type MutationUpdateRegistrationUserDetailsArgs = {
  attributes: UserDetailsAttributes;
  registrationId: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateSessionArgs = {
  attributes: SessionAttributes;
  id: Scalars['ID'];
};


export type MutationUpdateSettingArgs = {
  id: Scalars['String'];
  value: SettingValue;
};


export type MutationUpdateTranslationArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  traditionalName: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  attributes: UserAttributes;
  id: InputMaybe<Scalars['ID']>;
};


export type MutationUserConfirmRegistrationWithTokenArgs = {
  confirmationToken: Scalars['String'];
};


export type MutationUserLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUserRegisterArgs = {
  confirmUrl: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


export type MutationUserResendConfirmationWithTokenArgs = {
  confirmUrl: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUserSendPasswordResetWithTokenArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationUserUpdatePasswordWithTokenArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  resetPasswordToken: Scalars['String'];
};

export type PageResult = SearchResult & {
  __typename: 'PageResult';
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lede: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Payment = {
  amount: Scalars['Money'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  reference: Scalars['String'];
  registration: Registration;
  state: PaymentState;
};

export type PaymentAttributes = {
  state: InputMaybe<PaymentState>;
};

export enum PaymentState {
  /** Approved */
  Approved = 'Approved',
  /** Cancelled */
  Cancelled = 'Cancelled',
  /** Failed */
  Failed = 'Failed',
  /** Pending */
  Pending = 'Pending'
}

export enum PaymentType {
  /** CreditCardPayment */
  CreditCardPayment = 'CreditCardPayment',
  /** InternetBankingPayment */
  InternetBankingPayment = 'InternetBankingPayment',
  /** Refund */
  Refund = 'Refund',
  /** Voucher */
  Voucher = 'Voucher'
}

export enum Permission {
  /** Manage activities */
  Activities = 'activities',
  /** Administrator */
  Admin = 'admin',
  /** Manage content */
  Content = 'content',
  /** Manage payments */
  Payments = 'payments',
  /** Manage people */
  People = 'people',
  /** Manage permissions */
  Permissions = 'permissions',
  /** Manage registrations */
  Registrations = 'registrations',
  /** Manage shows */
  Shows = 'shows',
  /** Manage social events */
  SocialEvents = 'social_events',
  /** Manage workshops */
  Workshops = 'workshops'
}

export type PermissionDefinition = {
  __typename: 'PermissionDefinition';
  children: Maybe<Array<PermissionDefinition>>;
  id: Permission;
  label: Scalars['String'];
};

export type Person = {
  __typename: 'Person';
  appearances: Array<Appearance>;
  bio: Scalars['String'];
  city: Maybe<City>;
  id: Scalars['ID'];
  name: Scalars['String'];
  phone: Maybe<Scalars['String']>;
  picture: Maybe<ProfilePicture>;
  pronouns: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type PersonAttributes = {
  bio: InputMaybe<Scalars['String']>;
  city: InputMaybe<CityAttributes>;
  name: InputMaybe<Scalars['String']>;
  phone: InputMaybe<Scalars['String']>;
  picture: InputMaybe<Scalars['Upload']>;
  pronouns: InputMaybe<Scalars['String']>;
  uploadedPicture: InputMaybe<UploadedFile>;
};

export type PersonResult = SearchResult & {
  __typename: 'PersonResult';
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  person: Person;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Preference = {
  __typename: 'Preference';
  id: Scalars['ID'];
  position: Scalars['Int'];
  session: Session;
  sessionId: Scalars['ID'];
  workshop: Workshop;
  workshopId: Scalars['ID'];
};

export type PreferenceAttributes = {
  position: Scalars['Int'];
  sessionId: Scalars['ID'];
};

export type Pricing = {
  __typename: 'Pricing';
  baseWorkshopPrice: Scalars['Money'];
  discountLimit: Scalars['Int'];
  discountPerAdditionalWorkshop: Scalars['Money'];
  id: Scalars['ID'];
};

export type ProfileAttributes = {
  bio: InputMaybe<Scalars['String']>;
  city: InputMaybe<CityAttributes>;
  email: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  phone: InputMaybe<Scalars['String']>;
  picture: InputMaybe<Scalars['Upload']>;
  pronouns: InputMaybe<Scalars['String']>;
  uploadedPicture: InputMaybe<UploadedFile>;
};

export type ProfileMergeAttributes = {
  city: InputMaybe<Scalars['ID']>;
  country: InputMaybe<Scalars['ID']>;
  name: InputMaybe<Scalars['ID']>;
  pronouns: InputMaybe<Scalars['ID']>;
};

export type ProfilePicture = {
  __typename: 'ProfilePicture';
  id: Scalars['ID'];
  /** 256x256 */
  large: Scalars['String'];
  /** 128x128 */
  medium: Scalars['String'];
  /** 64x64 */
  small: Scalars['String'];
};

/** Autogenerated return type of PromiseInternetBankingPayment. */
export type PromiseInternetBankingPaymentPayload = {
  __typename: 'PromiseInternetBankingPaymentPayload';
  payment: Payment;
};

/** Autogenerated return type of PromoteWaitlistParticipant. */
export type PromoteWaitlistParticipantPayload = {
  __typename: 'PromoteWaitlistParticipantPayload';
  registration: Registration;
};

export type Query = {
  __typename: 'Query';
  calendar: Array<CalendarSession>;
  cities: Array<City>;
  directoryResult: Maybe<Session>;
  directorySearch: Array<Person>;
  festival: Festival;
  payment: Payment;
  people: Maybe<Array<Person>>;
  permissions: Array<PermissionDefinition>;
  person: Maybe<Person>;
  registration: Registration;
  search: Array<SearchResult>;
  setting: Maybe<Setting>;
  translations: Array<Translation>;
  user: Maybe<User>;
};


export type QueryDirectoryResultArgs = {
  id: Scalars['ID'];
  time: Scalars['ISO8601DateTime'];
};


export type QueryDirectorySearchArgs = {
  query: Scalars['String'];
};


export type QueryFestivalArgs = {
  year: InputMaybe<Scalars['String']>;
};


export type QueryPaymentArgs = {
  id: Scalars['ID'];
};


export type QueryPersonArgs = {
  id: Scalars['ID'];
};


export type QueryRegistrationArgs = {
  id: InputMaybe<Scalars['ID']>;
};


export type QuerySearchArgs = {
  activityType: InputMaybe<ActivityType>;
  limit: InputMaybe<Scalars['Int']>;
  only?: InputMaybe<Array<SearchType>>;
  query: Scalars['String'];
};


export type QuerySettingArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  id: InputMaybe<Scalars['ID']>;
};

export type Refund = Payment & {
  __typename: 'Refund';
  amount: Scalars['Money'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  reference: Scalars['String'];
  registration: Registration;
  state: PaymentState;
};

export type Registration = {
  __typename: 'Registration';
  cart: Maybe<Cart>;
  codeOfConductAcceptedAt: Maybe<Scalars['ISO8601DateTime']>;
  completedAt: Maybe<Scalars['ISO8601DateTime']>;
  feedback: Array<Feedback>;
  id: Scalars['ID'];
  outstanding: Scalars['Money'];
  payments: Array<Payment>;
  photoPermission: Scalars['Boolean'];
  preferences: Array<Preference>;
  sessions: Array<Session>;
  showExplainer: Scalars['Boolean'];
  teaching: Array<Session>;
  user: Maybe<User>;
  waitlist: Array<Session>;
  workshopsCount: Scalars['Int'];
};

export enum RegistrationPhase {
  /** Closed */
  Closed = 'Closed',
  /** Earlybird */
  Earlybird = 'Earlybird',
  /** General */
  General = 'General',
  /** Paused */
  Paused = 'Paused',
  /** Pending */
  Pending = 'Pending'
}

/** Autogenerated return type of Registrations. */
export type RegistrationsPayload = {
  __typename: 'RegistrationsPayload';
  count: Scalars['Int'];
};

/** Autogenerated return type of RemoveFromSession. */
export type RemoveFromSessionPayload = {
  __typename: 'RemoveFromSessionPayload';
  registration: Registration;
  session: Session;
};

/** Autogenerated return type of RenameActivity. */
export type RenameActivityPayload = {
  __typename: 'RenameActivityPayload';
  activity: Activity;
};

/** Autogenerated return type of ResetPasswordAndLogIn. */
export type ResetPasswordAndLogInPayload = {
  __typename: 'ResetPasswordAndLogInPayload';
  authenticatable: User;
  /** Authentication credentials. Resource must be signed_in for credentials to be returned. */
  credentials: Maybe<Credential>;
};

export enum Role {
  /** director */
  Director = 'director',
  /** host */
  Host = 'host',
  /** muso */
  Muso = 'muso',
  /** operator */
  Operator = 'operator',
  /** organiser */
  Organiser = 'organiser',
  /** performer */
  Performer = 'performer',
  /** scorekeeper */
  Scorekeeper = 'scorekeeper',
  /** speaker */
  Speaker = 'speaker',
  /** tutor */
  Tutor = 'tutor'
}

/** Autogenerated return type of SaveFeedback. */
export type SaveFeedbackPayload = {
  __typename: 'SaveFeedbackPayload';
  feedback: Feedback;
};

export type SearchResult = {
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export enum SearchType {
  /** Activity */
  Activity = 'Activity',
  /** Page */
  Page = 'Page',
  /** Person */
  Person = 'Person',
  /** Venue */
  Venue = 'Venue'
}

/** Autogenerated return type of SendMessage. */
export type SendMessagePayload = {
  __typename: 'SendMessagePayload';
  message: Message;
};

export type Session = {
  __typename: 'Session';
  activity: Maybe<Activity>;
  activityType: ActivityType;
  capacity: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  endsAt: Scalars['ISO8601DateTime'];
  hosts: Array<Person>;
  id: Scalars['ID'];
  messages: Array<Message>;
  musos: Array<Person>;
  operators: Array<Person>;
  participants: Array<Registration>;
  performers: Array<Person>;
  slot: Slot;
  slots: Array<Slot>;
  startsAt: Scalars['ISO8601DateTime'];
  venue: Maybe<Venue>;
  waitlist: Array<Waitlist>;
  workshop: Maybe<Workshop>;
};

export type SessionAttributes = {
  activityId: InputMaybe<Scalars['ID']>;
  activityType: InputMaybe<ActivityType>;
  capacity: InputMaybe<Scalars['Int']>;
  endsAt: InputMaybe<Scalars['ISO8601DateTime']>;
  startsAt: InputMaybe<Scalars['ISO8601DateTime']>;
  venueId: InputMaybe<Scalars['ID']>;
};

export type Setting = {
  description: Scalars['String'];
  id: Scalars['String'];
};

export type SettingValue = {
  boolean: InputMaybe<Scalars['Boolean']>;
  string: InputMaybe<Scalars['String']>;
};

export type Show = Activity & {
  __typename: 'Show';
  bookingLink: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  /** Directors */
  directors: Array<Person>;
  id: Scalars['ID'];
  missingInfo: Array<Scalars['String']>;
  name: Scalars['String'];
  picture: Maybe<ActivityPicture>;
  presenters: Array<Person>;
  sessions: Array<Session>;
  slug: Scalars['String'];
  type: ActivityType;
  workshop: Maybe<Workshop>;
};

export type Slot = {
  __typename: 'Slot';
  endsAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  sessions: Array<Session>;
  startsAt: Scalars['ISO8601DateTime'];
  workshops: Array<Workshop>;
};


export type SlotSessionsArgs = {
  type: InputMaybe<ActivityType>;
};

export type SocialEvent = Activity & {
  __typename: 'SocialEvent';
  bookingLink: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  missingInfo: Array<Scalars['String']>;
  name: Scalars['String'];
  /** Organisers */
  organisers: Array<Person>;
  picture: Maybe<ActivityPicture>;
  presenters: Array<Person>;
  sessions: Array<Session>;
  slug: Scalars['String'];
  type: ActivityType;
};

export type StringSetting = Setting & {
  __typename: 'StringSetting';
  description: Scalars['String'];
  id: Scalars['String'];
  value: Scalars['String'];
};

export type Subscription = {
  __typename: 'Subscription';
  jobProgress: JobProgressPayload;
  registrations: RegistrationsPayload;
};


export type SubscriptionJobProgressArgs = {
  id: Scalars['ID'];
  jobName: Scalars['String'];
};


export type SubscriptionRegistrationsArgs = {
  year: Scalars['ID'];
};

export type TimeRangeAttributes = {
  endsAt: Scalars['ISO8601DateTime'];
  startsAt: Scalars['ISO8601DateTime'];
};

export type Timetable = {
  __typename: 'Timetable';
  id: Scalars['ID'];
  sessions: Array<Session>;
};

export type Translation = {
  __typename: 'Translation';
  id: Scalars['ID'];
  name: Scalars['String'];
  traditionalName: Scalars['String'];
};

/** Autogenerated return type of UpdateActivity. */
export type UpdateActivityPayload = {
  __typename: 'UpdateActivityPayload';
  activity: Activity;
};

/** Autogenerated return type of UpdatePayment. */
export type UpdatePaymentPayload = {
  __typename: 'UpdatePaymentPayload';
  payment: Payment;
};

/** Autogenerated return type of UpdatePerson. */
export type UpdatePersonPayload = {
  __typename: 'UpdatePersonPayload';
  profile: Person;
};

/** Autogenerated return type of UpdateSession. */
export type UpdateSessionPayload = {
  __typename: 'UpdateSessionPayload';
  session: Session;
};

/** Autogenerated return type of UpdateSetting. */
export type UpdateSettingPayload = {
  __typename: 'UpdateSettingPayload';
  setting: Setting;
};

/** Autogenerated return type of UpdateTranslation. */
export type UpdateTranslationPayload = {
  __typename: 'UpdateTranslationPayload';
  translation: Translation;
};

/** Autogenerated return type of UpdateUserDetails. */
export type UpdateUserDetailsPayload = {
  __typename: 'UpdateUserDetailsPayload';
  registration: Registration;
};

/** Autogenerated return type of UpdateUser. */
export type UpdateUserPayload = {
  __typename: 'UpdateUserPayload';
  user: User;
};

export type UploadedFile = {
  filename: Scalars['String'];
  id: Scalars['String'];
  mimeType: InputMaybe<Scalars['String']>;
  size: Scalars['Int'];
};

export type User = {
  __typename: 'User';
  activities: Array<Activity>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions: Array<Permission>;
  profile: Maybe<Person>;
  settings: Array<Setting>;
};

export type UserAttributes = {
  email: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  password: InputMaybe<Scalars['String']>;
  passwordConfirmation: InputMaybe<Scalars['String']>;
  permissions: InputMaybe<Array<Permission>>;
};

/** Autogenerated return type of UserConfirmRegistrationWithToken. */
export type UserConfirmRegistrationWithTokenPayload = {
  __typename: 'UserConfirmRegistrationWithTokenPayload';
  authenticatable: User;
  /** Authentication credentials. Null unless user is signed in after confirmation. */
  credentials: Maybe<Credential>;
};

export type UserDetailsAttributes = {
  city: InputMaybe<Scalars['String']>;
  codeOfConductAcceptedAt: InputMaybe<Scalars['ISO8601DateTime']>;
  country: InputMaybe<Scalars['String']>;
  email: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  phone: InputMaybe<Scalars['String']>;
  photoPermission: InputMaybe<Scalars['Boolean']>;
  pronouns: InputMaybe<Scalars['String']>;
  showExplainer: InputMaybe<Scalars['Boolean']>;
};

/** Autogenerated return type of UserLogin. */
export type UserLoginPayload = {
  __typename: 'UserLoginPayload';
  authenticatable: User;
  credentials: Credential;
};

/** Autogenerated return type of UserLogout. */
export type UserLogoutPayload = {
  __typename: 'UserLogoutPayload';
  authenticatable: User;
};

/** Autogenerated return type of UserRegister. */
export type UserRegisterPayload = {
  __typename: 'UserRegisterPayload';
  authenticatable: User;
  /**
   * Authentication credentials. Null if after signUp resource is not active for
   * authentication (e.g. Email confirmation required).
   */
  credentials: Maybe<Credential>;
};

/** Autogenerated return type of UserResendConfirmationWithToken. */
export type UserResendConfirmationWithTokenPayload = {
  __typename: 'UserResendConfirmationWithTokenPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSendPasswordResetWithToken. */
export type UserSendPasswordResetWithTokenPayload = {
  __typename: 'UserSendPasswordResetWithTokenPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserUpdatePasswordWithToken. */
export type UserUpdatePasswordWithTokenPayload = {
  __typename: 'UserUpdatePasswordWithTokenPayload';
  authenticatable: User;
  /** Authentication credentials. Resource must be signed_in for credentials to be returned. */
  credentials: Maybe<Credential>;
};

export type Venue = {
  __typename: 'Venue';
  address: Scalars['String'];
  building: Scalars['String'];
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  position: Scalars['Int'];
  room: Maybe<Scalars['String']>;
};

export type VenueResult = SearchResult & {
  __typename: 'VenueResult';
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  venue: Venue;
};

export type Voucher = Payment & {
  __typename: 'Voucher';
  amount: Scalars['Money'];
  createdAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  reference: Scalars['String'];
  registration: Registration;
  state: PaymentState;
  workshops: Scalars['Int'];
};

export type Waitlist = {
  __typename: 'Waitlist';
  id: Scalars['ID'];
  offeredAt: Maybe<Scalars['ISO8601DateTime']>;
  position: Scalars['Int'];
  registration: Registration;
  session: Maybe<Session>;
};

export type Workshop = Activity & {
  __typename: 'Workshop';
  bookingLink: Maybe<Scalars['String']>;
  capacity: Scalars['Int'];
  description: Maybe<Scalars['String']>;
  feedback: Array<Feedback>;
  id: Scalars['ID'];
  missingInfo: Array<Scalars['String']>;
  name: Scalars['String'];
  picture: Maybe<ActivityPicture>;
  presenters: Array<Person>;
  sessions: Array<Session>;
  show: Maybe<Show>;
  slug: Scalars['String'];
  stats: WorkshopStat;
  suitability: Maybe<Scalars['String']>;
  /** Tutors */
  tutors: Array<Person>;
  type: ActivityType;
};

export type WorkshopAllocation = {
  __typename: 'WorkshopAllocation';
  id: Scalars['ID'];
  score: Maybe<Scalars['Float']>;
  sessions: Array<WorkshopAllocationSession>;
  state: JobState;
};

export type WorkshopAllocationSession = {
  __typename: 'WorkshopAllocationSession';
  capacity: Scalars['Int'];
  endsAt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
  registrations: Array<Registration>;
  slots: Array<Slot>;
  startsAt: Scalars['ISO8601DateTime'];
  waitlist: Array<Registration>;
  workshop: Workshop;
};

export type WorkshopStat = {
  __typename: 'WorkshopStat';
  counts: Array<Scalars['Int']>;
  id: Scalars['ID'];
};

/** Autogenerated return type of allocateWorkshops. */
export type AllocateWorkshopsPayload = {
  __typename: 'allocateWorkshopsPayload';
  workshopAllocation: WorkshopAllocation;
};

/** Autogenerated return type of finaliseRegistration. */
export type FinaliseRegistrationPayload = {
  __typename: 'finaliseRegistrationPayload';
  registration: Registration;
};

/** Autogenerated return type of updatePreferences. */
export type UpdatePreferencesPayload = {
  __typename: 'updatePreferencesPayload';
  registration: Registration;
};

import { dateTimePolicy, datePolicy } from './policies/dateTimePolicy';

export const scalarTypePolicies = {
  CreditCardPayment: { fields: { createdAt: dateTimePolicy } },
  Festival: {
    fields: {
      earlybirdClosesAt: dateTimePolicy,
      earlybirdOpensAt: dateTimePolicy,
      endDate: datePolicy,
      generalOpensAt: dateTimePolicy,
      startDate: datePolicy,
    },
  },
  InternetBankingPayment: { fields: { createdAt: dateTimePolicy } },
  Message: { fields: { createdAt: dateTimePolicy } },
  Refund: { fields: { createdAt: dateTimePolicy } },
  Registration: {
    fields: { codeOfConductAcceptedAt: dateTimePolicy, completedAt: dateTimePolicy },
  },
  Session: { fields: { endsAt: dateTimePolicy, startsAt: dateTimePolicy } },
  Slot: { fields: { endsAt: dateTimePolicy, startsAt: dateTimePolicy } },
  Voucher: { fields: { createdAt: dateTimePolicy } },
  Waitlist: { fields: { offeredAt: dateTimePolicy } },
  WorkshopAllocationSession: { fields: { endsAt: dateTimePolicy, startsAt: dateTimePolicy } },
};
