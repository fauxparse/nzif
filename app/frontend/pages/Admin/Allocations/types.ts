import tinycolor from '@ctrl/tinycolor';
import { amber, lime, red } from '@radix-ui/colors';
import { set, sortBy, uniqBy } from 'lodash-es';
import { DateTime } from 'luxon';

import { FestivalWorkshopAllocationQuery } from '@/graphql/types';

export type AllocationData = NonNullable<
  FestivalWorkshopAllocationQuery['festival']['workshopAllocation']
>;
export type RegistrationData = NonNullable<
  FestivalWorkshopAllocationQuery['festival']['registrations']
>[number];

export class Registration {
  public id: string;
  public name: string;
  public choices: Map<string, number>;
  public preferences: Map<string, string[]>;

  constructor(data: RegistrationData) {
    this.id = data.id;
    this.name = data.user?.profile?.name || '(unknown)';
    this.choices = new Map();
    this.preferences = data.preferences.reduce(
      (acc, pref) =>
        acc.set(
          pref.slot.id,
          set(acc.get(pref.slot.id) || [], pref.position - 1, pref.workshop.id)
        ),
      new Map()
    );
  }

  get score() {
    return Math.round(
      ([...this.choices.values()].reduce((acc, choice) => acc + 1.0 / choice, 0) * 100) /
        (this.preferences.size || 1)
    );
  }

  get color() {
    const t = this.score;
    const from = tinycolor(t < 50 ? red.red9 : amber.amber9);
    const to = tinycolor(t < 50 ? amber.amber9 : lime.lime9);
    const p = (t < 50 ? t : t - 50) * 2;
    return from.mix(to, p).toHexString();
  }

  get background() {
    return tinycolor(this.color).setAlpha(0.2).toRgbString();
  }

  place(slot: Slot, workshopId: string, push = true) {
    const choice = (this.preferences.get(slot.id)?.indexOf(workshopId) ?? -1) + 1;
    const session = slot.session(workshopId);
    if (session && choice) {
      this.choices.set(slot.id, choice);
      if (push) session.push(this);
    }
  }

  missedOut() {
    return [...this.preferences.keys()].filter((k) => !this.choices.has(k));
  }

  workshopPosition(slot: Slot, workshopId: string) {
    return (this.preferences.get(slot.id)?.indexOf(workshopId) ?? -1) + 1;
  }
}

export class Session {
  public id: string;
  public workshop: { id: string; name: string };
  public capacity: number;
  private _registrations: Registration[];
  public _waitlist: Registration[];
  public slot: Slot;

  constructor(data: AllocationData['slots'][number]['sessions'][number], slot: Slot) {
    this.id = data.id;
    this.workshop = { id: data.workshop.id, name: data.workshop.name };
    this.capacity = data.capacity;
    this._registrations = [];
    this._waitlist = [];
    this.slot = slot;
  }

  get color() {
    const t = (this._registrations.length * 100.0) / (this.capacity || 1);
    if (t > 100) return red.red9;
    if (t < 50) return amber.amber9;
    return lime.lime9;
  }

  get registrations() {
    return sortBy(this._registrations, ['score', (r) => r.id]);
  }

  get waitlist() {
    return sortBy(this._waitlist, ['score', (r) => r.id]);
  }

  get size() {
    return this.registrations.length;
  }

  push(registration: Registration) {
    if (this._registrations.includes(registration)) return;
    this._registrations = sortBy([...this._registrations, registration], 'score');
    this._waitlist = this._waitlist.filter((r) => r.id !== registration.id);
  }

  remove(registration: Registration) {
    this._registrations = this._registrations.filter((r) => r.id !== registration.id);
    registration.choices.delete(this.slot.id);
    this.addToWaitlist(registration);
  }

  addToWaitlist(registration: Registration) {
    if (this._waitlist.includes(registration)) return;
    this._waitlist = [...this._waitlist, registration];
  }
}

export class Slot {
  public id: string;
  public startsAt: DateTime;
  public sessions: Session[];

  constructor(data: AllocationData['slots'][number]) {
    this.id = data.id;
    this.sessions = data.sessions.map((s) => new Session(s, this));
    this.startsAt = data.startsAt;
  }

  session(workshopId: string) {
    return this.sessions.find((s) => s.workshop.id === workshopId);
  }

  get unassigned() {
    const ids = new Set(this.sessions.flatMap((s) => s.registrations.map((r) => r.id)));

    return sortBy(
      uniqBy(
        this.sessions.flatMap((s) => s.waitlist).filter(({ id }) => !ids.has(id)),
        (r) => r.id
      ),
      'score'
    );
  }
}

export type DraggableData = {
  registration: Registration;
  session: Session;
  waitlist: boolean;
};

export type DroppableData = {
  slot: Slot;
  session: Session | null;
  waitlist?: true;
};
