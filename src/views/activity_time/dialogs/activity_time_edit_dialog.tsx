import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';
import { useForm } from 'form';
import { ActivityTime } from 'models';
import * as field from '../fields';

interface Props {
  activityTime: ActivityTime | undefined;
}

export interface ActivityTimeForm {
  title?: string;
  participants?: Array<string>;
  smallGroups?: Array<string>;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  room?: string;
}

export function ActivityTimeEditDialog({ activityTime }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form, form } = useForm<ActivityTimeForm>({
    defaultValues: {
      ...activityTime,
      room: activityTime?._room.id,
      participants: activityTime?._participants.ids,
      smallGroups: activityTime?._smallGroups.ids,
    },
    onSubmit: async (values: any) => {
      Object.assign(activityTime, values);
      return await ActivityTime.store.update(activityTime!);
    },
    afterSubmit: (result: ActivityTime) => {
      if (result instanceof ActivityTime) {
        history.push(`/reservations/${activityTime?.id}`);
      }
    },
  });

  async function onClosed() {
    history.push(`/reservations/${activityTime?.id}`);
  }

  return (
    <>
      <Form>
        <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
          <Dialog.Title>Muokkaa toimintahetkeä</Dialog.Title>
          <Dialog.Content>
            <Grid style={{ padding: '20px 0' }}>
              <field.TitleField />
              <field.RoomSelect />
              <field.DateField />
              <field.StartTimeField />
              <field.EndTimeField />
              <field.Participants />
              <field.SmallGroups />
            </Grid>
          </Dialog.Content>
          <Dialog.Actions>
            <Dialog.Button action="cancel" type="button">
              Peru
            </Dialog.Button>
            <Dialog.Button
              type="submit"
              raised
              isDefaultAction
              disabled={!form.isValid || !form.isTouched}
            >
              Muokkaa
            </Dialog.Button>
          </Dialog.Actions>
        </Dialog>
      </Form>
    </>
  );
}
