import { For, If } from 'react-extras';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

import { Field } from 'form';
import { DataTable } from 'utils/rmwc';
import { Profile, SmallGroup, Room } from 'models';
import { ActivityTimeForm } from 'views/reservable_room/reservable_room_list_view';

interface Props {
  form: ActivityTimeForm;
}

export function Summary({ form }: Props) {
  const location = useLocation();
  const room = Room.state.forId(form.room!);

  const entries = ['reserve', 'calendar', 'details', 'participants', 'summary'];
  const step = location.pathname.split('/').pop();
  const nthStep = step ? entries.indexOf(step) : 0;

  const profiles = Profile.state
    .all()
    .filter((o) => !!form.participants?.includes(o.id ?? ''));

  const groups = SmallGroup.state
    .all()
    .filter((o) => !!form.smallGroups?.includes(o.id ?? ''));

  function getDateTime(time: Date | undefined, date: Date | undefined) {
    let dateTime;
    if (time) {
      dateTime = new Date(time.getTime());
      if (date) {
        dateTime.setDate(date.getDate());
      }
    }
    return dateTime;
  }

  const startDateTime = getDateTime(form.startTime, form.date);
  const endDateTime = getDateTime(form.endTime, form.date);

  return (
    <>
      <DataTable
        className="rmwc-description-list"
        style={{ width: '100%', overflow: 'unset' }}
      >
        <DataTable.Content>
          <DataTable.Body>
            <If condition={nthStep > 0}>
              <DataTable.Row>
                <DataTable.Cell>Tila:</DataTable.Cell>
                <DataTable.Cell>{`${room?.title} (${room?.capacity} henkilöä)`}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Päivämäärä:</DataTable.Cell>
                <DataTable.Cell>
                  {form.date ? format(new Date(form.date), 'dd.MM.yyyy') : '?'}
                </DataTable.Cell>
              </DataTable.Row>
            </If>
            <If condition={nthStep > 1}>
              <DataTable.Row>
                <DataTable.Cell>Aikaväli:</DataTable.Cell>
                <DataTable.Cell>
                  {`${
                    startDateTime
                      ? format(new Date(startDateTime), 'HH:mm')
                      : ''
                  } - ${
                    endDateTime ? format(new Date(endDateTime), 'HH:mm') : ''
                  }`}
                </DataTable.Cell>
              </DataTable.Row>
            </If>
            <If condition={nthStep > 2}>
              <DataTable.Row>
                <DataTable.Cell>Toimintahetken nimi:</DataTable.Cell>
                <DataTable.Cell>{form.title ?? '?'}</DataTable.Cell>
              </DataTable.Row>
            </If>
            <If condition={nthStep > 3}>
              <DataTable.Row>
                <DataTable.Cell>Osallistujat:</DataTable.Cell>
                <DataTable.Cell>
                  <For
                    of={profiles.toArray().slice(0, 3)}
                    render={(profile, index) => {
                      const isLast = index + 1 === profiles.length;
                      return (
                        <span key={index}>
                          <If condition={!isLast}>{profile.user?.name}</If>
                          <If condition={isLast}>
                            {`${profile.user?.name}...`}
                          </If>
                        </span>
                      );
                    }}
                  />
                  <If condition={!profiles.length}>{'-'}</If>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Pienryhmät:</DataTable.Cell>
                <DataTable.Cell>
                  <For
                    of={groups.toArray().slice(0, 3)}
                    render={(group, index) => {
                      const isLast = index + 1 === groups.length;
                      return (
                        <span key={index}>
                          <If condition={!isLast}>{group.title}</If>
                          <If condition={isLast}>{`${group.title}...`}</If>
                        </span>
                      );
                    }}
                  />
                  <If condition={!groups.length}>{'-'}</If>
                </DataTable.Cell>
              </DataTable.Row>
            </If>
          </DataTable.Body>
        </DataTable.Content>
      </DataTable>
    </>
  );
}
