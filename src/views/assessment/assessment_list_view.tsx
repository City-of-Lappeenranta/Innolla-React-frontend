import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Avatar, Button, Typography } from 'rmwc';

import { Grid, List } from 'utils/rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { ActivityTime, Assessment, Profile, User } from 'models';
import { AssessmentCreateDialog } from 'views/assessment/dialogs/assessment_create_dialog';
import { ProfileListBackground } from 'views/graphics/profile_list_view_background';

export default function AssessmentListView() {
  const setState = useSetState();
  let assessments = Assessment.state.forCurrentUnit();

  useAsyncEffect(async (isMounted) => {
    Assessment.store.onStateChange(() => {
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
    ActivityTime.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Assessment.store.all();
    Profile.store.all();
    User.store.all();
    ActivityTime.store.all();
  }, []);

  return (
    <>
      <Route path="/assessments/create" component={AssessmentCreateDialog} />
      <List className="mdc-list__profile-list-view">
        <Grid
          className="mdc-grid__profile-list"
          style={{ maxWidth: 1600, margin: 0, padding: 0 }}
        >
          <Grid.Cell span={2}>
            <Typography use="headline5">Arvioinnit</Typography>
          </Grid.Cell>
          <Grid.Cell desktop={10} tablet={6} phone={4}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                className="mdc-grid__profile-list__create-button"
                raised
                style={{ maxWidth: 160 }}
                tag={Link}
                to="/assessments/create"
              >
                Luo arviointi
              </Button>
            </div>
          </Grid.Cell>

          <Grid.Cell span={12}>
            <List twoLine style={{ gridColumn: '1/12' }}>
              <For
                of={assessments.toArray()}
                render={(assessment, index) => (
                  <List.Item
                    className="mdc-list__profile-list"
                    key={index}
                    tag={Link}
                    to={`/assessments/${assessment.id}`}
                  >
                    <List.Item.Graphic
                      tag={Avatar}
                      src={assessment.ofChild?.picture}
                      name={assessment.ofChild?.user?.name ?? '-'}
                      style={{ height: 40, width: 40 }}
                    />
                    <List.Item.Text>
                      <List.Item.PrimaryText>
                        {assessment.ofChild?.user?.name ?? '-'}
                      </List.Item.PrimaryText>
                      <List.Item.SecondaryText>
                        {assessment?.ofActivity?.title}
                      </List.Item.SecondaryText>
                    </List.Item.Text>
                  </List.Item>
                )}
              />
              <If condition={!assessments.length}>
                <List.Item>
                  <List.Item.Text>
                    <List.Item.PrimaryText>
                      Ei arviointeja
                    </List.Item.PrimaryText>
                    <List.Item.SecondaryText>
                      Luo uusi arviointi
                    </List.Item.SecondaryText>
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
