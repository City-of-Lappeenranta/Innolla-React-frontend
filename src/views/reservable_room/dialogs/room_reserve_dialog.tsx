import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Typography } from 'rmwc';

import { Dialog, Card } from 'utils/rmwc';
import { Room } from 'models/room';
import * as field from '../fields';

export function RoomReserveDialog() {
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const { id = null }: any = useParams();
  const room = Room.state.forId(id);

  async function onClosed() {
    history.push(`/reservable-rooms`);
  }

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Card
          outlined
          style={{
            border: 0,
          }}
        >
          <Card.Media
            sixteenByNine
            style={{
              backgroundImage: `url(${room?.image})`,
              backgroundColor: '#c5f8f1',
            }}
          />
        </Card>

        <Dialog.Content>
          <Typography
            className="mdc-typography--headline6__room-reserve-dialog__room-title"
            use="headline6"
            tag="div"
          >
            {room?.title}
          </Typography>
          <Typography
            className="mdc-typography--headline6__room-reserve-dialog__room-capacity"
            use="body1"
            tag="div"
          >
            {room?.capacity ?? 0} henkilöä
          </Typography>
          <field.RoomSelect hidden />
        </Dialog.Content>

        <Dialog.Actions>
          <Dialog.Button
            className="mdc-dialog__button--cancel"
            action="cancel"
            type="button"
          >
            Sulje
          </Dialog.Button>
          <Dialog.Button
            raised
            tag={Link}
            to={`/reservable-rooms/${id}/calendar`}
            isDefaultAction
          >
            Varaa tila
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
