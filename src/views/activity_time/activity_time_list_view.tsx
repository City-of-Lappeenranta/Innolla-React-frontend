import { useState } from 'react';
import { For, If } from 'react-extras';
import { Link } from 'react-router-dom';
import { Avatar, Typography } from 'rmwc';
import { isAfter, isBefore, isValid, setDay, isSameDay } from 'date-fns';
import { DatePicker } from '@material-ui/pickers';

import { Grid, List } from 'utils/rmwc';
import { useSetState, useAsyncEffect } from 'hooks';
import { ActivityTime, Room, Unit } from 'models';

export default function ActivityTimeListView() {
  const setState = useSetState();

  const [now] = useState(new Date());

  const [startDate, setStartDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  );
  const [endDate, setEndDate] = useState(setDay(startDate, 7));

  let activities = ActivityTime.state
    .forCurrentUnit()
    .filter((o) => timeFrameFilter(o, startDate, endDate))
    .sort(byDateSorter);

  useAsyncEffect(async (isMounted) => {
    ActivityTime.store.onStateChange(() => {
      if (isMounted()) return;
      setState();
    });
    ActivityTime.store.all();
    Room.store.all();
    Unit.store.all();
  }, []);

  return (
    <>
      <Grid
        className="mdc-layout-grid__activity-time-list-view"
        style={{ maxWidth: 1600, margin: 0, padding: 0 }}
      >
        <Grid.Cell span={12}>
          <Typography use="headline5">Varaukset</Typography>
        </Grid.Cell>

        <Grid.Cell span={12}>
          <DatePicker
            className="MuiFormControl-root__activity-time-listview__datepicker"
            label="Suodatuksen alkupäivä"
            value={startDate}
            format="dd.MM.yyyy"
            inputVariant="outlined"
            okLabel="Aseta"
            cancelLabel="Peruuta"
            onChange={(date: any) => {
              if (isValid(date)) {
                setStartDate(date);
              }
            }}
          />
          <DatePicker
            className="MuiFormControl-root__activity-time-listview__datepicker"
            label="Suodatuksen loppupäivä"
            value={endDate}
            format="dd.MM.yyyy"
            inputVariant="outlined"
            okLabel="Aseta"
            cancelLabel="Peruuta"
            minDate={startDate}
            onChange={(date: any) => {
              if (isValid(date)) {
                setEndDate(date);
              }
            }}
            style={{ marginLeft: 10 }}
          />
        </Grid.Cell>

        <Grid.Cell
          className="mdc-layout-grid__cell__activity-time-listview__activity-list"
          span={12}
        >
          <List twoLine style={{ gridColumn: '1/12' }}>
            <For
              of={activities.toArray()}
              render={(activity, index) => (
                <List.Item
                  key={index}
                  tag={Link}
                  to={`/reservations/${activity.id}`}
                >
                  <List.Item.Graphic
                    tag={Avatar}
                    src={activity.room?.image ?? '/img/img_placeholder.png'}
                    style={{ height: 40, width: 40 }}
                  />
                  <List.Item.Text>
                    <List.Item.PrimaryText>
                      {activity.title}
                    </List.Item.PrimaryText>
                    <List.Item.SecondaryText>
                      {activity.getDateTime()}
                    </List.Item.SecondaryText>
                  </List.Item.Text>
                </List.Item>
              )}
            />
            <If condition={!activities.length}>
              <List.Item>
                <List.Item.Text>
                  <List.Item.PrimaryText>
                    Ei toimintahetkiä valitulle ajalle
                  </List.Item.PrimaryText>
                  <List.Item.SecondaryText>
                    Valitse uusi suodatus
                  </List.Item.SecondaryText>
                </List.Item.Text>
              </List.Item>
            </If>
          </List>
        </Grid.Cell>
      </Grid>
    </>
  );
}

function byDateSorter(a: ActivityTime, b: ActivityTime) {
  if (!a.startTime || !b.startTime) return 0;
  return a.startTime.valueOf() - b.startTime.valueOf();
}

function timeFrameFilter(o: ActivityTime, startDate: Date, endDate: Date) {
  if (!o.startTime || !o.endTime) return false;
  return (
    (isAfter(o.startTime, startDate) && isBefore(o.startTime, endDate)) ||
    isSameDay(o.startTime, startDate) ||
    isSameDay(o.startTime, endDate)
  );
}
