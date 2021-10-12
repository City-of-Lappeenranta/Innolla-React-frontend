import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { Room } from 'models/room';
import { useSetState } from 'hooks';

export function RoomDeleteView() {
  const setState = useSetState();
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null }: any = useParams();
  const room: Room | undefined = Room.state.forId(id);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await Room.store.delete(room!);
        room?.delete();
        setState();
        return `/rooms`;
      default:
        return `/rooms/${id}`;
    }
  }

  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista tila</Dialog.Title>
      <Dialog.Content>
        Haluatko varmasti poistaa tilan {room?.title}?
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
