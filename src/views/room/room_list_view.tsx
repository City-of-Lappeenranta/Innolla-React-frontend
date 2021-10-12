import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Room } from 'models/room';
import { DataTable, Grid } from 'utils/rmwc';

import { RoomCreateDialog } from 'views/room/dialogs/room_dialogs';

export default function RoomListView() {
  const setState = useSetState();
  const rooms = Room.state.all();

  useAsyncEffect(async (isMounted) => {
    Room.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Room.store.all();
  }, []);

  return (
    <>
      <Route path="/rooms/create" component={RoomCreateDialog} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Tilat</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 160 }}
              tag={Link}
              to="/rooms/create"
            >
              Luo tila
            </Button>
          </div>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <DataTable style={{ width: '100%' }}>
            <DataTable.Content>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.HeadCell></DataTable.HeadCell>
                  <DataTable.HeadCell>Nimi</DataTable.HeadCell>
                  <DataTable.HeadCell>Yksikkö</DataTable.HeadCell>
                  <DataTable.HeadCell>Kapasiteetti</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={rooms.toArray()}
                  render={(room, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/rooms/${room.id}`}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>{room.title}</DataTable.Cell>
                      <DataTable.Cell>{room.unit?.title ?? '-'}</DataTable.Cell>
                      <DataTable.Cell>{room.capacity}</DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!rooms.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei huoneita</DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
                  </DataTable.Row>
                </If>
              </DataTable.Body>
            </DataTable.Content>
          </DataTable>
        </Grid.Cell>
      </Grid>
    </>
  );
}
