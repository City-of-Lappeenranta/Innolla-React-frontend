import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dialog, Grid } from 'utils/rmwc';

import { useForm } from 'form';
import * as field from '../fields';
import { User } from 'models/user';
import { Profile } from 'models';

export function UserCreateDialog() {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<User & Profile>({
    onSubmit: async (values: User & Profile) => {
      let user = new User({
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      user = await User.store.create(user);
      const profile = new Profile({ user, unit: values.unit });
      Profile.store.create(profile);
      return user;
    },
    afterSubmit: (user: User) => {
      history.push(`/users/${user?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/users`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Luo käyttäjä</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.UsernameField />
            <field.EmailField />
            <field.FirstNameField />
            <field.LastNameField />
            <field.UnitSelect />
            <field.ProfilePictureField />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Luo
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}

interface Props {
  user: User | undefined;
}

interface Form {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  unit?: string;
  picture?: File;
  groups?: Array<string>;
}

export function UserEditDialog({ user }: Props) {
  const [open, setOpen] = useState(true);
  const history = useHistory();

  const { Form } = useForm<Form>({
    defaultValues: {
      ...user,
      ...user?.profile,
      groups: user?.groups.ids,
      unit: user?.profile?.unit?.id,
    },
    onSubmit: async (values: Form) => {
      Object.assign(user!, values);
      user = await User.store.update(user!);
      if (user.profile) {
        user.profile!.pictureFile = values.picture;
        user.profile!.unit = values.unit;
        user.profile = await Profile.store.update(user.profile!);
      }
      return user;
    },
    afterSubmit: (user: User) => {
      history.push(`/users/${user?.id}`);
    },
  });

  async function onClosed() {
    history.push(`/users/${user?.id}`);
  }

  return (
    <Form>
      <Dialog open={open} onClose={() => setOpen(false)} onClosed={onClosed}>
        <Dialog.Title>Muokkaa käyttäjää</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <field.UsernameField />
            <field.EmailField />
            <field.FirstNameField />
            <field.LastNameField />
            <field.UnitSelect />
            <field.ProfilePictureField />
            <field.GroupsField />
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button action="cancel" type="button">
            Peru
          </Dialog.Button>
          <Dialog.Button type="submit" raised isDefaultAction>
            Muokkaa
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </Form>
  );
}
