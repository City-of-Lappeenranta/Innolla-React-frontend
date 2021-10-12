import React from 'react';
import { TextField, Tooltip } from 'rmwc';

import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';

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
        open={!!isTouched && !!error}
        content={error}
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

export function Address() {
  const field = useField<string>('address', {
    parseValue: (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value,
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
          label="Katuosoite"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function City() {
  const field = useField<string>('city', {
    parseValue: (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value,
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
          label="Paikkakunta"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function PostalCode() {
  const field = useField<string>('postalCode', {
    parseValue: (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value,
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
          label="Postinumero"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function FloorPlan() {
  const field = useField<File>('floorPlanFile', {
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
          label={input.value?.name ?? 'Kuva'}
          onChange={input.onChange}
        />
      </Tooltip>
    </Grid.Cell>
  );
}
