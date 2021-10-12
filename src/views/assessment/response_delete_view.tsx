import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { AssessmentResponse } from 'models';
import { useSetState } from 'hooks';

export function AssessmentResponseDeleteView() {
  const setState = useSetState();
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null, responseId = null }: any = useParams();
  const response = AssessmentResponse.state.forId(responseId);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await AssessmentResponse.store.delete(response!);
        response?.delete();
        setState();
        return `/assessments/${id}`;
      default:
        return `/assessments/${id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista vastaus</Dialog.Title>
      <Dialog.Content>
        Halutako varmasti poistaa vastauksen "{response?.answer}"?
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
