import {
  ForeignKey,
  ManyField,
  Model,
  QuerySet,
  State,
} from '@dream/lucid-orm';

import { UserStore } from './store';
import { Profile } from 'models/profile';
import { Group } from 'models/group';
import { Permission } from 'models/permission';

export class User extends Model<User> {
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  password: string | undefined;
  password2: string | undefined;

  private _token: string | null | undefined = null;

  public get token(): string | null | undefined {
    if (!this._token) {
      this._token = localStorage.getItem('token');
    }
    return this._token;
  }

  public set token(value: string | null | undefined) {
    if (value !== undefined) {
      localStorage.setItem('token', value ?? '');
    }
    this._token = value;
  }

  get name(): string | undefined {
    if (!this.firstName && !this.lastName) return undefined;
    return `${this.firstName} ${this.lastName}`;
  }

  _profile = new ForeignKey<Profile>(Profile.state);

  get profile() {
    return this._profile.get();
  }

  set profile(profile) {
    profile && this._profile.set(profile);
  }

  _groups = new ManyField<Group>(Group.state);

  get groups(): ManyField<Group> {
    return this._groups.get();
  }

  set groups(groups: ManyField<Group> | string[] | QuerySet<Group>) {
    groups && this._groups.set(groups);
  }

  get permissions() {
    let permissions: Array<string> = [];
    this.groups.all().forEach((group) => {
      permissions = [...permissions, ...group.permissions.ids];
    });
    return Permission.state.forIds(permissions);
  }

  constructor(props: Partial<User>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<User>();
  static store = new UserStore();
  static current: User = new User({});
}
