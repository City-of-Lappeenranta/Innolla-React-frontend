import { ForeignKey, ManyField, Model } from '@dream/lucid-orm';

import { AssessmentStore } from './store';
import { AssessmentState } from './state';
import { ActivityTime, AssessmentResponse, Profile } from 'models';

export class Assessment extends Model<Assessment> {
  rating: number | undefined;

  constructor(props: Partial<Assessment>) {
    super(props);
    Object.assign(this, props);
  }

  _ofChild = new ForeignKey<Profile>(Profile.state);

  get ofChild() {
    return this._ofChild.get();
  }

  set ofChild(ofChild) {
    ofChild && this._ofChild.set(ofChild);
  }

  _ofActivity = new ForeignKey<ActivityTime>(ActivityTime.state);

  get ofActivity() {
    return this._ofActivity.get();
  }

  set ofActivity(ofActivity) {
    ofActivity && this._ofActivity.set(ofActivity);
  }

  _responses = new ManyField<AssessmentResponse>(AssessmentResponse.state);

  get responses() {
    return this._responses.get();
  }

  set responses(responses) {
    responses && this._responses.set(responses);
  }

  static state = new AssessmentState();
  static store = new AssessmentStore();
}
