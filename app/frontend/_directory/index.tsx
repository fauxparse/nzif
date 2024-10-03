import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Layout from './Layout';
import Result from './Result';
import { ROUTES } from './Routes';
import Search from './Search';
import Sessions from './Sessions';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.DIRECTORY.TIMESLOT.path,
        element: <Search />,
        children: [
          {
            path: ROUTES.DIRECTORY.TIMESLOT.PERSON.path,
            element: <Result />,
          },
        ],
      },
      {
        path: ROUTES.DIRECTORY.path,
        element: <Sessions />,
      },
    ],
  },
]);

const Directory: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Directory;
