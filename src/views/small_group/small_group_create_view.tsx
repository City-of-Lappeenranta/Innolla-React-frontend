import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';

import { useForm } from 'form';
import { SmallGroup } from 'models';
import * as field from './fields';

interface Form {
  title?: string;
  unit?: string;
  profiles?: Array<string>;
}

export function SmallGroupCreateView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    onSubmit: async (values: any) => {
      return await SmallGroup.store.create(new SmallGroup(values));
    },
    afterSubmit: (result: SmallGroup) => {
      if (result instanceof SmallGroup) {
        history.push(`/small-groups/${result.id}`);
      }
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClosed={() => history.push('/small-groups')}
      >
        <Form>
          <Dialog.Title>Luo pienryhmä</Dialog.Title>
          <Dialog.Content>
            <Grid style={{ padding: '20px 0' }}>
              <field.Title />
              <field.UnitSelect />
              <field.Profiles />
            </Grid>
          </Dialog.Content>
          <Dialog.Actions>
            <Dialog.Button type="button" action="cancel">
              Peru
            </Dialog.Button>
            <Dialog.Button type="submit" raised isDefaultAction>
              Luo
            </Dialog.Button>
          </Dialog.Actions>
        </Form>
      </Dialog>
    </>
  );
}
