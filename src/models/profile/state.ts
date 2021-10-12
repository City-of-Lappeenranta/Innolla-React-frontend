import { QuerySet, State } from '@dream/lucid-orm';

import { Profile } from '.';
import { Unit } from 'models/unit';

export class ProfileState extends State<Profile> {
  forCurrentUnit(): QuerySet<Profile> {
    return this.all().filter((o) => o._unit.id === Unit.state.current);
  }
}
