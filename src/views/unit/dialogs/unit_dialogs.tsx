import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'rmwc';

import { useForm } from 'form';
import { Dialog } from 'utils/rmwc';
import { Unit } from 'models';
import * as field from '../fields';

export function UnitCreateDialog() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    onSubmit: async (values: Form) => {
      return await Unit.store.create(new Unit(values));
    },
    afterSubmit: (unit: Unit) => {
      history.push(`/units/${unit?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/units`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Luo yksikkö</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Title />
            <field.Address />
            <field.City />
            <field.PostalCode />
            <field.FloorPlan />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Luo
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}

interface Props {
  unit: Unit | undefined;
}

interface Form {
  title?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  floorPlanFile?: File;
  floorPlan?: string;
}

export function UnitEditDialog({ unit }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    defaultValues: {
      title: unit?.title,
      address: unit?.address,
      city: unit?.city,
      postalCode: unit?.postalCode,
    },
    onSubmit: async (values: Form) => {
      Object.assign(unit!, values);
      return await Unit.store.update(unit!);
    },
    afterSubmit: (unit: Unit) => {
      history.push(`/units/${unit?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/units/${unit?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Muokkaa yksikköä</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Title />
            <field.Address />
            <field.City />
            <field.PostalCode />
            <field.FloorPlan />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Muokkaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
