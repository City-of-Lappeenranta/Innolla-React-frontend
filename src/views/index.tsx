import React, { useState } from 'react';
import {
  Route,
  Switch,
  Link,
  useLocation,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { If } from 'react-extras';
import { Select, Button, Fab } from 'rmwc';

import { Drawer, List } from 'utils/rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Group, Permission, Unit, User } from 'models';

import HomeView from './home_view';
import LoginView from './auth/login_view';
import UnitListView from './unit/unit_list_view';
import UnitDetailView from './unit/unit_detail_view';
import RoomListView from './room/room_list_view';
import RoomDetailView from './room/room_detail_view';
import ReservableRoomListView from './reservable_room/reservable_room_list_view';
import UserListView from './user/user_list_view';
import UserDetailView from './user/user_detail_view';
import ActivityTimeListView from './activity_time/activity_time_list_view';
import ActivityTimeDetailView from './activity_time/activity_time_detail_view';
import AssessmentListView from './assessment/assessment_list_view';
import AssessmentDetailView from './assessment/assessment_detail_view';
import AssessmentQuestionListView from './assessment_question/assessment_question_list_view';
import AssessmentQuestionDetailView from './assessment_question/assessment_question_detail_view';
import ProfileCardListView from './profile_card/profile_list_view';
import ProfileCardDetailView from './profile_card/profile_detail_view';
import TagListView from './tag/tag_list_view';
import TagDetailView from './tag/tag_detail_view';
import { SmallGroupView } from './small_group';

function Init() {
  const setState = useSetState();

  useAsyncEffect(async (isMounted) => {
    Unit.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    User.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Group.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    Permission.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
  }, []);

  useAsyncEffect(async () => {
    await User.store.current();

    const units = await Unit.store.all();
    if (!Unit.state.current) {
      setState(() => {
        Unit.state.current = units.toArray()[0].id;
      });
    }

    Group.store.all();
    Permission.store.all();
  }, []);

  return null;
}

export default function Index() {
  const setState = useSetState();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const units = Unit.state.all();

  let permissions = User.current?.permissions;

  const canViewUser = !!permissions.find((p) => p.codename === 'view_user');
  const canViewUnit = !!permissions.find((p) => p.codename === 'view_unit');
  const canViewRoom = !!permissions.find((p) => p.codename === 'view_room');
  const canViewTag = !!permissions.find((p) => p.codename === 'view_tag');
  const canViewManagementCategory =
    canViewUser || canViewUnit || canViewRoom || canViewTag;

  const canViewProfile = !!permissions.find(
    (p) => p.codename === 'view_profile'
  );
  const canViewReservableRoom = !!permissions.find(
    (p) => p.codename === 'view_reservable_room'
  );
  const canViewActivityTime = !!permissions.find(
    (p) => p.codename === 'view_activitytime'
  );
  const canViewInnollaCategory = canViewReservableRoom || canViewActivityTime;

  return (
    <>
      <If condition={!User.current?.token}>
        <Redirect to="/login" />
      </If>
      <Switch>
        <Route path="/login" exact component={LoginView} />

        <Route path="/">
          <Init />

          <Fab
            className="mdc-fab--extended--main-menu"
            label="Innolla"
            onClick={() => setOpen(!open)}
            icon="menu"
          />

          <Drawer modal open={open} onClose={() => setOpen(false)}>
            <If condition={canViewManagementCategory}>
              <Drawer.Header style={{ minHeight: 'fit-content' }}>
                <Drawer.Subtitle>Hallinta</Drawer.Subtitle>
              </Drawer.Header>
              <Drawer.Content style={{ height: 'unset', overflowY: 'unset' }}>
                <List>
                  <If condition={canViewUser}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/users"
                    >
                      Käyttäjät
                    </List.Item>
                  </If>
                  <If condition={canViewUnit}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/units"
                    >
                      Yksiköt
                    </List.Item>
                  </If>
                  <If condition={canViewUnit}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/small-groups"
                    >
                      Pienryhmät
                    </List.Item>
                  </If>
                  <If condition={canViewRoom}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/rooms"
                    >
                      Tilat
                    </List.Item>
                  </If>
                  <If condition={canViewRoom}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/assessment-questions"
                    >
                      Arviointikysymykset
                    </List.Item>
                  </If>
                  <If condition={canViewTag}>
                    <List.Item location={location} tag={Link} to="/tags">
                      Tagit
                    </List.Item>
                  </If>
                </List>
              </Drawer.Content>
              <List.Divider />
            </If>

            <If condition={canViewInnollaCategory}>
              <Drawer.Header style={{ minHeight: 'fit-content' }}>
                <Drawer.Subtitle>Innolla</Drawer.Subtitle>
              </Drawer.Header>
              <Drawer.Content>
                <div style={{ padding: '20px 10px 10px 10px' }}>
                  <Select
                    className="mdc-select--dense"
                    outlined
                    enhanced
                    label="Yksikkö"
                    value={Unit.state.current}
                    options={units.toArray().map((o) => ({
                      label: o.title,
                      value: o.id,
                    }))}
                    onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                      Unit.state.current = e.currentTarget.value;
                      setState();
                    }}
                  />
                </div>

                <List>
                  <If condition={canViewProfile}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/profile-cards"
                    >
                      Profiilikortit
                    </List.Item>
                  </If>
                  <If condition={canViewReservableRoom}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/reservable-rooms"
                    >
                      Tilat
                    </List.Item>
                  </If>
                  <If condition={canViewActivityTime}>
                    <List.Item
                      onClick={() => setOpen(!open)}
                      location={location}
                      tag={Link}
                      to="/reservations"
                    >
                      Varaukset
                    </List.Item>
                  </If>
                  <List.Item
                    onClick={() => setOpen(!open)}
                    location={location}
                    tag={Link}
                    to="/assessments"
                  >
                    Arvioinnit
                  </List.Item>
                </List>
              </Drawer.Content>
            </If>
            <Drawer.Content>
              <Button
                className=".mdc-drawer__content .mdc-list-item:not(.mdc-list-item--activated)"
                onClick={async () => {
                  try {
                    await User.store.logout();
                    User.current.token = null;
                    User.current = new User({});
                    history.push('/login');
                  } catch (error) {
                    throw new Error("The server couldn't handle the logout.");
                  }
                }}
              >
                Kirjaudu ulos
              </Button>
            </Drawer.Content>
          </Drawer>
          <Drawer.AppContent
            onClick={() => setOpen(false)}
            style={{ minHeight: '15rem', padding: '16px' }}
          >
            <Switch>
              <Route path="/" exact component={HomeView} />

              <Route path="/users/create" component={UserListView} />
              <Route path="/users/:id" component={UserDetailView} />
              <Route path="/users" component={UserListView} />

              <Route
                path="/profile-cards/:id"
                component={ProfileCardDetailView}
              />
              <Route path="/profile-cards" component={ProfileCardListView} />

              <Route path="/units/create" component={UnitListView} />
              <Route path="/units/:id" component={UnitDetailView} />
              <Route path="/units" component={UnitListView} />

              <Route path="/small-groups" component={SmallGroupView} />

              <Route path="/rooms/create" component={RoomListView} />
              <Route path="/rooms/:id" component={RoomDetailView} />
              <Route path="/rooms" component={RoomListView} />

              <Route
                path="/assessments/create"
                component={AssessmentListView}
              />
              <Route path="/assessments/:id" component={AssessmentDetailView} />
              <Route path="/assessments" component={AssessmentListView} />

              <Route
                path="/assessment-questions/create"
                component={AssessmentQuestionListView}
              />
              <Route
                path="/assessment-questions/:id"
                component={AssessmentQuestionDetailView}
              />
              <Route
                path="/assessment-questions"
                component={AssessmentQuestionListView}
              />

              <Route path="/tags/create" component={TagListView} />
              <Route path="/tags/:id" component={TagDetailView} />
              <Route path="/tags" component={TagListView} />

              <Route
                path="/reservations/:id"
                component={ActivityTimeDetailView}
              />
              <Route path="/reservations" component={ActivityTimeListView} />

              <Route
                path="/reservable-rooms/create"
                component={ReservableRoomListView}
              />
              <Route
                path="/reservable-rooms/:id"
                component={ReservableRoomListView}
              />
              <Route
                path="/reservable-rooms"
                component={ReservableRoomListView}
              />
            </Switch>
          </Drawer.AppContent>
        </Route>
      </Switch>
    </>
  );
}
