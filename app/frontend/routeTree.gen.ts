/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LogoutImport } from './routes/logout'
import { Route as AdminImport } from './routes/admin'
import { Route as RegisterRouteImport } from './routes/register/route'
import { Route as PublicRouteImport } from './routes/_public/route'
import { Route as AuthRouteImport } from './routes/_auth/route'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as AdminIndexImport } from './routes/admin/index'
import { Route as PublicIndexImport } from './routes/_public/index'
import { Route as RegisterYourselfImport } from './routes/register/yourself'
import { Route as RegisterWorkshopsImport } from './routes/register/workshops'
import { Route as RegisterPaymentImport } from './routes/register/payment'
import { Route as RegisterCompletedImport } from './routes/register/completed'
import { Route as RegisterCodeOfConductImport } from './routes/register/code-of-conduct'
import { Route as AdminTimetableImport } from './routes/admin/timetable'
import { Route as PublicAuthenticatedImport } from './routes/_public/_authenticated'
import { Route as AuthSignupImport } from './routes/_auth/signup'
import { Route as AuthResetpasswordImport } from './routes/_auth/reset_password'
import { Route as AuthLoginImport } from './routes/_auth/login'
import { Route as AuthForgotImport } from './routes/_auth/forgot'
import { Route as AdminRegistrationsRouteImport } from './routes/admin/registrations/route'
import { Route as AdminActivityTypeRouteImport } from './routes/admin/$activityType/route'
import { Route as PublicVenuesRouteImport } from './routes/_public/venues/route'
import { Route as PublicPeopleRouteImport } from './routes/_public/people/route'
import { Route as PublicActivityTypeRouteImport } from './routes/_public/$activityType/route'
import { Route as AdminRegistrationsIndexImport } from './routes/admin/registrations/index'
import { Route as AdminActivityTypeIndexImport } from './routes/admin/$activityType/index'
import { Route as PublicVenuesIndexImport } from './routes/_public/venues/index'
import { Route as PublicPeopleIndexImport } from './routes/_public/people/index'
import { Route as RegisterWorkshopsSlugImport } from './routes/register/workshops.$slug'
import { Route as RegisterCodeOfConductMediaImport } from './routes/register/code-of-conduct.media'
import { Route as AdminRegistrationsPreferencesImport } from './routes/admin/registrations/preferences'
import { Route as AdminRegistrationsRegistrationIdImport } from './routes/admin/registrations/$registrationId'
import { Route as PublicVenuesIdImport } from './routes/_public/venues/$id'
import { Route as PublicPeopleIdImport } from './routes/_public/people/$id'
import { Route as PublicAboutSlugImport } from './routes/_public/about.$slug'
import { Route as PublicAuthenticatedProfileImport } from './routes/_public/_authenticated/profile'
import { Route as PublicAuthenticatedCalendarImport } from './routes/_public/_authenticated/calendar'
import { Route as PublicActivityTypeListImport } from './routes/_public/$activityType/_list'
import { Route as PublicActivityTypeSlugImport } from './routes/_public/$activityType/$slug'
import { Route as AdminActivityTypeSlugRouteImport } from './routes/admin/$activityType/$slug/route'
import { Route as AdminActivityTypeSlugIndexImport } from './routes/admin/$activityType/$slug/index'
import { Route as PublicActivityTypeListIndexImport } from './routes/_public/$activityType/_list.index'
import { Route as AdminActivityTypeSlugSessionImport } from './routes/admin/$activityType/$slug/$session'

// Create/Update Routes

const LogoutRoute = LogoutImport.update({
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const AdminRoute = AdminImport.update({
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const RegisterRouteRoute = RegisterRouteImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const PublicRouteRoute = PublicRouteImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  path: '/',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)

const PublicIndexRoute = PublicIndexImport.update({
  path: '/',
  getParentRoute: () => PublicRouteRoute,
} as any)

const RegisterYourselfRoute = RegisterYourselfImport.update({
  path: '/yourself',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const RegisterWorkshopsRoute = RegisterWorkshopsImport.update({
  path: '/workshops',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const RegisterPaymentRoute = RegisterPaymentImport.update({
  path: '/payment',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const RegisterCompletedRoute = RegisterCompletedImport.update({
  path: '/completed',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const RegisterCodeOfConductRoute = RegisterCodeOfConductImport.update({
  path: '/code-of-conduct',
  getParentRoute: () => RegisterRouteRoute,
} as any)

const AdminTimetableRoute = AdminTimetableImport.update({
  path: '/timetable',
  getParentRoute: () => AdminRoute,
} as any)

const PublicAuthenticatedRoute = PublicAuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => PublicRouteRoute,
} as any)

const AuthSignupRoute = AuthSignupImport.update({
  path: '/signup',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthResetpasswordRoute = AuthResetpasswordImport.update({
  path: '/reset_password',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  path: '/login',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthForgotRoute = AuthForgotImport.update({
  path: '/forgot',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AdminRegistrationsRouteRoute = AdminRegistrationsRouteImport.update({
  path: '/registrations',
  getParentRoute: () => AdminRoute,
} as any)

const AdminActivityTypeRouteRoute = AdminActivityTypeRouteImport.update({
  path: '/$activityType',
  getParentRoute: () => AdminRoute,
} as any)

const PublicVenuesRouteRoute = PublicVenuesRouteImport.update({
  path: '/venues',
  getParentRoute: () => PublicRouteRoute,
} as any)

const PublicPeopleRouteRoute = PublicPeopleRouteImport.update({
  path: '/people',
  getParentRoute: () => PublicRouteRoute,
} as any)

const PublicActivityTypeRouteRoute = PublicActivityTypeRouteImport.update({
  path: '/$activityType',
  getParentRoute: () => PublicRouteRoute,
} as any)

const AdminRegistrationsIndexRoute = AdminRegistrationsIndexImport.update({
  path: '/',
  getParentRoute: () => AdminRegistrationsRouteRoute,
} as any)

const AdminActivityTypeIndexRoute = AdminActivityTypeIndexImport.update({
  path: '/',
  getParentRoute: () => AdminActivityTypeRouteRoute,
} as any)

const PublicVenuesIndexRoute = PublicVenuesIndexImport.update({
  path: '/',
  getParentRoute: () => PublicVenuesRouteRoute,
} as any)

const PublicPeopleIndexRoute = PublicPeopleIndexImport.update({
  path: '/',
  getParentRoute: () => PublicPeopleRouteRoute,
} as any)

const RegisterWorkshopsSlugRoute = RegisterWorkshopsSlugImport.update({
  path: '/$slug',
  getParentRoute: () => RegisterWorkshopsRoute,
} as any)

const RegisterCodeOfConductMediaRoute = RegisterCodeOfConductMediaImport.update(
  {
    path: '/media',
    getParentRoute: () => RegisterCodeOfConductRoute,
  } as any,
)

const AdminRegistrationsPreferencesRoute =
  AdminRegistrationsPreferencesImport.update({
    path: '/preferences',
    getParentRoute: () => AdminRegistrationsRouteRoute,
  } as any)

const AdminRegistrationsRegistrationIdRoute =
  AdminRegistrationsRegistrationIdImport.update({
    path: '/$registrationId',
    getParentRoute: () => AdminRegistrationsRouteRoute,
  } as any)

const PublicVenuesIdRoute = PublicVenuesIdImport.update({
  path: '/$id',
  getParentRoute: () => PublicVenuesRouteRoute,
} as any)

const PublicPeopleIdRoute = PublicPeopleIdImport.update({
  path: '/$id',
  getParentRoute: () => PublicPeopleRouteRoute,
} as any)

const PublicAboutSlugRoute = PublicAboutSlugImport.update({
  path: '/about/$slug',
  getParentRoute: () => PublicRouteRoute,
} as any)

const PublicAuthenticatedProfileRoute = PublicAuthenticatedProfileImport.update(
  {
    path: '/profile',
    getParentRoute: () => PublicAuthenticatedRoute,
  } as any,
)

const PublicAuthenticatedCalendarRoute =
  PublicAuthenticatedCalendarImport.update({
    path: '/calendar',
    getParentRoute: () => PublicAuthenticatedRoute,
  } as any)

const PublicActivityTypeListRoute = PublicActivityTypeListImport.update({
  id: '/_list',
  getParentRoute: () => PublicActivityTypeRouteRoute,
} as any)

const PublicActivityTypeSlugRoute = PublicActivityTypeSlugImport.update({
  path: '/$slug',
  getParentRoute: () => PublicActivityTypeRouteRoute,
} as any)

const AdminActivityTypeSlugRouteRoute = AdminActivityTypeSlugRouteImport.update(
  {
    path: '/$slug',
    getParentRoute: () => AdminActivityTypeRouteRoute,
  } as any,
)

const AdminActivityTypeSlugIndexRoute = AdminActivityTypeSlugIndexImport.update(
  {
    path: '/',
    getParentRoute: () => AdminActivityTypeSlugRouteRoute,
  } as any,
)

const PublicActivityTypeListIndexRoute =
  PublicActivityTypeListIndexImport.update({
    path: '/',
    getParentRoute: () => PublicActivityTypeListRoute,
  } as any)

const AdminActivityTypeSlugSessionRoute =
  AdminActivityTypeSlugSessionImport.update({
    path: '/$session',
    getParentRoute: () => AdminActivityTypeSlugRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicRouteImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterRouteImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/logout': {
      id: '/logout'
      path: '/logout'
      fullPath: '/logout'
      preLoaderRoute: typeof LogoutImport
      parentRoute: typeof rootRoute
    }
    '/_public/$activityType': {
      id: '/_public/$activityType'
      path: '/$activityType'
      fullPath: '/$activityType'
      preLoaderRoute: typeof PublicActivityTypeRouteImport
      parentRoute: typeof PublicRouteImport
    }
    '/_public/people': {
      id: '/_public/people'
      path: '/people'
      fullPath: '/people'
      preLoaderRoute: typeof PublicPeopleRouteImport
      parentRoute: typeof PublicRouteImport
    }
    '/_public/venues': {
      id: '/_public/venues'
      path: '/venues'
      fullPath: '/venues'
      preLoaderRoute: typeof PublicVenuesRouteImport
      parentRoute: typeof PublicRouteImport
    }
    '/admin/$activityType': {
      id: '/admin/$activityType'
      path: '/$activityType'
      fullPath: '/admin/$activityType'
      preLoaderRoute: typeof AdminActivityTypeRouteImport
      parentRoute: typeof AdminImport
    }
    '/admin/registrations': {
      id: '/admin/registrations'
      path: '/registrations'
      fullPath: '/admin/registrations'
      preLoaderRoute: typeof AdminRegistrationsRouteImport
      parentRoute: typeof AdminImport
    }
    '/_auth/forgot': {
      id: '/_auth/forgot'
      path: '/forgot'
      fullPath: '/forgot'
      preLoaderRoute: typeof AuthForgotImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/reset_password': {
      id: '/_auth/reset_password'
      path: '/reset_password'
      fullPath: '/reset_password'
      preLoaderRoute: typeof AuthResetpasswordImport
      parentRoute: typeof AuthRouteImport
    }
    '/_auth/signup': {
      id: '/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof AuthSignupImport
      parentRoute: typeof AuthRouteImport
    }
    '/_public/_authenticated': {
      id: '/_public/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicAuthenticatedImport
      parentRoute: typeof PublicRouteImport
    }
    '/admin/timetable': {
      id: '/admin/timetable'
      path: '/timetable'
      fullPath: '/admin/timetable'
      preLoaderRoute: typeof AdminTimetableImport
      parentRoute: typeof AdminImport
    }
    '/register/code-of-conduct': {
      id: '/register/code-of-conduct'
      path: '/code-of-conduct'
      fullPath: '/register/code-of-conduct'
      preLoaderRoute: typeof RegisterCodeOfConductImport
      parentRoute: typeof RegisterRouteImport
    }
    '/register/completed': {
      id: '/register/completed'
      path: '/completed'
      fullPath: '/register/completed'
      preLoaderRoute: typeof RegisterCompletedImport
      parentRoute: typeof RegisterRouteImport
    }
    '/register/payment': {
      id: '/register/payment'
      path: '/payment'
      fullPath: '/register/payment'
      preLoaderRoute: typeof RegisterPaymentImport
      parentRoute: typeof RegisterRouteImport
    }
    '/register/workshops': {
      id: '/register/workshops'
      path: '/workshops'
      fullPath: '/register/workshops'
      preLoaderRoute: typeof RegisterWorkshopsImport
      parentRoute: typeof RegisterRouteImport
    }
    '/register/yourself': {
      id: '/register/yourself'
      path: '/yourself'
      fullPath: '/register/yourself'
      preLoaderRoute: typeof RegisterYourselfImport
      parentRoute: typeof RegisterRouteImport
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexImport
      parentRoute: typeof PublicRouteImport
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminImport
    }
    '/register/': {
      id: '/register/'
      path: '/'
      fullPath: '/register/'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof RegisterRouteImport
    }
    '/admin/$activityType/$slug': {
      id: '/admin/$activityType/$slug'
      path: '/$slug'
      fullPath: '/admin/$activityType/$slug'
      preLoaderRoute: typeof AdminActivityTypeSlugRouteImport
      parentRoute: typeof AdminActivityTypeRouteImport
    }
    '/_public/$activityType/$slug': {
      id: '/_public/$activityType/$slug'
      path: '/$slug'
      fullPath: '/$activityType/$slug'
      preLoaderRoute: typeof PublicActivityTypeSlugImport
      parentRoute: typeof PublicActivityTypeRouteImport
    }
    '/_public/$activityType/_list': {
      id: '/_public/$activityType/_list'
      path: ''
      fullPath: '/$activityType'
      preLoaderRoute: typeof PublicActivityTypeListImport
      parentRoute: typeof PublicActivityTypeRouteImport
    }
    '/_public/_authenticated/calendar': {
      id: '/_public/_authenticated/calendar'
      path: '/calendar'
      fullPath: '/calendar'
      preLoaderRoute: typeof PublicAuthenticatedCalendarImport
      parentRoute: typeof PublicAuthenticatedImport
    }
    '/_public/_authenticated/profile': {
      id: '/_public/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof PublicAuthenticatedProfileImport
      parentRoute: typeof PublicAuthenticatedImport
    }
    '/_public/about/$slug': {
      id: '/_public/about/$slug'
      path: '/about/$slug'
      fullPath: '/about/$slug'
      preLoaderRoute: typeof PublicAboutSlugImport
      parentRoute: typeof PublicRouteImport
    }
    '/_public/people/$id': {
      id: '/_public/people/$id'
      path: '/$id'
      fullPath: '/people/$id'
      preLoaderRoute: typeof PublicPeopleIdImport
      parentRoute: typeof PublicPeopleRouteImport
    }
    '/_public/venues/$id': {
      id: '/_public/venues/$id'
      path: '/$id'
      fullPath: '/venues/$id'
      preLoaderRoute: typeof PublicVenuesIdImport
      parentRoute: typeof PublicVenuesRouteImport
    }
    '/admin/registrations/$registrationId': {
      id: '/admin/registrations/$registrationId'
      path: '/$registrationId'
      fullPath: '/admin/registrations/$registrationId'
      preLoaderRoute: typeof AdminRegistrationsRegistrationIdImport
      parentRoute: typeof AdminRegistrationsRouteImport
    }
    '/admin/registrations/preferences': {
      id: '/admin/registrations/preferences'
      path: '/preferences'
      fullPath: '/admin/registrations/preferences'
      preLoaderRoute: typeof AdminRegistrationsPreferencesImport
      parentRoute: typeof AdminRegistrationsRouteImport
    }
    '/register/code-of-conduct/media': {
      id: '/register/code-of-conduct/media'
      path: '/media'
      fullPath: '/register/code-of-conduct/media'
      preLoaderRoute: typeof RegisterCodeOfConductMediaImport
      parentRoute: typeof RegisterCodeOfConductImport
    }
    '/register/workshops/$slug': {
      id: '/register/workshops/$slug'
      path: '/$slug'
      fullPath: '/register/workshops/$slug'
      preLoaderRoute: typeof RegisterWorkshopsSlugImport
      parentRoute: typeof RegisterWorkshopsImport
    }
    '/_public/people/': {
      id: '/_public/people/'
      path: '/'
      fullPath: '/people/'
      preLoaderRoute: typeof PublicPeopleIndexImport
      parentRoute: typeof PublicPeopleRouteImport
    }
    '/_public/venues/': {
      id: '/_public/venues/'
      path: '/'
      fullPath: '/venues/'
      preLoaderRoute: typeof PublicVenuesIndexImport
      parentRoute: typeof PublicVenuesRouteImport
    }
    '/admin/$activityType/': {
      id: '/admin/$activityType/'
      path: '/'
      fullPath: '/admin/$activityType/'
      preLoaderRoute: typeof AdminActivityTypeIndexImport
      parentRoute: typeof AdminActivityTypeRouteImport
    }
    '/admin/registrations/': {
      id: '/admin/registrations/'
      path: '/'
      fullPath: '/admin/registrations/'
      preLoaderRoute: typeof AdminRegistrationsIndexImport
      parentRoute: typeof AdminRegistrationsRouteImport
    }
    '/admin/$activityType/$slug/$session': {
      id: '/admin/$activityType/$slug/$session'
      path: '/$session'
      fullPath: '/admin/$activityType/$slug/$session'
      preLoaderRoute: typeof AdminActivityTypeSlugSessionImport
      parentRoute: typeof AdminActivityTypeSlugRouteImport
    }
    '/_public/$activityType/_list/': {
      id: '/_public/$activityType/_list/'
      path: '/'
      fullPath: '/$activityType/'
      preLoaderRoute: typeof PublicActivityTypeListIndexImport
      parentRoute: typeof PublicActivityTypeListImport
    }
    '/admin/$activityType/$slug/': {
      id: '/admin/$activityType/$slug/'
      path: '/'
      fullPath: '/admin/$activityType/$slug/'
      preLoaderRoute: typeof AdminActivityTypeSlugIndexImport
      parentRoute: typeof AdminActivityTypeSlugRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRouteRoute: AuthRouteRoute.addChildren({
    AuthForgotRoute,
    AuthLoginRoute,
    AuthResetpasswordRoute,
    AuthSignupRoute,
  }),
  PublicRouteRoute: PublicRouteRoute.addChildren({
    PublicActivityTypeRouteRoute: PublicActivityTypeRouteRoute.addChildren({
      PublicActivityTypeSlugRoute,
      PublicActivityTypeListRoute: PublicActivityTypeListRoute.addChildren({
        PublicActivityTypeListIndexRoute,
      }),
    }),
    PublicPeopleRouteRoute: PublicPeopleRouteRoute.addChildren({
      PublicPeopleIdRoute,
      PublicPeopleIndexRoute,
    }),
    PublicVenuesRouteRoute: PublicVenuesRouteRoute.addChildren({
      PublicVenuesIdRoute,
      PublicVenuesIndexRoute,
    }),
    PublicAuthenticatedRoute: PublicAuthenticatedRoute.addChildren({
      PublicAuthenticatedCalendarRoute,
      PublicAuthenticatedProfileRoute,
    }),
    PublicIndexRoute,
    PublicAboutSlugRoute,
  }),
  RegisterRouteRoute: RegisterRouteRoute.addChildren({
    RegisterCodeOfConductRoute: RegisterCodeOfConductRoute.addChildren({
      RegisterCodeOfConductMediaRoute,
    }),
    RegisterCompletedRoute,
    RegisterPaymentRoute,
    RegisterWorkshopsRoute: RegisterWorkshopsRoute.addChildren({
      RegisterWorkshopsSlugRoute,
    }),
    RegisterYourselfRoute,
    RegisterIndexRoute,
  }),
  AdminRoute: AdminRoute.addChildren({
    AdminActivityTypeRouteRoute: AdminActivityTypeRouteRoute.addChildren({
      AdminActivityTypeSlugRouteRoute:
        AdminActivityTypeSlugRouteRoute.addChildren({
          AdminActivityTypeSlugSessionRoute,
          AdminActivityTypeSlugIndexRoute,
        }),
      AdminActivityTypeIndexRoute,
    }),
    AdminRegistrationsRouteRoute: AdminRegistrationsRouteRoute.addChildren({
      AdminRegistrationsRegistrationIdRoute,
      AdminRegistrationsPreferencesRoute,
      AdminRegistrationsIndexRoute,
    }),
    AdminTimetableRoute,
    AdminIndexRoute,
  }),
  LogoutRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/_public",
        "/register",
        "/admin",
        "/logout"
      ]
    },
    "/_auth": {
      "filePath": "_auth/route.tsx",
      "children": [
        "/_auth/forgot",
        "/_auth/login",
        "/_auth/reset_password",
        "/_auth/signup"
      ]
    },
    "/_public": {
      "filePath": "_public/route.tsx",
      "children": [
        "/_public/$activityType",
        "/_public/people",
        "/_public/venues",
        "/_public/_authenticated",
        "/_public/",
        "/_public/about/$slug"
      ]
    },
    "/register": {
      "filePath": "register/route.tsx",
      "children": [
        "/register/code-of-conduct",
        "/register/completed",
        "/register/payment",
        "/register/workshops",
        "/register/yourself",
        "/register/"
      ]
    },
    "/admin": {
      "filePath": "admin.tsx",
      "children": [
        "/admin/$activityType",
        "/admin/registrations",
        "/admin/timetable",
        "/admin/"
      ]
    },
    "/logout": {
      "filePath": "logout.tsx"
    },
    "/_public/$activityType": {
      "filePath": "_public/$activityType/route.tsx",
      "parent": "/_public",
      "children": [
        "/_public/$activityType/$slug",
        "/_public/$activityType/_list"
      ]
    },
    "/_public/people": {
      "filePath": "_public/people/route.tsx",
      "parent": "/_public",
      "children": [
        "/_public/people/$id",
        "/_public/people/"
      ]
    },
    "/_public/venues": {
      "filePath": "_public/venues/route.tsx",
      "parent": "/_public",
      "children": [
        "/_public/venues/$id",
        "/_public/venues/"
      ]
    },
    "/admin/$activityType": {
      "filePath": "admin/$activityType/route.tsx",
      "parent": "/admin",
      "children": [
        "/admin/$activityType/$slug",
        "/admin/$activityType/"
      ]
    },
    "/admin/registrations": {
      "filePath": "admin/registrations/route.tsx",
      "parent": "/admin",
      "children": [
        "/admin/registrations/$registrationId",
        "/admin/registrations/preferences",
        "/admin/registrations/"
      ]
    },
    "/_auth/forgot": {
      "filePath": "_auth/forgot.tsx",
      "parent": "/_auth"
    },
    "/_auth/login": {
      "filePath": "_auth/login.tsx",
      "parent": "/_auth"
    },
    "/_auth/reset_password": {
      "filePath": "_auth/reset_password.tsx",
      "parent": "/_auth"
    },
    "/_auth/signup": {
      "filePath": "_auth/signup.tsx",
      "parent": "/_auth"
    },
    "/_public/_authenticated": {
      "filePath": "_public/_authenticated.tsx",
      "parent": "/_public",
      "children": [
        "/_public/_authenticated/calendar",
        "/_public/_authenticated/profile"
      ]
    },
    "/admin/timetable": {
      "filePath": "admin/timetable.tsx",
      "parent": "/admin"
    },
    "/register/code-of-conduct": {
      "filePath": "register/code-of-conduct.tsx",
      "parent": "/register",
      "children": [
        "/register/code-of-conduct/media"
      ]
    },
    "/register/completed": {
      "filePath": "register/completed.tsx",
      "parent": "/register"
    },
    "/register/payment": {
      "filePath": "register/payment.tsx",
      "parent": "/register"
    },
    "/register/workshops": {
      "filePath": "register/workshops.tsx",
      "parent": "/register",
      "children": [
        "/register/workshops/$slug"
      ]
    },
    "/register/yourself": {
      "filePath": "register/yourself.tsx",
      "parent": "/register"
    },
    "/_public/": {
      "filePath": "_public/index.tsx",
      "parent": "/_public"
    },
    "/admin/": {
      "filePath": "admin/index.tsx",
      "parent": "/admin"
    },
    "/register/": {
      "filePath": "register/index.tsx",
      "parent": "/register"
    },
    "/admin/$activityType/$slug": {
      "filePath": "admin/$activityType/$slug/route.tsx",
      "parent": "/admin/$activityType",
      "children": [
        "/admin/$activityType/$slug/$session",
        "/admin/$activityType/$slug/"
      ]
    },
    "/_public/$activityType/$slug": {
      "filePath": "_public/$activityType/$slug.tsx",
      "parent": "/_public/$activityType"
    },
    "/_public/$activityType/_list": {
      "filePath": "_public/$activityType/_list.tsx",
      "parent": "/_public/$activityType",
      "children": [
        "/_public/$activityType/_list/"
      ]
    },
    "/_public/_authenticated/calendar": {
      "filePath": "_public/_authenticated/calendar.tsx",
      "parent": "/_public/_authenticated"
    },
    "/_public/_authenticated/profile": {
      "filePath": "_public/_authenticated/profile.tsx",
      "parent": "/_public/_authenticated"
    },
    "/_public/about/$slug": {
      "filePath": "_public/about.$slug.tsx",
      "parent": "/_public"
    },
    "/_public/people/$id": {
      "filePath": "_public/people/$id.tsx",
      "parent": "/_public/people"
    },
    "/_public/venues/$id": {
      "filePath": "_public/venues/$id.tsx",
      "parent": "/_public/venues"
    },
    "/admin/registrations/$registrationId": {
      "filePath": "admin/registrations/$registrationId.tsx",
      "parent": "/admin/registrations"
    },
    "/admin/registrations/preferences": {
      "filePath": "admin/registrations/preferences.tsx",
      "parent": "/admin/registrations"
    },
    "/register/code-of-conduct/media": {
      "filePath": "register/code-of-conduct.media.tsx",
      "parent": "/register/code-of-conduct"
    },
    "/register/workshops/$slug": {
      "filePath": "register/workshops.$slug.tsx",
      "parent": "/register/workshops"
    },
    "/_public/people/": {
      "filePath": "_public/people/index.tsx",
      "parent": "/_public/people"
    },
    "/_public/venues/": {
      "filePath": "_public/venues/index.tsx",
      "parent": "/_public/venues"
    },
    "/admin/$activityType/": {
      "filePath": "admin/$activityType/index.tsx",
      "parent": "/admin/$activityType"
    },
    "/admin/registrations/": {
      "filePath": "admin/registrations/index.tsx",
      "parent": "/admin/registrations"
    },
    "/admin/$activityType/$slug/$session": {
      "filePath": "admin/$activityType/$slug/$session.tsx",
      "parent": "/admin/$activityType/$slug"
    },
    "/_public/$activityType/_list/": {
      "filePath": "_public/$activityType/_list.index.tsx",
      "parent": "/_public/$activityType/_list"
    },
    "/admin/$activityType/$slug/": {
      "filePath": "admin/$activityType/$slug/index.tsx",
      "parent": "/admin/$activityType/$slug"
    }
  }
}
ROUTE_MANIFEST_END */
