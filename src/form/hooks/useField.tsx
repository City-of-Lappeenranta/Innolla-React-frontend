import { useContext, useEffect, useMemo, useState } from 'react';

import { Field, Form } from '../state';
import { FormContext } from '../components';

interface UseFieldOptions {
  parseValue?: Function;
  validate?: Function;
  defaultValue?: any;
}

export function useField<T>(name: string, options: UseFieldOptions) {
  const [, rerender] = useState({});
  const form: Form<unknown> = useContext(FormContext);
  const field = useMemo<Field<T>>(
    () => new Field<T>(name, form, options, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (field.value || !options.defaultValue) return;
    field.setState(() => {
      field.defaultValue = options.defaultValue;
      field.value = options.defaultValue;
    });
  }, [field, options.defaultValue]);

  return field;
}
