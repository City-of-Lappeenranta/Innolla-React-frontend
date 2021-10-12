import { For, If } from 'react-extras';
import { Link } from 'react-router-dom';
import { Avatar, Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Grid, List } from 'utils/rmwc';
import { ProfileListBackground } from 'views/graphics/profile_list_view_background';
import { Profile, User } from 'models';

export default function ProfileCardListView() {
  const setState = useSetState();
  let profiles = Profile.state.forCurrentUnit();

  useAsyncEffect(async (isMounted) => {
    Profile.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.all();
    User.store.all();
  }, []);

  return (
    <>
      <List className="mdc-list__profile-list-view">
        <Grid
          className="mdc-grid__profile-list"
          style={{ maxWidth: 1600, margin: 0, padding: 0 }}
        >
          <Grid.Cell span={2}>
            <Typography use="headline5">Lapset</Typography>
          </Grid.Cell>
          <Grid.Cell desktop={10} tablet={6} phone={4}></Grid.Cell>
          <Grid.Cell span={12}>
            <List twoLine style={{ gridColumn: '1/12' }}>
              <For
                of={profiles.toArray()}
                render={(profile, index) => (
                  <List.Item
                    className="mdc-list__profile-list"
                    key={index}
                    tag={Link}
                    to={`/profile-cards/${profile.id}`}
                  >
                    <List.Item.Graphic
                      tag={Avatar}
                      src={profile.picture}
                      name={profile.user?.name ?? '-'}
                      style={{ height: 40, width: 40 }}
                    />
                    <List.Item.Text style={{ alignSelf: 'center' }}>
                      {profile.user?.name ?? '-'}
                    </List.Item.Text>
                  </List.Item>
                )}
              />
              <If condition={!profiles.length}>
                <List.Item>
                  <List.Item.Text>
                    <List.Item.PrimaryText>
                      Ei profiilikortteja
                    </List.Item.PrimaryText>
                  </List.Item.Text>
                </List.Item>
              </If>
            </List>
          </Grid.Cell>
        </Grid>
        <ProfileListBackground></ProfileListBackground>
      </List>
    </>
  );
}
