import { ForeignKey, ManyField, Model } from '@dream/lucid-orm';

import { RoomStore } from './store';
import { RoomState } from './state';
import { Unit } from 'models/unit';
import { ActivityTime } from 'models/activity_time';

export class Room extends Model<Room> {
  title: string | undefined;
  capacity: number | undefined;

  imageFile: File | undefined;
  _image: string | undefined;

  get image(): string | undefined {
    return this._image || undefined;
  }

  set image(image: string | undefined) {
    this._image = image;
  }

  _unit = new ForeignKey<Unit>(Unit.state);

  get unit() {
    return this._unit.get();
  }

  set unit(unit) {
    unit && this._unit.set(unit);
  }

  _activities = new ManyField<ActivityTime>(ActivityTime.state);

  get activities() {
    return this._activities.get();
  }

  set activities(activities) {
    activities && this._activities.set(activities);
  }

  constructor(props: Partial<Room>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new RoomState();
  static store = new RoomStore();
}
