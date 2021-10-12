import { ForeignKey, Model, State } from '@dream/lucid-orm';

import { PermissionStore } from './store';
import { Group } from 'models/group';

export class Permission extends Model<Permission> {
  name: string | undefined;
  codename: string | undefined;

  _group = new ForeignKey<Group>(Group.state);

  get group() {
    return this._group.get();
  }

  set group(group) {
    group && this._group.set(group);
  }

  constructor(props: Partial<Permission>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<Permission>();
  static store = new PermissionStore();
}
