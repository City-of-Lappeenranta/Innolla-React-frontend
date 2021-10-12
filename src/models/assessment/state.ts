import { QuerySet, State } from '@dream/lucid-orm';
import { ActivityTime } from 'models/activity_time';

import { Assessment } from '.';
import { Profile } from 'models/profile';
import { Unit } from 'models/unit';

export class AssessmentState extends State<Assessment> {
  forCurrentUnit(): QuerySet<Assessment> {
    return this.all().filter((o) => o.ofChild?._unit.id === Unit.state.current);
  }

  forChildAndActivity(
    ofChild: Profile,
    ofActivity: ActivityTime
  ): Assessment | undefined {
    return this.all().find(
      (o) => o.ofChild?.id === ofChild.id && o.ofActivity?.id === ofActivity.id
    );
  }
}
