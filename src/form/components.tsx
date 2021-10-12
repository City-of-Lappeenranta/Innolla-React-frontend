import React from 'react';
import { Form } from './state';

interface FormComponentProps extends React.HTMLAttributes<HTMLFormElement> {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  form: Form<unknown>;
}

export function FormComponent({ form, ...rest }: FormComponentProps) {
  return <form {...rest} />;
}

export const FormContext = React.createContext<Form<unknown>>(new Form());
