import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { DataTable, Grid } from 'utils/rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { User } from 'models/user';
import { UserCreateDialog } from 'views/user/dialogs/user_dialogs';

export default function UserListView() {
  const setState = useSetState();
  const users = User.state.all();

  useAsyncEffect(async (isMounted) => {
    User.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    User.store.all();
  }, []);

  return (
    <>
      <Route path="/users/create" component={UserCreateDialog} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Käyttäjät</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 160 }}
              tag={Link}
              to="/users/create"
            >
              Luo käyttäjä
            </Button>
          </div>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <DataTable style={{ width: '100%' }}>
            <DataTable.Content>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.HeadCell></DataTable.HeadCell>
                  <DataTable.HeadCell>Käyttäjätunnus</DataTable.HeadCell>
                  <DataTable.HeadCell>Nimi</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={users.toArray()}
                  render={(user, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/users/${user.id}`}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>{user.username}</DataTable.Cell>
                      <DataTable.Cell>
                        {user.firstName} {user.lastName}
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!users.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei käyttäjiä</DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
                  </DataTable.Row>
                </If>
              </DataTable.Body>
            </DataTable.Content>
          </DataTable>
        </Grid.Cell>
      </Grid>
    </>
  );
}
