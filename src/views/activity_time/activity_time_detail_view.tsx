import { Route, Link, useParams } from 'react-router-dom';
import { Avatar, Button, IconButton, Typography } from 'rmwc';
import { For, If } from 'react-extras';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Card, Grid, List } from 'utils/rmwc';
import { ActivityTimeDeleteView } from './activity_time_delete_view';
import { useSetState, useAsyncEffect } from 'hooks';
import { ActivityTime } from 'models/activity_time';
import { Profile, Room, SmallGroup, User } from 'models';
import { ActivityTimeEditDialog } from './dialogs/activity_time_edit_dialog';

export default function ActivityTimeDetailView() {
  const setState = useSetState();

  const { id = null }: any = useParams();
  const activity = ActivityTime.state.forId(id);
  const activities = ActivityTime.state.all().filter((o) => o.id !== id);

  useAsyncEffect(async (isMounted) => {
    ActivityTime.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Room.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    SmallGroup.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    const activity = await ActivityTime.store.forId(id);
    Room.store.forId(activity._room.id!);
    ActivityTime.store.all();
    User.store.all();
    Profile.store.all();
    SmallGroup.store.all();
  }, []);

  if (!activities.length) return null;

  async function updateTiming(e: any) {
    if (!activity) return;
    const startTime = e?.event?.start;
    const endTime = e?.event?.end;

    if (startTime instanceof Date) {
      activity.startTime = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
        0
      );
    }

    if (endTime instanceof Date) {
      activity.endTime = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        0
      );
    }

    await ActivityTime.store.update(activity);
    setState();
  }

  return (
    <>
      <Route path="/reservations/:id/edit">
        <ActivityTimeEditDialog activityTime={activity} />
      </Route>
      <Route
        path="/reservations/:id/delete"
        component={ActivityTimeDeleteView}
      />
      <Grid style={{ maxWidth: 1600, margin: '10px', padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton
            icon="/img/ikoni_back.svg"
            tag={Link}
            to="/reservations"
          />
        </Grid.Cell>
        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/reservations/${id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/reservations/${id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>
        <Grid.Cell span={4}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Toimintahetken nimi
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {activity?.title}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
        <Grid.Cell span={4}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Tila
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {activity?.room?.title}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
        <Grid.Cell
          className="mdc-layout-grid__cell__activity-time-detail-view__activity-time-grid-cell"
          span={4}
        >
          <Card
            className="mdc-layout-grid__cell__activity-time-detail-view__activity-time-grid-cell__card"
            outlined
          >
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Ajankohta
            </Typography>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              {activity?.getDateTime()}
            </Typography>
            <List.Divider />
            <FullCalendar
              height={650}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              // weekends={false}
              allDaySlot={false}
              dayHeaders={false}
              headerToolbar={false}
              selectable
              selectLongPressDelay={0.1}
              events={[
                ...activities.toArray().map((activityTime) => {
                  return {
                    title: activityTime.title,
                    start: activityTime.startTime
                      ? new Date(
                          activityTime.startTime.getFullYear(),
                          activityTime.startTime.getMonth(),
                          activityTime.startTime.getDate(),
                          activityTime.startTime.getHours(),
                          activityTime.startTime.getMinutes(),
                          0
                        )
                      : undefined,
                    end: activityTime.endTime,
                    editable: false,
                    color: 'var(--red-color)',
                    borderColor: 'transparent',
                    textColor: '#ffffff',
                  };
                }),
                {
                  title: activity?.title,
                  start: activity?.startTime,
                  end: activity?.endTime,
                  color: 'rgba(51, 206, 126, 0.2)',
                  borderColor: 'var(--green-color)',
                  textColor: 'var(--green-color)',
                },
              ]}
              initialDate={activity?.startTime}
              slotMinTime={'06:00:00'}
              slotMaxTime={'19:00:00'}
              scrollTime={activity?.getStartTimeFormat('HH:mm:ss')}
              eventOverlap={true}
              eventContent={Event}
              nowIndicator
              droppable
              editable
              eventDrop={updateTiming}
              eventResize={updateTiming}
            />
          </Card>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Grid.Row>
            <Grid.Cell span={12}>
              <Card
                className="mdc-card__activity-time-detail-view__participants-card"
                outlined
              >
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Osallistujat
                </Typography>

                <List.Divider />

                <List twoLine style={{ gridColumn: '1/12' }}>
                  <For
                    of={activity?.participants.all().toArray() ?? []}
                    render={(profile, index) => (
                      <List.Item key={index} ripple={false}>
                        <List.Item.Graphic
                          tag={Avatar}
                          src={profile.picture}
                          name={profile.user?.name}
                          style={{ height: 40, width: 40 }}
                        />
                        {profile.user?.name}
                      </List.Item>
                    )}
                  />
                  <If condition={!(activity?.participants.all() ?? []).length}>
                    <List.Item>
                      <List.Item.Text>
                        <List.Item.PrimaryText>
                          Ei osallistujia
                        </List.Item.PrimaryText>
                        <List.Item.SecondaryText>
                          Lisää osallistujia hakemalla
                        </List.Item.SecondaryText>
                      </List.Item.Text>
                    </List.Item>
                  </If>
                </List>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={12}>
              <Card
                className="mdc-card__activity-time-detail-view__participants-card"
                outlined
              >
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Pienryhmät
                </Typography>

                <List.Divider />

                <List twoLine style={{ gridColumn: '1/12' }}>
                  <For
                    of={activity?.smallGroups?.all()?.toArray() ?? []}
                    render={(group, index) => (
                      <List.Item key={index} ripple={false}>
                        <List.Item.Graphic
                          tag={Avatar}
                          src="/img/img_placeholder_2.png"
                          name={group.title}
                          style={{ height: 40, width: 40 }}
                        />
                        {group.title}
                      </List.Item>
                    )}
                  />
                  <If condition={!(activity?.smallGroups.all() ?? []).length}>
                    <List.Item>
                      <List.Item.Text>
                        <List.Item.PrimaryText>
                          Ei pienryhmiä
                        </List.Item.PrimaryText>
                        <List.Item.SecondaryText>
                          Lisää pienryhmiä hakemalla
                        </List.Item.SecondaryText>
                      </List.Item.Text>
                    </List.Item>
                  </If>
                </List>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>
      </Grid>
    </>
  );
}

function Event(info: any) {
  return (
    <div>
      <b>
        {info.timeText} {info.event.title}
      </b>
    </div>
  );
}
