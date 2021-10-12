import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from 'rmwc';

import { Dialog } from 'utils/rmwc';
import { useForm } from 'form';
import { Tag } from 'models/tag';
import * as field from '../fields';

interface Props {
  tag: Tag | undefined;
}

interface Form extends Tag {}

export function TagEditDialog({ tag }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    defaultValues: tag,
    onSubmit: async (values: Form) => {
      Object.assign(tag!, values);
      return await Tag.store.update(tag!);
    },
    afterSubmit: (tag: Tag) => {
      history.push(`/tags/${tag?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/tags/${tag?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Muokkaa tagia</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.Category />
            <field.Title />
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
