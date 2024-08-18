import { Ref } from 'react';

export const LEVELS = [
  { amount: 1500, value: 'pays a team member for half an hour' },
  { amount: 3300, value: 'gives accommodation to an artist for one night' },
  { amount: 5000, value: 'pays for one social media ad' },
  { amount: 10000, value: 'hires one of the venues at BATS for one day' },
  { amount: 20000, value: 'pays a tutor to teach one workshop' },
  { amount: 24000, value: 'pays for a show to perform' },
  { amount: 30000, value: 'hires BATS for a day' },
  { amount: 50000, value: 'covers all costs to put on one show' },
] as const;

export type DonationFields = {
  name: string;
  email: string;
  message: string;
  anonymous: boolean;
  newsletter: boolean;
};

export interface FormHandle {
  submit: () => Promise<void>;
}

export interface PageProps {
  formRef: Ref<FormHandle>;
}
