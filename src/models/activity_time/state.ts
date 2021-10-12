import { QuerySet, State } from '@dream/lucid-orm';

import { ActivityTime } from '.';
import { Unit } from 'models/unit';

export class ActivityTimeState extends State<ActivityTime> {
  forCurrentUnit(): QuerySet<ActivityTime> {
    return this.all().filter((o) => o.room?._unit?.id === Unit.state.current);
  }
}
