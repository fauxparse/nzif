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

const activityType = zod(z.string().regex(/^(workshops|shows)$/)).defined();

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
      ACTIVITY: route(':type/:slug', { params: { type: activityType, slug: id } }),
      SHOWS: route('shows'),
      WORKSHOPS: route('workshops'),
      SOCIAL_EVENTS: route('social-events'),
      PEOPLE: route('people'),
      PERSON: route('people/:id', {
        params: { id },
      }),
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
          },
          {
            path: ROUTES.ADMIN.PEOPLE.path,
            lazy: () => import('./pages/Admin/People/PeopleList'),
          },
          {
            path: ROUTES.ADMIN.PERSON.path,
            lazy: () => import('./pages/Admin/People/Person'),
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
