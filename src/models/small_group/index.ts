import {
  Model,
  ManyField,
  ForeignKey,
  State,
  QuerySet,
} from '@dream/lucid-orm';

import { SmallGroupStore } from './store';

import { Unit, Profile } from 'models';

export class SmallGroup extends Model<SmallGroup> {
  title: string | undefined;

  _unit = new ForeignKey<Unit>(Unit.state);

  get unit(): Unit | undefined {
    return this._unit.get();
  }

  set unit(unit: string | Unit | undefined) {
    unit && this._unit.set(unit);
  }

  _profiles = new ManyField<Profile>(Profile.state);

  get profiles(): ManyField<Profile> {
    return this._profiles.get();
  }

  set profiles(profiles: ManyField<Profile> | string[] | QuerySet<Profile>) {
    profiles && this._profiles.set(profiles);
  }

  constructor(props: Partial<SmallGroup>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<SmallGroup>();
  static store = new SmallGroupStore();
}
