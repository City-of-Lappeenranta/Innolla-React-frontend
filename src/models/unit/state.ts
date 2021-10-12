import { State } from '@dream/lucid-orm';

import { Unit } from '.';

export class UnitState extends State<Unit> {
  current: string | undefined;
}
