import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'rmwc';

import { Dialog } from 'utils/rmwc';
import { useForm } from 'form';
import { Room } from 'models/room';
import * as field from '../fields';

export function RoomCreateDialog() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    onSubmit: async (values: any) => {
      return await Room.store.create(new Room(values));
    },
    afterSubmit: (room: Room) => {
      history.push(`/rooms/${room?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/rooms`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Luo tila</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Title />
            <field.Capacity />
            <field.UnitSelect />
            <field.Image />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button action="submit" raised isDefaultAction>
            Luo
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}

interface Props {
  room: Room | undefined;
}

interface Form {
  title?: string;
  capacity?: number;
  unit?: string;
  imageFile?: File;
}

export function RoomEditDialog({ room }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    defaultValues: {
      title: room?.title,
      capacity: room?.capacity,
      unit: room?._unit.id,
    },
    onSubmit: async (values: Form) => {
      Object.assign(room!, values);
      return await Room.store.update(room!);
    },
    afterSubmit: (room: Room) => {
      history.push(`/rooms/${room?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/rooms/${room?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Muokkaa tilaa</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Title />
            <field.Capacity />
            <field.UnitSelect />
            <field.Image />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel">Peru</Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Muokkaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
