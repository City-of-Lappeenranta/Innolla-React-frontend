import React, { useMemo, useState } from 'react';

import { Form } from '../state';
import { FormComponent, FormContext } from '../components';
import { useDeepCompareEffect } from './useDeepCompareEffect';

interface UseFormProps<T> {
  defaultValues?: T;
  onSubmit?: Function;
  afterSubmit?: Function;
}

export function useForm<T>(options: UseFormProps<T>) {
  const [, rerender] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const form = useMemo<Form<T>>(() => new Form<T>(options, rerender), []);

  useDeepCompareEffect(() => {
    form.setState(() => {
      if (options.defaultValues) {
        form.values = options.defaultValues;
      }
    });
  }, [options.defaultValues]);

  return {
    form,
    Form: useMemo(
      () => (props: React.PropsWithChildren<any>) =>
        (
          <FormContext.Provider value={form}>
            <FormComponent
              {...props}
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                form.onSubmit(e)
              }
            />
          </FormContext.Provider>
        ),
      [form]
    ),
  };
}
