import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Typography } from 'rmwc';

import { Dialog } from 'utils/rmwc';

import { SmallGroup } from 'models';

interface RouteParams {
  id: string;
}

export function SmallGroupDeleteView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const params = useParams<RouteParams>();
  const group = SmallGroup.state.forId(params.id);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClosed={async (event: any) => {
          let next = `/small-groups/${params.id}`;
          if (event.detail.action === 'submit') {
            await group?.deleteAsync(SmallGroup.store);
            group?.delete();
            next = `/small-groups`;
          }
          history.push(next);
        }}
      >
        <Dialog.Title>Poista pienryhmä</Dialog.Title>
        <Dialog.Content>
          <Typography use="body1" tag="p">
            Halutako varmasti poistaa pienryhmän {group?.title ?? params.id}?
          </Typography>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button type="button" action="cancel" isDefaultAction>
            Peru
          </Dialog.Button>
          <Dialog.Button type="submit" action="submit" raised>
            Poista
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
