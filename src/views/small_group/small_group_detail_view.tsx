import { Link, useParams } from 'react-router-dom';
import { Typography, Button, IconButton, Avatar } from 'rmwc';
import { For, If } from 'react-extras';

import { Grid, Card, List } from 'utils/rmwc';
import { Profile, SmallGroup, User } from 'models';
import { useSetState, useAsyncEffect } from 'hooks';

interface RouteParams {
  id: string;
}

export function SmallGroupDetailView() {
  const setState = useSetState();
  const params = useParams<RouteParams>();
  const group = SmallGroup.state.forId(params.id);

  useAsyncEffect(async (isMounted) => {
    SmallGroup.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    const group = await SmallGroup.store.forId(params.id);
    Profile.store.forGroup(group!);
    User.store.all();
  }, []);

  return (
    <>
      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/small-groups" />
        </Grid.Cell>

        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/small-groups/${params.id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/small-groups/${params.id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Grid.Row>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Nimi
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {group?.title}
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Grid.Row>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Yksikkö
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {group?.unit?.title ?? '-'}
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Grid.Row>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Lapset
                </Typography>
                <List.Divider />
                <List>
                  <For
                    of={group?.profiles.all().toArray() ?? []}
                    render={(profile, index) => {
                      return (
                        <List.Item
                          key={index}
                          tag={Link}
                          to={`/profile-cards/${profile.id}`}
                        >
                          <List.Item.Graphic
                            tag={Avatar}
                            src={profile.picture}
                            name={`${profile.user?.name}`}
                            style={{ height: 40, width: 40 }}
                          />
                          <List.Item.Text style={{ alignSelf: 'center' }}>
                            {`${profile.user?.name}`}
                          </List.Item.Text>
                        </List.Item>
                      );
                    }}
                  />
                </List>
                <If condition={!group?.profiles.all().length}>
                  <List.Item ripple={false}>Ryhmässä ei lapsia</List.Item>
                </If>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>
      </Grid>
    </>
  );
}
