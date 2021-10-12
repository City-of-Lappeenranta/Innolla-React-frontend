import React from 'react';
import { TextField, Tooltip, Select } from 'rmwc';

import { useField, Field } from 'form';
import { Grid } from 'utils/rmwc';
import { AssessmentQuestion } from 'models';

export function Text() {
  const field = useField<string>('text', {
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
          label="Kysymys *"
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
            options={AssessmentQuestion.OF_CHOICES}
            onChange={input.onChange}
            value={input.value}
          />
        </Tooltip>
      </Grid.Cell>
    </>
  );
}
