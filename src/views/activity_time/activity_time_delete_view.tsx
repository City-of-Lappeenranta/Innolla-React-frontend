import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { ActivityTime } from 'models';
import { useSetState } from 'hooks';

export function ActivityTimeDeleteView() {
  const setState = useSetState();
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null }: any = useParams();
  const activityTime = ActivityTime.state.forId(id);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await ActivityTime.store.delete(activityTime!);
        activityTime?.delete();
        setState();
        return `/reservations`;
      default:
        return `/reservations/${id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista toimintahetki</Dialog.Title>
      <Dialog.Content>
        Halutako varmasti poistaa toimintahetken {activityTime?.title}?
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
