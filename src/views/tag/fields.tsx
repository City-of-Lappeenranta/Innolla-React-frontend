import React from 'react';
import { TextField, Tooltip, Select } from 'rmwc';

import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';
import { Tag } from 'models/tag';

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
          label="Tagi *"
          {...input}
        />
      </Tooltip>
    </Grid.Cell>
  );
}

export function Category() {
  const field = useField<string>('category', {
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
            label="Kategoria *"
            options={Tag.CATEGORY_CHOICES}
            onChange={input.onChange}
            value={input.value}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}
