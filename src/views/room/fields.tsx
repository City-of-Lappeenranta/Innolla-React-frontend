import React from 'react';
import { Select, TextField, Tooltip } from 'rmwc';

import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';
import { Unit } from 'models/unit';
import { useSetState, useAsyncEffect } from 'hooks';

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

export function Capacity() {
  const field = useField<string>('capacity', {
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
          type="number"
          style={{ width: '100%' }}
          label="Kapasiteetti"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function Image() {
  const field = useField<File>('imageFile', {
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
