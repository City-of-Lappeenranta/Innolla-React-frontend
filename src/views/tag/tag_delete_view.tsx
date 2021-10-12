import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog } from 'utils/rmwc';
import { Tag } from 'models/tag';

export function TagDeleteView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const { id = null }: any = useParams();
  const tag: Tag | undefined = Tag.state.forId(id);

  async function getNext(action: string) {
    switch (action) {
      case 'submit':
        await Tag.store.delete(tag!);
        tag?.delete();
        return `/tags`;
      default:
        return `/tags/${id}`;
    }
  }
  async function onClosed(e: any) {
    const action: string = e.detail.action;
    const next = await getNext(action);
    history.push(next);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
      <Dialog.Title>Poista tagi</Dialog.Title>
      <Dialog.Content>
        Halutako varmasti poistaa tagin {tag?.title}?
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
