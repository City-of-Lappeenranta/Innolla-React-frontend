import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { Unit } from 'models';

export function UnitDeleteView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null }: any = useParams();
  const unit: Unit | undefined = Unit.state.forId(id);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await Unit.store.delete(unit!);
        unit?.delete();
        return `/units`;
      default:
        return `/units/${id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista yksikkö</Dialog.Title>
      <Dialog.Content>
        Halutako varmasti poistaa yksikön {unit?.title}?
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
