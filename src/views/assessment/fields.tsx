import React from 'react';
import { Select, Tooltip, TextField } from 'rmwc';

import { Grid } from 'utils/rmwc';
import { useField, Field } from 'form';
import { ActivityTime, AssessmentResponse, Profile } from 'models';
import { useSetState, useAsyncEffect } from 'hooks';
import { FilterSelectField } from 'views/generic/filter_select_field';

export function Answer() {
  const field = useField<string>('answer', {
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
        open={!!isTouched && !!error}
        content={error}
      >
        <TextField
          outlined
          style={{ width: '100%' }}
          label="Vastaus *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function Of() {
  const field = useField<string>('of', {
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

  return (
    <>
      <Grid.Cell span={12}>
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
            label="Kohde *"
            options={AssessmentResponse.OF_CHOICES}
            onChange={input.onChange}
            value={input.value}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}

export function ProfileSelect() {
  const setState = useSetState();
  const field = useField('ofChild', {
    parseValue: (id: string) => id,
  });

  const { isTouched, error, input } = field;

  const profiles = Profile.state.all();

  useAsyncEffect(async (isMounted) => {
    Profile.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Profile.store.all();
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
          <FilterSelectField
            label="Hae lasta"
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

export function ActivityTimeSelect() {
  const setState = useSetState();
  const field = useField('ofActivity', {
    parseValue: (id: string) => id,
  });

  const { isTouched, error, input } = field;

  const profiles = ActivityTime.state.all();

  useAsyncEffect(async (isMounted) => {
    ActivityTime.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    ActivityTime.store.all();
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
          <FilterSelectField
            label="Hae toimintahetkeä"
            items={profiles.toArray().map(({ id, title }: ActivityTime) => {
              return { label: title ?? '-', value: id } as any;
            })}
            {...input}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}
