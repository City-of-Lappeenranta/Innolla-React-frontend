import { For, If } from 'react-extras';
import { Route, Link, useParams } from 'react-router-dom';
import { Typography, GridRow, Button, IconButton } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Grid, Card, List } from 'utils/rmwc';
import { UserEditDialog } from 'views/user/dialogs/user_dialogs';
import { User } from 'models/user';
import { Profile, Unit } from 'models';

export default function UserDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const user: User | undefined = User.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    User.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Profile.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    const user = await User.store.forId(id);

    if (user._profile?.id) {
      const profile = await Profile.store.forId(user._profile?.id!);
      if (profile._unit?.id) {
        Unit.store.forId(profile._unit?.id);
      }
    }
  }, []);

  return (
    <>
      <Route path="/users/:id/edit">
        <UserEditDialog user={user} />
      </Route>

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/users" />
        </Grid.Cell>

        <Grid.Cell span={10}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/users/${id}/edit`}>
              Muokkaa
            </Button>
          </div>
        </Grid.Cell>

        <Grid.Cell span={3}>
          <Card outlined>
            <Card.Media
              square
              style={{
                backgroundImage: `url(${user?.profile?.picture})`,
              }}
            />
          </Card>
        </Grid.Cell>

        <Grid.Cell span={9}>
          <GridRow>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Käyttäjätunnus
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <Typography use="body1" tag="span">
                    {user?.username ?? '-'}
                  </Typography>
                </div>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Sähköposti
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <Typography use="body1" tag="span">
                    {user?.email ?? '-'}
                  </Typography>
                </div>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Etunimi
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <Typography use="body1" tag="span">
                    {user?.firstName ?? '-'}
                  </Typography>
                </div>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Sukunimi
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <Typography use="body1" tag="span">
                    {user?.lastName ?? '-'}
                  </Typography>
                </div>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Yksikkö
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <Typography use="body1" tag="span">
                    {user?.profile?.unit?.title ?? '-'}
                  </Typography>
                </div>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Roolit
                </Typography>
                <List.Divider />
                <List>
                  <For
                    of={user?.groups.all().toArray() ?? []}
                    render={(group, index) => (
                      <List.Item key={index} ripple={false}>
                        {group.name}
                      </List.Item>
                    )}
                  />
                  <If condition={!user?.groups.all().length}>
                    <List.Item ripple={false}>Käyttäjällä ei roolia</List.Item>
                  </If>
                </List>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={6}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Profiilikortti
                </Typography>
                <List.Divider />
                <div style={{ padding: '1rem' }}>
                  <List.Item
                    tag={Link}
                    to={`/profile-cards/${user?._profile.id}`}
                  >
                    Profiilikorttiin
                  </List.Item>
                </div>
              </Card>
            </Grid.Cell>
          </GridRow>
        </Grid.Cell>
      </Grid>
    </>
  );
}
