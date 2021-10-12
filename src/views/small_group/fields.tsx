import React from 'react';
import { Select, TextField, Tooltip } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';
import { Profile, Unit, User } from 'models';
import { FilterMultiSelectField } from 'views/generic/filter_field.tsx';

export function Title() {
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

export function UnitSelect() {
  const setState = useSetState();
  const field = useField<string>('unit', {
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

  const units = Unit.state.all();

  useAsyncEffect(async (isMounted) => {
    Unit.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    await Unit.store.all();
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
          <Select
            outlined
            enhanced
            style={{ width: '100%' }}
            label="Yksikkö *"
            options={units.toArray().map(({ title, id }: any) => {
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

export function Profiles() {
  const setState = useSetState();
  const field = useField<Array<string>>('profiles', {
    parseValue: (profiles: Array<string>) => profiles,
  });

  const { isTouched, error, input } = field;

  const profiles = Profile.state.all();

  useAsyncEffect(async (isMounted) => {
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.all();
    User.store.all();
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
            label="Lisää tai poista lapsia"
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
