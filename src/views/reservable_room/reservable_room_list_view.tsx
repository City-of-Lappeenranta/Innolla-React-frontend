import { useState } from 'react';
import { For, If } from 'react-extras';
import { Link, Route, useHistory } from 'react-router-dom';
import { Typography } from 'rmwc';

import { Grid } from 'utils/rmwc';

import { RoomCalendarDialog } from 'views/reservable_room/dialogs/room_calendar_dialog';
import { RoomReserveDialog } from 'views/reservable_room/dialogs/room_reserve_dialog';
import { RoomDetailsDialog } from 'views/reservable_room/dialogs/room_details_dialog';
import { RoomParticipantsDialog } from 'views/reservable_room/dialogs/room_participants_dialog';
import { RoomSummaryDialog } from 'views/reservable_room/dialogs/room_summary_dialog';

import { useSetState, useAsyncEffect } from 'hooks';
import { useForm } from 'form';
import { Room } from 'models/room';
import { ActivityTime } from 'models';
import * as field from 'views/activity_time/fields';

export interface ActivityTimeForm {
  title?: string;
  participants?: Array<string>;
  smallGroups?: Array<string>;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  room?: string;
}

export default function ReservableRoomListView() {
  const setState = useSetState();
  const history = useHistory();

  const rooms = Room.state.forCurrentUnit();

  useAsyncEffect(async (isMounted) => {
    Room.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    ActivityTime.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    ActivityTime.store.all();
    Room.store.reservable();
  }, []);

  const [now] = useState(new Date());

  const { Form, form } = useForm<ActivityTimeForm>({
    defaultValues: {
      date: now,
      startTime: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0,
        0
      ),
      endTime: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 2,
        0,
        0
      ),
    },
    onSubmit: async (values: any) => {
      return await ActivityTime.store.create(new ActivityTime(values));
    },
    afterSubmit: (activity: ActivityTime) => {
      history.push(`/reservations/${activity?.id}`);
    },
  });

  const { startTime, endTime } = form.values;

  function isReserved(activities: Array<ActivityTime>): boolean {
    let reserved = false;
    activities.forEach((activityTime: ActivityTime) => {
      if (!activityTime.startTime || !activityTime.endTime) return false;
      const isStartBetweenSelection =
        activityTime.startTime >= startTime! &&
        activityTime.startTime < endTime!;
      const isEndBetweenSelection =
        activityTime.endTime <= endTime! && activityTime.endTime > startTime!;
      const isOverSelecton =
        activityTime.startTime <= startTime! &&
        activityTime.endTime >= endTime!;
      if (isStartBetweenSelection || isEndBetweenSelection || isOverSelecton) {
        reserved = true;
      }
    });
    return reserved;
  }

  return (
    <Form>
      <Route path="/reservable-rooms/:id/reserve">
        <RoomReserveDialog />
      </Route>
      <Route path="/reservable-rooms/:id/calendar">
        <RoomCalendarDialog form={form.values} />
      </Route>
      <Route path="/reservable-rooms/:id/details">
        <RoomDetailsDialog form={form.values} />
      </Route>
      <Route path="/reservable-rooms/:id/participants">
        <RoomParticipantsDialog form={form.values} />
      </Route>
      <Route path="/reservable-rooms/:id/summary">
        <RoomSummaryDialog form={form.values} />
      </Route>

      <Grid
        className="mdc-layout-grid__reservable-room-list__main-grid"
        style={{ maxWidth: 1600, margin: 0, padding: 0 }}
      >
        <Grid.Cell
          className="mdc-layout-grid__reservable-room-list__main-grid__innercell__clearline"
          desktop={6}
          tablet={6}
          phone={4}
        ></Grid.Cell>

        <Grid.Cell
          className="mdc-layout-grid__reservable-room-list__main-grid__innercell__datetimes"
          span={6}
        >
          <field.DateField />
          <field.StartTimeField />
          <field.EndTimeField />
        </Grid.Cell>
        <For
          of={rooms.toArray()}
          render={(room, index) => (
            <Grid.Cell
              className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders"
              key={index}
              desktop={2}
              tablet={2}
              phone={2}
            >
              <Grid.Tile
                className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile"
                tag={Link}
                to={`/reservable-rooms/${room.id}/reserve`}
                style={{
                  margin: 0,
                  width: 'auto',
                }}
              >
                <If condition={!isReserved(room.activities.all().toArray())}>
                  {' '}
                  <Grid.Tile.Title
                    className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__reservation-title"
                    style={{
                      background: isReserved(room.activities.all().toArray())
                        ? 'var(--reserved-room)'
                        : 'var(--available-room',
                    }}
                  >
                    <Typography use="subtitle1">Vapaa</Typography>
                  </Grid.Tile.Title>
                </If>
                <If condition={isReserved(room.activities.all().toArray())}>
                  <Grid.Tile.Title
                    className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__reservation-title"
                    style={{
                      background: isReserved(room.activities.all().toArray())
                        ? 'var(--reserved-room)'
                        : 'var(--available-room',
                    }}
                  >
                    <Typography use="subtitle1">Vapaa</Typography>
                  </Grid.Tile.Title>
                </If>
                <Grid.Tile.Primary
                  style={{
                    background: isReserved(room.activities.all().toArray())
                      ? 'var(--reserved-room-light)'
                      : 'var(--available-room-light',
                  }}
                  className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__primary"
                >
                  <Grid.Tile.Primary.Content
                    className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__primary__content"
                    src="/img/ikoni_tilat.svg"
                    alt="test"
                  />
                </Grid.Tile.Primary>
                <Grid.Tile.Secondary
                  className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__secondary"
                  style={{
                    padding: 8,
                    background: 'white',
                    color: 'black',
                  }}
                >
                  <Grid.Tile.Icon icon="info" />
                  <Grid.Tile.Title className="mdc-layout-grid__reservable-room-list__main-grid__innercell__roomrenders__roomtile__secondary__roomtitle">
                    {room.title}
                  </Grid.Tile.Title>
                  {room.capacity ?? 0} henkilöä
                </Grid.Tile.Secondary>
              </Grid.Tile>
            </Grid.Cell>
          )}
        />
      </Grid>
    </Form>
  );
}
