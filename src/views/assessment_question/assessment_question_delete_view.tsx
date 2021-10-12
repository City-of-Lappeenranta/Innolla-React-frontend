import { useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { AssessmentQuestion } from 'models/assessment_question';

export function AssessmentQuestionDeleteView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null }: any = useRouteMatch().params;
  const question: AssessmentQuestion | undefined =
    AssessmentQuestion.state.forId(id);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await AssessmentQuestion.store.delete(question!);
        question?.delete();
        return `/assessment-questions`;
      default:
        return `/assessment-questions/${id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista arviointikysymys</Dialog.Title>
      <Dialog.Content>
        Halutako varmasti poistaa arviointikysymyksen?
      </Dialog.Content>
      <Dialog.Actions>
        <Dialog.Button action="cancel" type="button" isDefaultAction>
          Peru
        </Dialog.Button>
        <Dialog.Button action="submit" raised>
          Poista
        </Dialog.Button>
      </Dialog.Actions>
    </Dialog>
  );
}
