import React, { Fragment } from 'react';
import { createBrowserRouter, LoaderFunction, Navigate, RouterProvider } from 'react-router-dom';
import { route } from 'react-router-typesafe-routes/dom';
import { zod } from 'react-router-typesafe-routes/zod';
import { z } from 'zod';

import { client } from '@/graphql';
import RegistrationRedirect from '@/pages/Public/Registration/Redirect';

import { FestivalDocument } from './graphql/types';
import NotFound from './pages/404';

const id = zod(z.string()).defined();

const year = zod(z.string().regex(/^\d{4}$/)).defined();

const activityType = zod(z.string().regex(/^(workshops|shows)$/)).defined();

const loadFestival: LoaderFunction = async ({ params }) => {
  if (!params.year?.match(/^\d{4}$/)) {
    throw new Error('Invalid year');
  }

  await client.query({ query: FestivalDocument, variables: params });
  return null;
};

export const ROUTES = {
  ADMIN: route(
    'admin',
    {},
    {
      FESTIVAL: route(
        ':year',
        {
          params: { year },
        },
        {
          TIMETABLE: route('timetable'),
          ACTIVITIES: route(':type', { params: { type: activityType } }),
          SHOWS: route('shows'),
          WORKSHOPS: route('workshops'),
        }
      ),
      PEOPLE: route('people'),
      PERSON: route('people/:id', {
        params: { id },
      }),
      TRANSLATIONS: route('translations'),
    }
  ),
  FESTIVAL: route(
    ':year',
    {
      params: { year },
    },
    {
      ACTIVITIES: route(':type', {
        params: { type: activityType },
      }),
      ACTIVITY: route(':type/:slug', {
        params: { type: activityType, slug: id },
      }),
    }
  ),
  REGISTRATION: route(
    ':year/register',
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
};

const router = createBrowserRouter([
  {
    children: [
      {
        path: ROUTES.ADMIN.path,
        lazy: () => import('./pages/Admin'),
        children: [
          {
            path: ROUTES.ADMIN.FESTIVAL.path,
            lazy: () => import('./pages/Admin/Festival'),
            children: [
              {
                path: ROUTES.ADMIN.FESTIVAL.TIMETABLE.path,
                lazy: () => import('./pages/Admin/Festival/Timetable'),
              },
              {
                path: ROUTES.ADMIN.FESTIVAL.ACTIVITIES.path,
                lazy: () => import('./pages/Admin/Festival/Activities/ActivityList'),
              },
              {
                index: true,
                lazy: () => import('./pages/Admin/Festival/Dashboard'),
              },
            ],
          },
          {
            path: ROUTES.ADMIN.PEOPLE.path,
            lazy: () => import('./pages/Admin/Festival/People/PeopleList'),
          },
          {
            path: ROUTES.ADMIN.PEOPLE.path,
            lazy: () => import('./pages/Admin/Festival/People/Person'),
          },
        ],
      },
      {
        path: ':year',
        loader: loadFestival,
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
            path: ROUTES.FESTIVAL.ACTIVITIES.path,
            lazy: () => import('./pages/Public/Activities'),
          },
          {
            path: ROUTES.FESTIVAL.ACTIVITY.path,
            lazy: () => import('./pages/Public/Activities/ActivityDetails'),
          },
          {
            index: true,
            lazy: () => import('./pages/Public/Home'),
          },
        ],
      },
      {
        path: ROUTES.CONTENT.path,
        lazy: () => import('./pages/Contentful'),
      },
      {
        path: '/register',
        element: <Navigate to="/2023/register" />,
      },
      {
        path: '/',
        element: <Navigate to="/2023" />,
      },
    ],
    // errorElement: <NotFound />,
  },
]);

const Routing: React.FC = () => {
  return <RouterProvider router={router} />;

  // return (
  //   <LocationContext.Provider value={{ location, previousLocation }}>
  //     <Routes location={location} key={locationKey}>
  //       <Route path={ROUTES.ADMIN.path} element={suspend(Admin)}>
  //         <Route path=":year" element={<Festival />}>
  //           {Object.entries(ActivityType).map(([key, type]) => (
  //             <Route
  //               key={key}
  //               path={`${kebabCase(pluralize(key))}/*`}
  //               element={<AdminActivities type={type} />}
  //             >
  //               <Route path=":slug" element={<ActivityDetails type={type} />} />
  //               <Route path="" element={<ActivityList type={type} />} />
  //             </Route>
  //           ))}
  //           <Route path="people/*" element={<People />}>
  //             <Route path=":id/*" element={<Person />} />
  //             <Route path="" element={<PeopleList />} />
  //           </Route>
  //           <Route path="timetable" element={<Timetable />} />
  //           <Route path="translations" element={<Translations />} />
  //           <Route index element={<Dashboard />} />
  //         </Route>
  //         <Route index element={<CurrentFestivalRedirect />} />
  //       </Route>
  //       <Route path={ROUTES.FESTIVAL.path} element={<Public />}>
  //         <Route path={ROUTES.REGISTRATION.path} element={suspend(Registration)}>
  //           <Route path="about-you" element={<AboutYou />} />
  //           <Route path="workshops" element={<WorkshopSelection />} />
  //           <Route path="payment" element={<Payment />} />
  //           <Route path="thanks" element={<Thanks />} />
  //           <Route index element={<Navigate to="about-you" replace />} />
  //         </Route>
  //         <Route index element={suspend(Home)} />
  //       </Route>
  //       <Route path={ROUTES.CONTENT.path} element={suspend(Contentful)} />
  //       <Route index element={<CurrentFestivalRedirect />} />
  //     </Routes>
  //   </LocationContext.Provider>
  // );
};

export default Routing;
