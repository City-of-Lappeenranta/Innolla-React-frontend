import React from 'react';

interface FormOptions {
  onSubmit?: Function;
  afterSubmit?: Function;
}

export class Form<T> {
  constructor(options?: FormOptions, rerender?: Function) {
    if (rerender) this.rerender = rerender;
    if (options?.onSubmit) {
      this.onSubmitCallback = options.onSubmit;
    }
    if (options?.afterSubmit) {
      this.afterSubmitCallback = options.afterSubmit;
    }
  }

  public rerender: Function = () => {};
  public _values: any = {};
  public __fieldMeta: any = {};
  public isSubmitting = false;

  public get values(): T {
    const values: any = {} as T;
    Object.entries(this.__fieldMeta).forEach(([key, _field]) => {
      const field = _field as Field<unknown>;
      if (field.value !== undefined) {
        values[key] = field.value;
      }
    });
    return values;
  }

  public set values(values: T) {
    Object.entries(this.__fieldMeta).forEach(([key, _field]) => {
      const field = _field as Field<unknown>;
      const defaultValue = (values as any)[key];
      field.setState(() => {
        field.defaultValue = defaultValue;
        field.value = defaultValue;
      });
    });
  }

  public get isValid(): boolean {
    let _isValid = true;
    Object.values(this.__fieldMeta).forEach((field: any) => {
      if (!field.isValid) {
        _isValid = false;
      }
    });
    return _isValid;
  }

  public get isTouched(): boolean {
    let _isTouched = false;
    Object.values(this.__fieldMeta).forEach((field: any) => {
      if (field.isTouched) {
        _isTouched = true;
      }
    });
    return _isTouched;
  }

  private onSubmitCallback: Function = () => undefined;
  private afterSubmitCallback: Function = () => undefined;
  public async onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    Object.values(this.__fieldMeta).forEach((_field: any) => {
      const field = _field as Field<unknown>;
      if (field.error) {
        field.setState(() => {
          field.isTouched = true;
        });
      }
    });

    if (!this.isValid) {
      return;
    }

    this.isSubmitting = true;
    this.rerender({});
    const result: any = await this.onSubmitCallback(this.values);
    this.isSubmitting = false;
    this.rerender({});
    await this.afterSubmitCallback(result);
  }

  public setState(callback: Function) {
    callback();
    this.rerender({});
  }
}

interface FieldOptions {
  parseValue?: Function;
  validate?: Function;
  defaultValue?: any;
}

export class Field<T> {
  constructor(
    name: string,
    form: Form<unknown>,
    options?: FieldOptions,
    rerender?: Function
  ) {
    this.name = name;
    this.form = form;
    this.form.__fieldMeta[this.name] = this;

    if (options?.parseValue) this.parseValue = options.parseValue;
    if (options?.validate) this.validate = options.validate;
    if (rerender) this.rerender = rerender;

    this.isValid = this.validate(this);
  }

  public form: Form<unknown>;
  public name: string;

  private rerender: Function = () => {};
  private parseValue: Function = (value: T) => value;
  private validate: Function = (field: Field<T>): boolean => true;
  public defaultValue: T = undefined as unknown as T;
  public value: T | undefined;
  public error: string | null = null;
  public isTouched: boolean = false;
  public isValid: boolean;

  public setState(callback: Function) {
    callback();

    this.isValid = this.validate(this);

    if (this.isValid) {
      this.error = null;
    }

    if (this.value !== this.defaultValue) {
      this.isTouched = true;
    }

    Object.values(this.form.__fieldMeta).forEach((field: any) => {
      (field as Field<T>).rerender({});
    });
    this.form.rerender({});
  }

  public get input() {
    return {
      value: this.value,
      onChange: (input: any) => {
        this.setState(() => {
          this.value = this.parseValue(input);
        });
      },
      onBlur: (input: any) => {
        this.setState(() => {
          this.value = this.parseValue(input);
        });
      },
    };
  }
}
