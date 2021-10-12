import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useSetState, useAsyncEffect } from 'hooks';
import { Dialog, Grid } from 'utils/rmwc';
import { ActivityTime, Assessment, Profile, User } from 'models';
import * as field from '../fields';
import { useForm } from 'form';

interface Form {
  ofChild: string;
  ofActivity: string;
}

export function AssessmentCreateDialog() {
  const setState = useSetState();
  const [open, setOpen] = useState(true);
  const history = useHistory();

  useAsyncEffect(async (isMounted) => {
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    ActivityTime.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.all();
    Profile.store.all();
    ActivityTime.store.all();
  }, []);

  const { Form } = useForm<Form>({
    onSubmit: async (values: Form) => {
      const ofChild = Profile.state.forId(values.ofChild);
      const ofActivity = ActivityTime.state.forId(values.ofActivity);
      const existing = await Assessment.state.forChildAndActivity(
        ofChild!,
        ofActivity!
      );
      if (existing) return existing;
      return await Assessment.store.create(
        new Assessment({ ofChild, ofActivity })
      );
    },
    afterSubmit: (assessment: Assessment) => {
      history.push(`/assessments/${assessment?.id}`);
    },
  });

  return (
    <Form>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClosed={() => {
          history.push('/assessments');
        }}
      >
        <Dialog.Title>Valitse lapsi ja toimintahetki</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.ProfileSelect />
            <field.ActivityTimeSelect />
          </Grid>
        </Dialog.Content>

        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peruuta
          </Dialog.Button>
          <Dialog.Button type="submit" raised>
            Arviointiin
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
