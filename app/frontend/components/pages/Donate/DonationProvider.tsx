import { CreateDonationPayload } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import Details from './Details';
import Levels from './Levels';
import Payment from './Payment';
import { CreateDonationMutation } from './queries';
import { DonationFields } from './types';

const pages = [Levels, Details, Payment] as const;

interface DonationContext {
  amount: number;
  valid: boolean;
  pageIndex: number;
  totalPages: number;
  details: DonationFields;
  clientSecret: string | null;
  page: (typeof pages)[number];
  submitDetails: (details: DonationFields) => Promise<void>;
  setAmount: Dispatch<SetStateAction<number>>;
  setValid: Dispatch<SetStateAction<boolean>>;
  nextPage: () => void;
}

const outsideProvider = () => {
  throw new Error('Must be inside a DonationProvider');
};

const DonationContext = React.createContext<DonationContext>({
  amount: 0,
  valid: false,
  pageIndex: 0,
  totalPages: pages.length,
  page: pages[0],
  details: {
    name: '',
    email: '',
    message: '',
    anonymous: false,
    newsletter: false,
  },
  clientSecret: null,
  setAmount: outsideProvider,
  setValid: outsideProvider,
  submitDetails: outsideProvider,
  nextPage: outsideProvider,
});

export const DonationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [amount, setAmount] = useState(0);
  const [valid, setValid] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [details, setDetails] = useState<DonationFields>({
    name: '',
    email: '',
    message: '',
    anonymous: false,
    newsletter: false,
  });

  const [createDonation, { data }] = useMutation<{ createDonation: CreateDonationPayload }>(
    CreateDonationMutation
  );

  const clientSecret = data?.createDonation?.paymentIntentSecret ?? null;

  const submitDetails = useCallback(
    async (details: DonationFields) => {
      setDetails(details);
      const { data } = await createDonation({ variables: { amount, ...details } });
    },
    [createDonation, amount]
  );

  return (
    <DonationContext.Provider
      value={{
        amount,
        valid,
        pageIndex,
        totalPages: pages.length,
        page: pages[pageIndex],
        details,
        clientSecret,
        setAmount,
        setValid,
        submitDetails,
        nextPage: () => setPageIndex((i) => Math.min(i + 1, pages.length - 1)),
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => useContext(DonationContext);