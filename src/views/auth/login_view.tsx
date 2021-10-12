import { useHistory } from 'react-router-dom';
import { TopAppBarFixedAdjust, TextField, Grid, GridCell } from 'rmwc';

import { Dialog, TopAppBar } from 'utils/rmwc';

import { User } from 'models';
import { useSetState } from 'hooks';

export default function LoginView() {
  const setState = useSetState();
  const history = useHistory();

  async function login() {
    await User.store.login(User.current);
    if (User.current.token) {
      await User.store.current();
      setState();
      if (User.current?.id) {
        history.push('/');
      }
    }
  }

  return (
    <>
      <TopAppBar>
        <TopAppBar.Row>
          <TopAppBar.Section alignStart>
            <TopAppBar.Title>
              <img
                style={{ display: 'flex', height: 50 }}
                src="/logo192.png"
                alt="Logo"
              />
            </TopAppBar.Title>
          </TopAppBar.Section>
        </TopAppBar.Row>
      </TopAppBar>
      <TopAppBarFixedAdjust />

      <Dialog open>
        <Dialog.Title>Kirjaudu sisään</Dialog.Title>
        <Dialog.Content>
          <Grid style={{ padding: '20px 0' }}>
            <GridCell span={12}>
              <TextField
                outlined
                style={{ width: '100%' }}
                label="Käyttäjätunnus"
                onChange={(e) =>
                  (User.current.username = e.currentTarget.value)
                }
              />
            </GridCell>
            <GridCell span={12}>
              <TextField
                outlined
                style={{ width: '100%' }}
                label="Salasana"
                type="password"
                onChange={(e) =>
                  (User.current.password = e.currentTarget.value)
                }
              />
            </GridCell>
          </Grid>
        </Dialog.Content>
        <Dialog.Actions>
          <Dialog.Button isDefaultAction onClick={login}>
            Kirjaudu sisään
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
