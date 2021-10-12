import { ManyField, Model, State } from '@dream/lucid-orm';

import { GroupStore } from './store';
import { Permission } from 'models/permission';

export class Group extends Model<Group> {
  name: string | undefined;

  _permissions = new ManyField<Permission>(Permission.state);

  get permissions() {
    return this._permissions.get();
  }

  set permissions(permissions) {
    permissions && this._permissions.set(permissions);
  }

  constructor(props: Partial<Group>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<Group>();
  static store = new GroupStore();
}
