import { ManyField, Model } from '@dream/lucid-orm';

import { UnitState } from './state';
import { UnitStore } from './store';
import { Room } from 'models/room';

export class Unit extends Model<Unit> {
  title: string | undefined;
  address: string | undefined;
  city: string | undefined;
  postalCode: string | undefined;
  floorPlanFile: File | undefined;
  floorPlan: string | undefined;

  _rooms = new ManyField<Room>(Room.state);

  get rooms() {
    return this._rooms.get();
  }

  set rooms(rooms) {
    rooms && this._rooms.set(rooms);
  }

  constructor(props: Partial<Unit>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new UnitState();
  static store = new UnitStore();
}
