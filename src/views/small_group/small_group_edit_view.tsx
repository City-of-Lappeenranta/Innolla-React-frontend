import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';

import { useForm } from 'form';
import { SmallGroup } from 'models';
import * as field from './fields';

interface RouteParams {
  id: string;
}

interface Form {
  title?: string;
  unit?: string;
  profiles?: Array<string>;
}

export function SmallGroupEditView() {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const params = useParams<RouteParams>();
  const group = SmallGroup.state.forId(params.id);

  const { Form } = useForm<Form>({
    defaultValues: {
      title: group?.title,
      unit: group?.unit?.id,
      profiles: group?.profiles.ids,
    },
    onSubmit: async (values: Form) => {
      Object.assign(group, values);
      return await SmallGroup.store.update(group!);
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
        onClosed={() => history.push(`/small-groups/${params.id}`)}
      >
        <Form>
          <Dialog.Title>Muokkaa pienryhmää</Dialog.Title>
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
            <Dialog.Button type="submit" action="submit" raised isDefaultAction>
              Muokkaa
            </Dialog.Button>
          </Dialog.Actions>
        </Form>
      </Dialog>
    </>
  );
}
