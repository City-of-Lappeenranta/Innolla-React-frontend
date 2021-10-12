import { QuerySet, State } from '@dream/lucid-orm';

import { Room } from '.';
import { Unit } from 'models/unit';

export class RoomState extends State<Room> {
  forUnit(id: string | undefined): QuerySet<Room> {
    return this.all().filter((o) => o.unit?.id === id);
  }

  forCurrentUnit(): QuerySet<Room> {
    return this.all().filter((o) => o._unit.id === Unit.state.current);
  }
}
