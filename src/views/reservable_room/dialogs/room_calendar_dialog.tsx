import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Dialog, Grid } from 'utils/rmwc';
import { Summary } from 'views/generic/summary';
import { ActivityTimeForm } from '../reservable_room_list_view';
import { Room } from 'models/room';
import { Field, useField } from 'form';

interface Props {
  form: ActivityTimeForm;
}

export function RoomCalendarDialog({ form }: Props) {
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const { id = null }: any = useParams();
  const room = Room.state.forId(id);

  const startTime = useField<Date>('startTime', {
    defaultValue: form.startTime,
    parseValue: (date: Date) => date,
  });

  const endTime = useField<Date>('endTime', {
    defaultValue: form.endTime,
    parseValue: (date: Date) => date,
  });

  function onChange({ event }: any) {
    startTime.input.onChange(event.start);
    endTime.input.onChange(event.end);
  }

  function getDateTime(time: Field<Date>, date: Date | undefined) {
    let dateTime;
    if (time.value) {
      dateTime = new Date(time.value.getTime());
      if (date) {
        dateTime.setDate(date.getDate());
      }
    }
    return dateTime;
  }

  const startDateTime = getDateTime(startTime, form.date);
  const endDateTime = getDateTime(endTime, form.date);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClosed={() => {
          history.push('/reservable-rooms');
        }}
      >
        <Dialog.Title>Valitse ajankohta</Dialog.Title>

        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <Grid.Cell span={12}>
              <Summary form={form} />
            </Grid.Cell>

            <Grid.Cell span={12}>
              <FullCalendar
                locale="fi"
                slotLabelFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: false,
                }}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                // weekends={false}
                allDaySlot={false}
                dayHeaders={false}
                headerToolbar={false}
                selectable
                selectLongPressDelay={0.1}
                events={[
                  ...(room?.activities.all().toArray() ?? []).map(
                    (activityTime) => {
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
                        end: activityTime.endTime || undefined,
                        editable: false,
                        color: 'var(--red-color)',
                        borderColor: 'transparent',
                        textColor: '#ffffff',
                      };
                    }
                  ),
                  {
                    title: 'Uusi varaus',
                    start: startDateTime ?? undefined,
                    end: endDateTime ?? undefined,
                    color: 'rgba(51, 206, 126, 0.2)',
                    borderColor: 'var(--green-color)',
                    textColor: 'var(--green-color)',
                  },
                ]}
                initialDate={form.date}
                slotMinTime={'06:00:00'}
                slotMaxTime={'19:00:00'}
                scrollTime={
                  startDateTime
                    ? format(new Date(startDateTime), 'HH:mm:ss')
                    : undefined
                }
                // eventOverlap={false}
                eventContent={Event}
                nowIndicator
                droppable
                editable
                eventDrop={onChange}
                eventResize={onChange}
              />
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
            to={`/reservable-rooms/${id}/details`}
            isDefaultAction
          >
            Seuraava
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
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
