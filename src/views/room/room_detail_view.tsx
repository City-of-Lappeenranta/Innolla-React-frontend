import { Route, Link, useParams } from 'react-router-dom';
import { Typography, Button, IconButton } from 'rmwc';

import { Grid, Card, List } from 'utils/rmwc';
import { RoomEditDialog } from 'views/room/dialogs/room_dialogs';
import { RoomDeleteView } from './room_delete_view';
import { useSetState, useAsyncEffect } from 'hooks';
import { Room } from 'models/room';
import { Unit } from 'models';

export default function RoomDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const room: Room | undefined = Room.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    Room.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    const room = await Room.store.forId(id);
    room._unit.id && Unit.store.forId(room._unit.id);
  }, []);

  return (
    <>
      <Route path="/rooms/:id/edit">
        <RoomEditDialog room={room} />
      </Route>
      <Route path="/rooms/:id/delete" component={RoomDeleteView} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/rooms" />
        </Grid.Cell>

        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/rooms/${id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/rooms/${id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={4}>
          <Card outlined>
            <Card.PrimaryAction>
              <Card.Media
                sixteenByNine
                style={{
                  backgroundImage: `url(${room?.image})`,
                }}
              />
              <div style={{ padding: '0 1rem 1rem 1rem' }}>
                <Typography use="headline6" tag="h2">
                  {room?.title}
                </Typography>
                <Typography
                  use="subtitle2"
                  tag="h3"
                  style={{ marginTop: '-1.5rem' }}
                ></Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Kapasiteetti
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {room?.capacity ?? '-'}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Yksikkö
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {room?.unit?.title ?? '-'}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
}
