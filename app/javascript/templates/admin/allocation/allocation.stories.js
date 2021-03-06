import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import faker from 'faker'
import entries from 'lodash/entries'
import groupBy from 'lodash/groupBy'
import sampleSize from 'lodash/sampleSize'
import shuffle from 'lodash/shuffle'
import times from 'lodash/times'
import moment from 'lib/moment'
import { useToggle, useChanged } from 'lib/hooks'
import Allocation from './'
import { useAllocations } from './hooks'

const year = new Date().getYear() + 1900

const DAYS = times(5, i => moment().startOf('day').add(i, 'days'))

const FESTIVAL = {
  year,
  adminRoot: `/admin/${year}`,
}

const SESSIONS = DAYS.reduce((list, day) => [
  ...list,
  ...times(4, () => ({
    id: faker.random.uuid(),
    startsAt: day.clone().hour(10),
    endsAt: day.clone().hour(13),
    capacity: 12,
    activity: {
      id: faker.random.uuid(),
      type: 'workshop',
      name: faker.commerce.productName(),
    },
  })),
], [])

const REGISTRATIONS = times(50, () => ({
  id: faker.random.uuid(),
  user: {
    id: faker.random.uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  },
  preferences:
    entries(
      groupBy(
        sampleSize(SESSIONS, Math.ceil(Math.random() * 15) + 5),
        s => s.startsAt.valueOf()
      )
    )
    .reduce((list, [, sessions]) => [
      ...list,
      ...sessions.map((s, i) => ({ sessionId: s.id, position: i + 1 }))
    ], [])
}))

const AllocationDemo = (props) => {
  const [seed, setSeed] = useState(faker.random.number())

  const reseed = () => setSeed(faker.random.number())

  const newState = () => {
    const timeslots = entries(groupBy(SESSIONS, s => s.startsAt.valueOf()))

    return timeslots.reduce((result, [time, sessions]) => ({
      ...result,
      [time]: sessions.reduce((group, session) => {
        const all =
          REGISTRATIONS
          .filter(r => r.preferences.some(p => p.sessionId === session.id && p.position === 1))
          .map((r, i) => ({ registrationId: r.id, position: i + 1, locked: false }))
        return {
          ...group,
          [session.id]: shuffle(all.slice(0, session.capacity)),
          unallocated: shuffle([...group.unallocated, ...all.slice(session.capacity)]),
        }
      }, { unallocated: [] }),
    }), {})
  }

  const [allocations, move, reset] = useAllocations(newState())

  useChanged(() => reset(newState()), [seed], [reset])

  const [finalizing, , finalize] = useToggle(false)

  return (
    <Allocation
      festival={FESTIVAL}
      sessions={SESSIONS}
      registrations={REGISTRATIONS}
      allocations={allocations}
      seed={seed}
      finalizing={finalizing}
      onShuffle={reseed}
      onMove={move}
      onFinalize={finalize}
      {...props}
    />
  )
}

storiesOf('Templates|Admin/Activities', module)
  .addParameters({ options: { padding: false, theme: 'dark' } })
  .add('Allocation', () => (
    <AllocationDemo loading={boolean('Loading', false)} />
  ))
  .add('Allocation finalized', () => (
    <AllocationDemo finalized />
  ))
