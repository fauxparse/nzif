import React, { Fragment } from 'react';
import { createBrowserRouter, LoaderFunction, RouterProvider } from 'react-router-dom';
import { route } from 'react-router-typesafe-routes/dom';
import { zod } from 'react-router-typesafe-routes/zod';
import { z } from 'zod';

import { client } from '@/graphql';
import RegistrationRedirect from '@/pages/Public/Registration/Redirect';

import { FestivalDocument } from './graphql/types';
// import NotFound from './pages/404';

const id = zod(z.string()).defined();

const year = zod(z.string().regex(/^\d{4}$/)).defined();

const date = zod(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

const activityType = zod(z.string().regex(/^(workshops|shows|social-events)$/)).defined();

const loadFestival: LoaderFunction = async () => {
  await client.query({ query: FestivalDocument });
  return null;
};

export const ROUTES = {
  ADMIN: route(
    'admin',
    {},
    {
      TIMETABLE: route('timetable'),
      ACTIVITIES: route(':type', { params: { type: activityType } }),
      ACTIVITY: route(
        ':type/:slug',
        { params: { type: activityType, slug: id } },
        {
          SESSION: route(':date', { params: { date } }),
          SHOW: route('show'),
          WORKSHOP: route('workshop'),
        }
      ),
      SHOWS: route('shows'),
      WORKSHOPS: route('workshops'),
      SOCIAL_EVENTS: route('social-events'),
      PEOPLE: route('people'),
      PERSON: route(
        'people/:id',
        {
          params: { id },
        },
        {
          SETTINGS: route('settings'),
          REGISTRATION: route('registration'),
        }
      ),
      REGISTRATIONS: route('registrations'),
      TRANSLATIONS: route('translations'),
    }
  ),
  ACTIVITIES: route(':type', {
    params: { type: activityType },
  }),
  ACTIVITY: route(':type/:slug', {
    params: { type: activityType, slug: id },
  }),
  REGISTRATION: route(
    'register',
    { params: { year } },
    {
      ABOUT_YOU: route('about-you'),
      WORKSHOPS: route('workshops'),
      PAYMENT: route('payment'),
      THANKS: route('thanks'),
    }
  ),
  CONTENT: route('about/:slug', { params: { slug: zod(z.string()).defined() } }),
  LOG_IN: route('log-in'),
  SIGN_UP: route('sign-up'),
  LOG_OUT: route('log-out'),
  PASSWORD: route('password', {
    searchParams: {
      reset_password_token: zod(z.string()),
    },
  }),
  PROFILE: route('profile'),
};

const router = createBrowserRouter([
  {
    loader: loadFestival,
    children: [
      {
        path: ROUTES.ADMIN.path,
        lazy: () => import('./pages/Admin'),
        children: [
          {
            path: ROUTES.ADMIN.REGISTRATIONS.path,
            lazy: () => import('./pages/Admin/Festival/Registrations'),
          },
          {
            path: ROUTES.ADMIN.TIMETABLE.path,
            lazy: () => import('./pages/Admin/Festival/Timetable'),
          },
          {
            path: ROUTES.ADMIN.ACTIVITIES.path,
            lazy: () => import('./pages/Admin/Festival/Activities/ActivityList'),
          },
          {
            path: ROUTES.ADMIN.ACTIVITY.path,
            lazy: () => import('./pages/Admin/Festival/Activities/ActivityDetails'),
            children: [
              {
                path: ROUTES.ADMIN.ACTIVITY.SESSION.path,
                lazy: () => import('./pages/Admin/Festival/Activities/ActivityDetails/Session'),
              },
              {
                path: ROUTES.ADMIN.ACTIVITY.SHOW.path,
                lazy: () => import('./pages/Admin/Festival/Activities/ActivityDetails/Attached'),
              },
              {
                path: ROUTES.ADMIN.ACTIVITY.WORKSHOP.path,
                lazy: () => import('./pages/Admin/Festival/Activities/ActivityDetails/Attached'),
              },
              {
                index: true,
                lazy: () => import('./pages/Admin/Festival/Activities/ActivityDetails/Details'),
              },
            ],
          },
          {
            path: ROUTES.ADMIN.PEOPLE.path,
            lazy: () => import('./pages/Admin/People/PeopleList'),
          },
          {
            path: ROUTES.ADMIN.PERSON.path,
            lazy: () => import('./pages/Admin/People/Person'),
            children: [
              {
                path: ROUTES.ADMIN.PERSON.REGISTRATION.path,
                lazy: () => import('./pages/Admin/People/Person/Registration'),
              },
              {
                path: ROUTES.ADMIN.PERSON.SETTINGS.path,
                lazy: () => import('./pages/Admin/People/Person/Settings'),
              },
              {
                index: true,
                lazy: () => import('./pages/Admin/People/Person/Details'),
              },
            ],
          },
          {
            path: ROUTES.ADMIN.TRANSLATIONS.path,
            lazy: () => import('./pages/Admin/Translations'),
          },
          {
            index: true,
            lazy: () => import('./pages/Admin/Dashboard'),
          },
        ],
      },
      {
        lazy: () => import('./pages/Public'),
        children: [
          {
            path: ROUTES.REGISTRATION.path,
            lazy: () => import('./pages/Public/Registration'),
            children: [
              {
                path: ROUTES.REGISTRATION.ABOUT_YOU.path,
                Component: Fragment,
              },
              {
                path: ROUTES.REGISTRATION.WORKSHOPS.path,
                Component: Fragment,
              },
              {
                path: ROUTES.REGISTRATION.PAYMENT.path,
                Component: Fragment,
              },
              {
                path: ROUTES.REGISTRATION.THANKS.path,
                Component: Fragment,
              },
              {
                index: true,
                element: <RegistrationRedirect />,
              },
            ],
          },
          {
            path: ROUTES.ACTIVITIES.path,
            lazy: () => import('./pages/Public/Activities'),
          },
          {
            path: ROUTES.ACTIVITY.path,
            lazy: () => import('./pages/Public/Activities/ActivityDetails'),
          },
          {
            path: ROUTES.PROFILE.path,
            lazy: () => import('./pages/Public/Profile'),
          },
          {
            index: true,
            lazy: () => import('./pages/Public/Home'),
          },
          {
            path: ROUTES.CONTENT.path,
            lazy: () => import('./pages/Contentful'),
          },
          {
            path: '/password',
            lazy: () => import('./pages/Public/ResetPassword'),
          },
        ],
      },
    ],
    // errorElement: <NotFound />,
  },
]);

const Routing: React.FC = () => <RouterProvider router={router} />;

export default Routing;
