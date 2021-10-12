import { ForeignKey, Model, State } from '@dream/lucid-orm';
import { Assessment } from 'models/assessment';
import { AssessmentQuestion } from 'models/assessment_question';
import { AssessmentResponseStore } from './store';

export class AssessmentResponse extends Model<AssessmentResponse> {
  static CHILD = 'child';
  static ADULT = 'adult';
  static ACTIVITY = 'activity';

  static OF_CHOICES = [
    { label: 'Lapsesta', value: AssessmentResponse.CHILD },
    { label: 'Aikuisesta', value: AssessmentResponse.ADULT },
    { label: 'Toiminnasta', value: AssessmentResponse.ACTIVITY },
  ];

  of: string | undefined;
  answer: string | undefined;

  _assessment = new ForeignKey<Assessment>(Assessment.state);

  get assessment() {
    return this._assessment.get();
  }

  set assessment(assessment) {
    assessment && this._assessment.set(assessment);
  }

  _question = new ForeignKey<AssessmentQuestion>(AssessmentQuestion.state);

  get question() {
    return this._question.get();
  }

  set question(question) {
    question && this._question.set(question);
  }

  constructor(props: Partial<AssessmentResponse>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<AssessmentResponse>();
  static store = new AssessmentResponseStore();
}
