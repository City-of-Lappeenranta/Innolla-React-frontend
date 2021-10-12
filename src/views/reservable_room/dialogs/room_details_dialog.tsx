import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { ActivityTimeForm } from '../reservable_room_list_view';

import { Dialog, Grid } from 'utils/rmwc';
import { Summary } from 'views/generic/summary';
import * as field from '../fields';

interface Props {
  form: ActivityTimeForm;
}

export function RoomDetailsDialog({ form }: Props) {
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const { id = null }: any = useParams();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onClosed={() => {
        history.push(`/reservable-rooms`);
      }}
    >
      <Dialog.Title>Toimintahetken tiedot</Dialog.Title>
      <Dialog.Content>
        <Grid style={{ padding: '20px 0' }}>
          <Grid.Cell span={12}>
            <Summary form={form} />
          </Grid.Cell>
          <field.TitleField />
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
        <Dialog.Button
          raised
          tag={Link}
          to={`/reservable-rooms/${id}/participants`}
          isDefaultAction
        >
          Seuraava
        </Dialog.Button>
      </Dialog.Actions>
    </Dialog>
  );
}
