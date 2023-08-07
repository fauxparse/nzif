import React from 'react';
import { Link, Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { PersonAttributes, usePersonQuery, useUpdatePersonMutation } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';
import { ROUTES } from '@/Routes';

import { PersonContext } from './Context';
import { PersonDetails } from './Person.types';

import './Person.css';

type Tab = {
  label: string;
  path: string;
  enabled?: (person: PersonDetails | null) => boolean;
};

const TABS: Tab[] = [
  { label: 'Profile', path: '' },
  { label: 'Registration', path: 'registration' },
  { label: 'Settings', path: 'settings', enabled: (person) => !!person?.user },
];

export const Component: React.FC = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data, loading } = usePersonQuery({ variables: { id } });

  const person = data?.person || null;

  const permissions = data?.permissions || [];

  const [updatePerson] = useUpdatePersonMutation();

  const location = useLocation();
  const resolvedPath = useResolvedPath(`{PATH}`).pathname;

  const resolvePath = (path: string) => resolvedPath.replace('{PATH}', path).replace(/\/$/, '');

  const handleRename = (name: string) => {
    if (!person) return;
    updatePerson({
      variables: { id: person.id, attributes: { name } as PersonAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePerson: {
          __typename: 'UpdatePersonPayload',
          profile: {
            ...person,
            name,
          } as PersonDetails,
        },
      },
    });
  };

  return (
    <PersonContext.Provider value={{ person, permissions }}>
      <BreadcrumbProvider label="People" path="people">
        <div className="admin-person page">
          <PageHeader>
            <Breadcrumbs />
            <h1>
              {loading || !person ? (
                'Loading…'
              ) : (
                <InPlaceEdit value={person.name} onChange={handleRename} />
              )}
            </h1>
            <Tabs>
              {TABS.map(
                ({ label, path, enabled }) =>
                  (!enabled || enabled(person)) && (
                    <Tabs.Tab
                      key={path}
                      as={Link}
                      to={path}
                      text={label}
                      selected={location.pathname === resolvePath(path)}
                    />
                  )
              )}
            </Tabs>
          </PageHeader>
          <Outlet />
        </div>
      </BreadcrumbProvider>
    </PersonContext.Provider>
  );
};

Component.displayName = 'Person';

export default Component;
