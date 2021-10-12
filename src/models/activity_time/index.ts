import { format, isValid } from 'date-fns';
import { ForeignKey, ManyField, Model } from '@dream/lucid-orm';

import { ActivityTimeStore } from './store';
import { Room } from 'models/room';
import { SmallGroup } from 'models/small_group';
import { Profile } from 'models/profile';
import { ActivityTimeState } from './state';

export class ActivityTime extends Model<ActivityTime> {
  title: string | undefined;
  startTime: Date | undefined;
  endTime: Date | undefined;

  getStartTimeFormat(_format: string = 'HH:mm:ss'): string | undefined {
    if (!isValid(this.startTime)) return undefined;
    const startTime = format(this.startTime!, _format);
    return startTime;
  }

  getEndTimeFormat(_format: string = 'HH:mm:ss'): string | undefined {
    if (!isValid(this.endTime)) return undefined;
    const endTime = format(this.endTime!, _format);
    return endTime;
  }

  getDateTime(): string | undefined {
    if (!isValid(this.startTime) || !isValid(this.endTime)) return undefined;
    const startTime = format(this.startTime!, 'dd.MM.yyyy HH:mm');
    const endTime = format(this.endTime!, 'HH:mm');
    return `${startTime} - ${endTime}`;
  }

  _room = new ForeignKey<Room>(Room.state);

  get room() {
    return this._room.get();
  }

  set room(room) {
    room && this._room.set(room);
  }

  _participants = new ManyField<Profile>(Profile.state);

  get participants() {
    return this._participants.get();
  }

  set participants(participants) {
    participants && this._participants.set(participants);
  }

  _smallGroups = new ManyField<SmallGroup>(SmallGroup.state);

  get smallGroups() {
    return this._smallGroups.get();
  }

  set smallGroups(smallGroups) {
    smallGroups && this._smallGroups.set(smallGroups);
  }

  constructor(props: Partial<ActivityTime>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new ActivityTimeState();
  static store = new ActivityTimeStore();
}
