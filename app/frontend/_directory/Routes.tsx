import { route } from 'react-router-typesafe-routes/dom';
import { zod } from 'react-router-typesafe-routes/zod';
import { z } from 'zod';

const dateTime = zod(z.string().regex(/^\d{4}-\d{2}-\d{2}-\d{4}$/));

export const ROUTES = {
  DIRECTORY: route(
    'directory',
    {},
    {
      TIMESLOT: route(
        ':timeslot',
        { params: { timeslot: dateTime } },
        {
          PERSON: route(':id', { params: { id: zod(z.string()) } }),
        }
      ),
    }
  ),
};
