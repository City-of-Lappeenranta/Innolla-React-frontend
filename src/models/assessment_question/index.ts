import { Model, State } from '@dream/lucid-orm';
import { AssessmentQuestionStore } from './store';

export class AssessmentQuestion extends Model<AssessmentQuestion> {
  static CHILD = 'child';
  static ADULT = 'adult';
  static ACTIVITY = 'activity';

  static OF_CHOICES = [
    { label: 'Lapsesta', value: AssessmentQuestion.CHILD },
    { label: 'Aikuisesta', value: AssessmentQuestion.ADULT },
    { label: 'Toiminnasta', value: AssessmentQuestion.ACTIVITY },
  ];

  of: string | undefined;
  text: string | undefined;

  constructor(props: Partial<AssessmentQuestion>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<AssessmentQuestion>();
  static store = new AssessmentQuestionStore();
}
