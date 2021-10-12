import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';
import { Summary } from 'views/generic/summary';
import { ActivityTimeForm } from '../reservable_room_list_view';

interface Props {
  form: ActivityTimeForm;
}

export function RoomSummaryDialog({ form }: Props) {
  const history = useHistory();
  const [open, setOpen] = useState(true);

  async function onClosed() {
    history.push(`/reservable-rooms`);
  }

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Yhteenveto</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <Grid.Cell span={12}>
              <Summary form={form} />
            </Grid.Cell>
          </Grid>
        </Dialog.Content>

        <Dialog.Actions>
          <Dialog.Button
            className="mdc-dialog__button--cancel"
            action="cancel"
            type="button"
          >
            Peruuta
          </Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Varaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
