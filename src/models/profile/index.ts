import { ForeignKey, ManyField, Model } from '@dream/lucid-orm';

import { ProfileStore } from './store';
import { Unit, User, Tag, ActivityTime, Assessment } from 'models';
import { AssessmentResponse } from 'models/assessment_response';
import { ProfileState } from './state';

export class Profile extends Model<Profile> {
  _picture: string | undefined;
  pictureFile: File | undefined;

  get picture(): string | undefined {
    return this._picture
      ? `${process.env.REACT_APP_MEDIA_URL}/${this._picture}`
      : '/img/avatar_placeholder.png';
  }

  set picture(picture: string | undefined) {
    this._picture = picture;
  }

  _unit = new ForeignKey<Unit>(Unit.state);

  get unit(): Unit | undefined {
    return this._unit.get();
  }

  set unit(unit: string | Unit | undefined) {
    unit && this._unit.set(unit);
  }

  _user = new ForeignKey<User>(User.state);

  get user() {
    return this._user.get();
  }

  set user(user) {
    user && this._user.set(user);
  }

  _tags = new ManyField<Tag>(Tag.state);

  get tags() {
    return this._tags.get();
  }

  set tags(tags) {
    tags && this._tags.set(tags);
  }

  _activities = new ManyField<ActivityTime>(ActivityTime.state);

  get activities() {
    return this._activities.get();
  }

  set activities(activities) {
    activities && this._activities.set(activities);
  }

  _assessments = new ManyField<Assessment>(Assessment.state);

  get assessments() {
    return this._assessments.get();
  }

  set assessments(assessments) {
    assessments && this._assessments.set(assessments);
  }

  get responses() {
    let responses: Array<string> = [];
    this.assessments.all().forEach((assessment) => {
      responses = [...responses, ...assessment.responses.ids];
    });
    return AssessmentResponse.state.forIds(responses);
  }

  constructor(props: Partial<Profile>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new ProfileState();
  static store = new ProfileStore();
}
