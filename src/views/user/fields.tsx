import React from 'react';
import { Select, TextField, Tooltip } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';
import { FilterMultiSelectField } from 'views/generic/filter_field.tsx';
import { Group, Unit } from 'models';

export function UsernameField() {
  const field = useField<string>('username', {
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
          label="Käyttäjätunnus *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function EmailField() {
  const field = useField<string>('email', {
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
          label="Sähköposti *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function FirstNameField() {
  const field = useField<string>('firstName', {
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
          label="Etunimi *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function LastNameField() {
  const field = useField<string>('lastName', {
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
          label="Sukunimi *"
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

export function ProfilePictureField() {
  const field = useField<File>('picture', {
    parseValue: (e: React.FormEvent<HTMLInputElement>) =>
      e.currentTarget.files?.[0],
    validate: (field: Field<File>) => {
      if (!field.value) return true;
      const extension = field.value.name.split('.')[1];
      const extensions = ['png', 'jpg', 'jpeg', 'gif'];
      if (!extensions.includes(extension)) {
        field.error = 'Tiedostotyyppi tulee olla joko .png, .jpeg tai .gif.';
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
        content={error ?? ''}
      >
        <TextField
          outlined
          style={{ width: '100%' }}
          type="file"
          label={input.value?.name ?? 'Profiilikuva'}
          onChange={input.onChange}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function GroupsField() {
  const field = useField<Array<string>>('groups', {
    parseValue: (groups: Array<string>) => groups,
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
          <FilterMultiSelectField
            label="Roolit"
            items={Group.state
              .all()
              .toArray()
              .map(({ id, name }: any) => {
                return { label: name, value: id };
              })}
            {...input}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}
