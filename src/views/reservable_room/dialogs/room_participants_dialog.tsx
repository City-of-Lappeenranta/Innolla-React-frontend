import { useState } from 'react';
import { Choose } from 'react-extras';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useSetState, useAsyncEffect } from 'hooks';
import { Dialog, Grid, TabBar } from 'utils/rmwc';
import { Summary } from 'views/generic/summary';

import { Profile, User } from 'models';
import { ActivityTimeForm } from '../reservable_room_list_view';
import * as field from '../fields';

interface Props {
  form: ActivityTimeForm;
}

export function RoomParticipantsDialog({ form }: Props) {
  const setState = useSetState();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const { id = null }: any = useParams();

  useAsyncEffect(async (isMounted) => {
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.all();
    User.store.all();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onClosed={() => {
        history.push('/reservable-rooms');
      }}
    >
      <Dialog.Title>Lisää osallistujia</Dialog.Title>
      <Dialog.Content>
        <Grid style={{ padding: '20px 0' }}>
          <Grid.Cell span={12}>
            <Summary form={form as any} />
          </Grid.Cell>
          <Grid.Cell span={12}>
            <TabBar
              activeTabIndex={activeTab}
              onActivate={(event: any) => setActiveTab(event.detail.index)}
            >
              <TabBar.Tab type="button">Lapset</TabBar.Tab>
              <TabBar.Tab type="button">Pienryhmät</TabBar.Tab>
            </TabBar>
          </Grid.Cell>
          <Grid.Cell span={12}>
            <Choose>
              <Choose.When condition={activeTab === 0}>
                <field.Participants />
              </Choose.When>
              <Choose.When condition={activeTab === 1}>
                <field.SmallGroups />
              </Choose.When>
            </Choose>
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
        <Dialog.Button
          raised
          tag={Link}
          to={`/reservable-rooms/${id}/summary`}
          isDefaultAction
        >
          Seuraava
        </Dialog.Button>
      </Dialog.Actions>
    </Dialog>
  );
}
