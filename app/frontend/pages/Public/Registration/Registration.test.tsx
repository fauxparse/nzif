import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, vi } from 'vitest';

import cache from '@/graphql/cache';
import { RegistrationStatusDocument, RegistrationStatusQuery } from '@/graphql/types';
import { CountryPickerOption } from '@/molecules/CountryPicker/CountryPicker.types';
import festivalFactory from '@/tests/factories/Festival';
import registrationFactory from '@/tests/factories/Registration';

import Registration from '.';

vi.mock('@/molecules/CountryPicker/useCountries', () => ({
  default: () => ({
    loading: false,
    countries: [{ label: 'Aotearoa', value: 'NZ', priority: true }] satisfies CountryPickerOption[],
  }),
}));

vi.mock('./AboutYou/useCodeOfConduct', () => ({
  default: () => <h1>Code of conduct</h1>,
}));

describe.skip('Registration', () => {
  const renderRegistration = ({
    mocks = [],
    currentPath = '/2023/registration',
  }: {
    // biome-ignore lint/suspicious/noExplicitAny: we don't care about the types here
    mocks?: readonly MockedResponse<Record<string, any>, Record<string, any>>[];
    currentPath?: string;
  } = {}) => {
    render(
      <MockedProvider mocks={mocks} cache={cache()}>
        <MemoryRouter initialEntries={[currentPath]}>
          <Routes>
            <Route path="/2023/registration/*" element={<Registration />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
  };

  describe('Step 1', () => {
    let originalIntersectionObserver: typeof window.IntersectionObserver;
    let scrolledToEnd: () => void;

    beforeEach(() => {
      originalIntersectionObserver = window.IntersectionObserver;

      const intersectionObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      } as unknown as IntersectionObserver;

      window.IntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
        scrolledToEnd = async () => {
          setTimeout(() => {
            callback([{ isIntersecting: true } as IntersectionObserverEntry], intersectionObserver);
          });
        };
        return intersectionObserver;
      });
    });

    afterEach(() => {
      window.IntersectionObserver = originalIntersectionObserver;
    });

    describe('with a blank registration', () => {
      beforeEach(async () => {
        renderRegistration({
          mocks: [
            {
              request: {
                query: RegistrationStatusDocument,
              },
              result: {
                data: {
                  __typename: 'Query',
                  registration: registrationFactory.blank().build(),
                  festival: festivalFactory.build(),
                } satisfies RegistrationStatusQuery,
              },
            },
          ],
        });
        await screen.findByText('Register for NZIF 2023');
      });

      it('shows the login form', () => {
        expect(screen.getByText('Login and security')).toBeInTheDocument();
      });

      it('selects the first step', () => {
        expect(screen.getByText(/Your details/).closest('.registration__step')).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });
    });

    describe('with a blank registration for an existing user', () => {
      beforeEach(async () => {
        renderRegistration({
          mocks: [
            {
              request: {
                query: RegistrationStatusDocument,
              },
              result: {
                data: {
                  __typename: 'Query',
                  registration: registrationFactory.withUserButNoProfile().build(),
                  festival: festivalFactory.build(),
                } satisfies RegistrationStatusQuery,
              },
            },
          ],
        });
        await screen.findByText('Register for NZIF 2023');
      });

      it('shows the user details form', () => {
        expect(screen.getByText(/So we can get in touch/)).toBeInTheDocument();
      });

      it('has a name filled in', () => {
        expect(screen.getByLabelText('Your name')).toHaveValue();
      });

      it('has an email filled in', () => {
        expect(screen.getByLabelText('Your email address')).toHaveValue();
      });

      it('has disabled the code of conduct checkbox', () => {
        expect(screen.getByLabelText(/I have read/)).toBeDisabled();
      });

      it('shows an error message when the form is submitted', async () => {
        const user = userEvent.setup();
        await act(() => {
          user.click(screen.getByText(/Next/));
        });
        await waitFor(() => expect(screen.getByLabelText('City')).toHaveFocus());
        expect(screen.getByText(/Please tell us where you’re from/)).toBeInTheDocument();
      });

      it('enables the checkbox when the code of conduct is read', async () => {
        await waitFor(() => expect(scrolledToEnd).toBeDefined());
        await scrolledToEnd();
        await waitFor(() => expect(screen.getByLabelText(/I have read/)).not.toBeDisabled());
      });
    });

    describe('with a filled-in registration', () => {
      beforeEach(async () => {
        renderRegistration({
          mocks: [
            {
              request: {
                query: RegistrationStatusDocument,
              },
              result: {
                data: {
                  __typename: 'Query',
                  registration: registrationFactory.withUserDetails().readCodeOfConduct().build(),
                  festival: festivalFactory.build(),
                } satisfies RegistrationStatusQuery,
              },
            },
          ],
        });
        await screen.findByText('Register for NZIF 2023');
      });

      it('shows the user details form', () => {
        expect(screen.getByText(/So we can get in touch/)).toBeInTheDocument();
      });

      it('has pronouns filled in', () => {
        expect(screen.getByLabelText('Your pronouns')).toHaveValue('they/them');
      });

      it('has the code of conduct checkbox checked', () => {
        expect(screen.getByLabelText(/I have read/)).toBeChecked();
      });
    });
  });
});
