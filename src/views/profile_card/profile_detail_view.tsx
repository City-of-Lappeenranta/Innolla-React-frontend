import { Choose, For, If } from 'react-extras';
import { Link, Route, useParams } from 'react-router-dom';
import { Typography, IconButton, ChipSet, Chip, Button } from 'rmwc';
import { format } from 'date-fns';
import { QuerySet } from '@dream/lucid-orm';

import { useSetState, useAsyncEffect } from 'hooks';
import { Card, Grid, List } from 'utils/rmwc';
import UserAvatar from 'views/graphics/profile_list_user_avatar';
import { ProfileTagsView } from './profile_tags_view';
import { ProfileTagAttachView } from './profile_tag_attach_view';
import {
  ActivityTime,
  Assessment,
  AssessmentResponse,
  Profile,
  Tag,
  User,
} from 'models';

export default function ProfileCardDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();

  const profile = Profile.state.forId(id);

  useAsyncEffect(async (isMounted) => {
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
    Assessment.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    AssessmentResponse.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Tag.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Profile.store.all();
    User.store.all();
    ActivityTime.store.all();
    Assessment.store.all();
    AssessmentResponse.store.all();
    Tag.store.all();
  }, []);

  const skills =
    profile?.tags.all().filter((o) => o.category === Tag.SKILLS) ??
    new QuerySet([]);
  const developmentTarget =
    profile?.tags.all().filter((o) => o.category === Tag.DEVELOPMENT_TARGET) ??
    new QuerySet([]);
  const pointOfInterests =
    profile?.tags.all().filter((o) => o.category === Tag.POINT_OF_INTERESTS) ??
    new QuerySet([]);
  const other =
    profile?.tags.all().filter((o) => o.category === Tag.OTHER) ??
    new QuerySet([]);

  return (
    <>
      <Route path="/profile-cards/:id/tags">
        <ProfileTagsView profile={profile} />
      </Route>
      <Route path="/profile-cards/:id/attach/:tagCategory">
        <ProfileTagAttachView profile={profile} setState={setState} />
      </Route>

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Row className="mdc-layout-grid__profile-details">
          <Grid.Cell
            desktop={10}
            tablet={8}
            phone={4}
            className="mdc-layout-grid__profile-details__cell"
          >
            <IconButton
              className="mdc-layout-grid__profile-details_back-arrow"
              icon="/img/ikoni_back.svg"
              tag={Link}
              to="/profile-cards"
            />
          </Grid.Cell>

          <Grid.Cell
            className="mdc-layout-grid__profile-details__usercard"
            span={8}
          >
            <UserAvatar></UserAvatar>
          </Grid.Cell>
          <Grid.Cell span={8}>
            <Grid.Row className="mdc-layout-grid__inner__profile-detail__taglist">
              <Grid.Cell span={4}>
                <Card outlined>
                  <CardTop>
                    <Typography
                      className="mdc-layout-grid__inner__profile-detail__taglist__headers"
                      use="subtitle1"
                      tag="div"
                    >
                      Vahvuudet
                    </Typography>
                    <Button
                      className="mdc-layout-grid__inner__profile-detail__taglist__skills"
                      trailingIcon="/img/ikoni_plus.svg"
                      tag={Link}
                      to={`/profile-cards/${id}/attach/${Tag.SKILLS}`}
                    >
                      Lisää
                    </Button>
                  </CardTop>

                  <ChipSet>
                    <For
                      of={skills.toArray()}
                      render={(tag, index) => (
                        <If key={index} condition={index < 4}>
                          <Chip>{tag.title}</Chip>
                        </If>
                      )}
                    />
                    <If condition={skills.length > 4}>
                      <Chip>...</Chip>
                    </If>
                    <If condition={!skills.length}>
                      <div style={{ padding: 10 }}>{'-'}</div>
                    </If>
                  </ChipSet>
                </Card>
              </Grid.Cell>
              <Grid.Cell span={4}>
                <Card outlined>
                  <CardTop>
                    <Typography
                      className="mdc-layout-grid__inner__profile-detail__taglist__headers"
                      use="subtitle1"
                      tag="div"
                    >
                      Harjoiteltavat asiat
                    </Typography>
                    <Button
                      className="mdc-layout-grid__inner__profile-detail__taglist__development-target"
                      trailingIcon="/img/ikoni_plus.svg"
                      tag={Link}
                      to={`/profile-cards/${id}/attach/${Tag.DEVELOPMENT_TARGET}`}
                    >
                      Lisää
                    </Button>
                  </CardTop>

                  <ChipSet>
                    <For
                      of={developmentTarget.toArray()}
                      render={(tag, index) => (
                        <If key={index} condition={index < 4}>
                          <Chip>{tag.title}</Chip>
                        </If>
                      )}
                    />
                    <If condition={developmentTarget.length > 4}>
                      <Chip>...</Chip>
                    </If>
                    <If condition={!developmentTarget.length}>
                      <div style={{ padding: 10 }}>{'-'}</div>
                    </If>
                  </ChipSet>
                </Card>
              </Grid.Cell>
              <Grid.Cell span={4}>
                <Card outlined>
                  <CardTop>
                    <Typography
                      className="mdc-layout-grid__inner__profile-detail__taglist__headers"
                      use="subtitle1"
                      tag="div"
                    >
                      Kiinnostuksen kohteet
                    </Typography>
                    <Button
                      className="mdc-layout-grid__inner__profile-detail__taglist__poi"
                      trailingIcon="/img/ikoni_plus.svg"
                      tag={Link}
                      to={`/profile-cards/${id}/attach/${Tag.POINT_OF_INTERESTS}`}
                    >
                      Lisää
                    </Button>
                  </CardTop>

                  <ChipSet>
                    <For
                      of={pointOfInterests.toArray()}
                      render={(tag, index) => (
                        <If key={index} condition={index < 4}>
                          <Chip>{tag.title}</Chip>
                        </If>
                      )}
                    />
                    <If condition={pointOfInterests.length > 4}>
                      <Chip>...</Chip>
                    </If>
                    <If condition={!pointOfInterests.length}>
                      <div style={{ padding: 10 }}>{'-'}</div>
                    </If>
                  </ChipSet>
                </Card>
              </Grid.Cell>
              <Grid.Cell span={4}>
                <Card outlined>
                  <CardTop>
                    <Typography
                      className="mdc-layout-grid__inner__profile-detail__taglist__headers"
                      use="subtitle1"
                      tag="div"
                    >
                      Muuta huomioitavaa
                    </Typography>
                    <Button
                      className="mdc-layout-grid__inner__profile-detail__taglist__other"
                      trailingIcon="/img/ikoni_plus.svg"
                      tag={Link}
                      to={`/profile-cards/${id}/attach/${Tag.OTHER}`}
                    >
                      Lisää
                    </Button>
                  </CardTop>

                  <ChipSet>
                    <For
                      of={other.toArray()}
                      render={(tag, index) => (
                        <If key={index} condition={index < 4}>
                          <Chip>{tag.title}</Chip>
                        </If>
                      )}
                    />
                    <If condition={other.length > 4}>
                      <Chip>...</Chip>
                    </If>
                    <If condition={!other.length}>
                      <div style={{ padding: 10 }}>{'-'}</div>
                    </If>
                  </ChipSet>
                </Card>
              </Grid.Cell>

              <Grid.Cell span={12}>
                <Button
                  className="mdc-layout-grid__inner__profile-detail__taglist__showall"
                  tag={Link}
                  to={`/profile-cards/${profile?.id}/tags`}
                  style={{ float: 'right' }}
                >
                  Näytä kaikki
                </Button>
              </Grid.Cell>
            </Grid.Row>
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row className="mdc-layout-grid__profile-activities-assesments">
          <Grid.Cell
            className="mdc-layout-grid__profile-activities-assesments__activities-grid mdc-layout-grid__profile-activities-assesments__activities-grid-actions"
            span={4}
          >
            <If condition={!!profile?.activities.all().length}>
              <Card
                className="mdc-layout-grid__profile-activities-assesments__activities-grid-card"
                outlined
              >
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Toimintahetket
                </Typography>

                <List
                  className="mdc-layout-grid__profile-activities-assesments__activities-listitems"
                  style={{ heigth: 400 }}
                >
                  <For
                    of={profile?.activities.all().toArray() ?? []}
                    render={(activity, index) => {
                      return (
                        <List.Item key={index}>{`${
                          activity.startTime &&
                          format(activity.startTime, 'dd.MM.yyyy HH:mm')
                        }  ${activity.title}`}</List.Item>
                      );
                    }}
                  />
                </List>
              </Card>
            </If>
          </Grid.Cell>

          <Grid.Cell
            className="mdc-layout-grid__profile-activities-assesments__activities-grid mdc-layout-grid__profile-activities-assesments__activities-grid"
            span={4}
          >
            <Grid.Row>
              <For
                of={profile?.responses?.toArray() ?? []}
                render={(response, index) => {
                  return (
                    <Grid.Cell key={index} span={12}>
                      <Card outlined>
                        <Typography
                          use="subtitle1"
                          tag="div"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <Choose>
                            <Choose.When
                              condition={
                                response.of === AssessmentResponse.CHILD
                              }
                            >
                              Kasvattajan havainnot lapsen toiminnasta
                            </Choose.When>
                            <Choose.When
                              condition={
                                response.of === AssessmentResponse.ADULT
                              }
                            >
                              Lapsen arvio kasvattajan toiminnasta
                            </Choose.When>
                            <Choose.When
                              condition={
                                response.of === AssessmentResponse.ACTIVITY
                              }
                            >
                              Lapsen arvio toiminnan sisällöstä
                            </Choose.When>
                          </Choose>
                        </Typography>

                        <div style={{ padding: '1rem' }}>
                          {/* <Typography use="body1" tag="span">
                        </Typography> */}
                          <Link to={`/assessments/${response.assessment?.id}`}>
                            {'Arvio kokonaisuudessaan >'}
                          </Link>
                        </div>
                      </Card>
                    </Grid.Cell>
                  );
                }}
              />
            </Grid.Row>
          </Grid.Cell>
        </Grid.Row>
      </Grid>
    </>
  );
}

function CardTop(props: any) {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        gridTemplateColumns: '1fr auto',
        padding: '0.5rem 1rem',
      }}
      {...props}
    />
  );
}
