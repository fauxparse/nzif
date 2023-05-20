import React from 'react';
import { Link, Route, Routes, useLocation, useParams, useResolvedPath } from 'react-router-dom';

import { ProfileAttributes, usePersonQuery, useUpdateProfileMutation } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import Tabs from '@/molecules/Tabs';

import { PersonContext } from './Context';
import { PersonDetails } from './Person.types';
import Profile from './Profile';
import Settings from './Settings';

import './Person.css';

const Person: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };

  const { data, loading } = usePersonQuery({ variables: { id } });

  const person = data?.person || null;

  const permissions = data?.permissions || [];

  const [updateProfile] = useUpdateProfileMutation();

  const location = useLocation();
  const resolvedPath = useResolvedPath(`{PATH}`).pathname;

  const resolvePath = (path: string) => resolvedPath.replace('{PATH}', path).replace(/\/$/, '');

  const handleRename = (name: string) => {
    if (!person) return;
    updateProfile({
      variables: { id: person.id, attributes: { name } as ProfileAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updateProfile: {
          __typename: 'UpdateProfilePayload',
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
        <div className="page">
          <header className="page__header">
            <Breadcrumbs />
            <h1>
              {loading || !person ? (
                'Loading…'
              ) : (
                <InPlaceEdit value={person.name} onChange={handleRename} />
              )}
            </h1>
            <Tabs>
              <Tabs.Tab
                as={Link}
                to=""
                text="Profile"
                selected={location.pathname === resolvePath('')}
              />
              <Tabs.Tab
                as={Link}
                to="settings"
                text="Settings"
                selected={location.pathname === resolvePath('settings')}
              />
            </Tabs>
          </header>
          {!loading && !!person && (
            <Routes>
              <Route path="" element={<Profile person={person} />} />
              <Route path="settings" element={<Settings person={person} />} />
            </Routes>
          )}
        </div>
      </BreadcrumbProvider>
    </PersonContext.Provider>
  );
};

export default Person;
