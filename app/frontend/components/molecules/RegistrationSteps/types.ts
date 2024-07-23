import CheckIcon from '@/icons/CheckIcon';
import CodeOfConductIcon from '@/icons/CodeOfConductIcon';
import PaymentIcon from '@/icons/PaymentIcon';
import ProfileIcon from '@/icons/ProfileIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';

export const STEPS = [
  { id: 'yourself', title: 'About you', icon: ProfileIcon },
  {
    id: 'code-of-conduct',
    title: 'Code of conduct',
    icon: CodeOfConductIcon,
  },
  {
    id: 'workshops',
    title: 'Workshops',
    icon: WorkshopIcon,
  },
  {
    id: 'payment',
    title: 'Payment',
    icon: PaymentIcon,
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    icon: CheckIcon,
  },
] as const;

export type StepDefinition = (typeof STEPS)[number];

export type StepId = StepDefinition['id'];

export type StepState = 'pending' | 'active' | 'completed';
