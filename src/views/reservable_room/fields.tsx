import React from 'react';
import { TextField, Select, Tooltip } from 'rmwc';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { useParams } from 'react-router-dom';

import { useField, Field } from 'form';
import { useSetState, useAsyncEffect, useDeepCompareEffect } from 'hooks';
import { Grid } from 'utils/rmwc';
import { Room } from 'models/room';
import { Profile, SmallGroup, Unit } from 'models';
import { FilterMultiSelectField } from 'views/generic/filter_field.tsx';

export function TitleField() {
  const field = useField<string>('title', {
    parseValue: (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value,
    validate: (field: Field<string>) => {
      if (!field.value) {
        field.error = 'Vaadittu kenttä';
        return false;
      }
      return true;
    },
  });

  const { isTouched, error, input } = field;

  return (
    <Grid.Cell span={12}>
      <Tooltip
        align="bottomLeft"
        showArrow
        content={error}
        open={!!isTouched && !!error}
      >
        <TextField
          outlined
          style={{ width: '100%' }}
          label="Nimi *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function DateField() {
  const field = useField<Date>('date', {
    parseValue: (date: Date) => date,
  });

  const { isTouched, error, input } = field;

  return (
    <>
      <Grid.Cell span={12}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <DatePicker
            label="Päivämäärä"
            format="dd.MM.yyyy"
            inputVariant="outlined"
            okLabel="Aseta"
            cancelLabel="Peruuta"
            value={input.value}
            onChange={input.onChange}
            style={{ width: '100%' }}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

export function StartTimeField() {
  const field = useField<Date>('startTime', {
    parseValue: (date: Date) => date,
  });

  const { isTouched, error, input } = field;

  return (
    <>
      <Grid.Cell span={12}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <TimePicker
            label="Alkamisaika"
            variant="dialog"
            format="HH:mm"
            ampm={false}
            minutesStep={30}
            inputVariant="outlined"
            okLabel="Aseta"
            cancelLabel="Peruuta"
            value={input.value}
            onChange={input.onChange}
            style={{ width: '100%' }}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

export function EndTimeField() {
  const field = useField<Date>('endTime', {
    parseValue: (date: Date) => date,
  });

  const { isTouched, error, input } = field;

  return (
    <>
      <Grid.Cell span={12}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <TimePicker
            label="Päättymisaika"
            variant="dialog"
            format="HH:mm"
            ampm={false}
            minutesStep={30}
            inputVariant="outlined"
            okLabel="Aseta"
            cancelLabel="Peruuta"
            onChange={input.onChange}
            value={input.value}
            style={{ width: '100%' }}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

interface RoomSelectProps {
  hidden?: boolean;
}

export function RoomSelect({ hidden = false }: RoomSelectProps) {
  const { id = null }: any = useParams();
  const setState = useSetState();
  const field = useField<string>('room', {
    defaultValue: id,
    parseValue: (e: React.FormEvent<HTMLSelectElement>) =>
      e.currentTarget.value,
    validate: (field: Field<string>) => {
      if (!field.value) {
        field.error = 'Vaadittu kenttä';
        return false;
      }
      return true;
    },
  });

  const { isTouched, error, input } = field;

  const rooms = Room.state.forUnit(Unit.state.current);

  useAsyncEffect(async (isMounted) => {
    Room.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    await Room.store.all();
  }, []);

  useDeepCompareEffect(() => {
    field.setState(() => {
      field.value = id;
    });
  }, [id]);

  return (
    <>
      <Grid.Cell span={12} style={{ display: hidden ? 'none' : 'block' }}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <Select
            outlined
            enhanced
            style={{ width: '100%' }}
            label="Tila *"
            options={rooms.toArray().map(({ title, id }: any) => {
              return { label: title, value: id };
            })}
            onChange={input.onChange}
            value={input.value}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

export function Participants() {
  const setState = useSetState();
  const field = useField<Array<string>>('participants', {
    parseValue: (participants: Array<string>) => participants,
  });

  const { isTouched, error, input } = field;

  const profiles = Profile.state.all();

  useAsyncEffect(async (isMounted) => {
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    await Profile.store.all();
  }, []);

  return (
    <>
      <Grid.Cell span={12}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <FilterMultiSelectField
            label="Hae osallistujia"
            items={profiles.toArray().map(({ id, user }: Profile) => {
              return { label: user?.name ?? '-', value: id } as any;
            })}
            {...input}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

export function SmallGroups() {
  const setState = useSetState();
  const field = useField<Array<string>>('smallGroups', {
    parseValue: (smallGroups: Array<string>) => smallGroups,
  });

  const { isTouched, error, input } = field;

  const groups = SmallGroup.state.all();

  useAsyncEffect(async (isMounted) => {
    SmallGroup.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    await SmallGroup.store.all();
  }, []);

  return (
    <>
      <Grid.Cell span={12}>
        <Tooltip
          align="bottomLeft"
          showArrow
          content={error}
          open={!!isTouched && !!error}
        >
          <FilterMultiSelectField
            label="Hae pienryhmiä"
            items={groups.toArray().map(({ id, title }: SmallGroup) => {
              return { label: title ?? '-', value: id } as any;
            })}
            {...input}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}
