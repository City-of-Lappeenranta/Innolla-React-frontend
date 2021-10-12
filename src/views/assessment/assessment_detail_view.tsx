import { useState } from 'react';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { Typography, IconButton, TabBarOnActivateEventT, Tooltip } from 'rmwc';
import { For, If } from 'react-extras';
import { QuerySet } from '@dream/lucid-orm';

import { useSetState, useAsyncEffect } from 'hooks';
import { Grid, Card, TabBar, List, Smiley } from 'utils/rmwc';
import {
  Assessment,
  AssessmentQuestion,
  AssessmentResponse,
  Profile,
  User,
} from 'models';

import { AssessmentResponseCreateDialog } from 'views/assessment/dialogs/assessment_response_create_dialog';
import { AssessmentResponseDeleteView } from './response_delete_view';
import AssessmentDetailImage from 'views/graphics/assessment_view_detail_image';
import AssessmentAvatar from 'views/graphics/assessment_view_user_avatar';

export default function AssessmentDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();

  const assessment: Assessment | undefined = Assessment.state.forId(id);
  const questions = AssessmentQuestion.state.all();

  useAsyncEffect(async (isMounted) => {
    Assessment.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    AssessmentQuestion.store.onStateChange(() => {
      if (!isMounted()) return;
      setState();
    });
    AssessmentResponse.store.onStateChange(() => {
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
    AssessmentQuestion.store.all();
    Profile.store.all();
    User.store.all();
    const assessment = await Assessment.store.forId(id);
    AssessmentResponse.store.forAssessment(assessment!);
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const activeOfChoice = AssessmentResponse.OF_CHOICES[activeTab];

  function filterByActiveOfChoiceAndExludeAlreadyResponded() {
    return (
      questions
        .filter((question) => question.of === activeOfChoice.value)
        .filter((question) => {
          let exclude = false;
          assessment?.responses.all().forEach((response) => {
            if (question.id === response.question?.id) {
              exclude = true;
            }
          });
          return !exclude;
        }) ?? []
    );
  }

  const activeResponses =
    assessment?.responses.all().filter((response) => {
      return response.of === activeOfChoice.value;
    }) ?? new QuerySet([]);

  async function rate(rating: number) {
    assessment!.rating = rating;
    await Assessment.store.update(assessment!);
    setState();
  }

  return (
    <>
      <Switch>
        <Route
          path="/assessments/:id/responses/create"
          component={AssessmentResponseCreateDialog}
        />
        <Route
          path="/assessments/:id/responses/:responseId"
          component={AssessmentResponseDeleteView}
        />
      </Switch>

      <Grid
        className="mdc-layout-grid__assessment-detail-grid"
        style={{ maxWidth: 1600, margin: 0, padding: '5vw' }}
      >
        <Grid.Cell
          className="mdc-layout-grid__assessment-detail__backcell"
          span={2}
        >
          <IconButton
            className="mdc-layout-grid__profile-details_back-arrow"
            icon="/img/ikoni_back.svg"
            tag={Link}
            to="/assessments"
          />
        </Grid.Cell>
        <Grid.Cell desktop={12} tablet={8} phone={4}></Grid.Cell>

        <Grid.Cell
          span={4}
          className="mdc-layout-grid__assessment-detail__useravatar"
        >
          <AssessmentAvatar></AssessmentAvatar>
        </Grid.Cell>
        <Grid.Cell span={4}>
          <AssessmentDetailImage></AssessmentDetailImage>
        </Grid.Cell>

        <Grid.Cell
          className="mdc-layout-grid__assessment-detail__smiley-container"
          span={10}
        >
          <Card
            outlined
            className="mdc-layout-grid__assessment-detail__smiley-container__innercard"
          >
            <Typography
              className="mdc-layout-grid__assessment-detail__smiley-container__innercard__header"
              use="headline6"
              tag="div"
              style={{ padding: '1rem' }}
            >
              Arviointi toimintahetkestä
            </Typography>
            <div
              style={{
                padding: '0 1rem 1rem 1rem',
                display: 'grid',
                gridAutoFlow: 'column',
                gridTemplateColumns: 'repeat(auto-fill, 1fr)',
                columnGap: 10,
              }}
            >
              <Smiley
                url="/img/smiley_sad.svg"
                onClick={() => rate(1)}
                active={assessment?.rating === 1}
              />
              <Smiley
                url="/img/smiley_sad2.svg"
                onClick={() => rate(2)}
                active={assessment?.rating === 2}
              />
              <Smiley
                url="/img/smiley_sad3.svg"
                onClick={() => rate(3)}
                active={assessment?.rating === 3}
              />
              <Smiley
                url="/img/smiley_neutral.svg"
                onClick={() => rate(4)}
                active={assessment?.rating === 4}
              />
              <Smiley
                url="/img/smiley_happy.svg"
                onClick={() => rate(5)}
                active={assessment?.rating === 5}
              />
              <Smiley
                url="/img/smiley_happy2.svg"
                onClick={() => rate(6)}
                active={assessment?.rating === 6}
              />
            </div>
          </Card>
        </Grid.Cell>
        <Grid.Cell
          className="mdc-layout-grid__assessment-detail__vocal-replies"
          span={4}
        >
          <Grid.Row className="mdc-layout-grid__assessment-detail__vocal-replies__innerrow">
            <Grid.Cell
              className="mdc-layout-grid__assessment-detail__vocal-replies__innercell-left"
              span={4}
            >
              <Card
                outlined
                className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card"
              >
                <Typography
                  className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__header"
                  use="headline6"
                  tag="div"
                  style={{ padding: '1rem' }}
                >
                  Suulliset vastaukset
                </Typography>
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <TabBar
                    className="mdc-tab-assessment-detail__vocal-replies__tapbar"
                    activeTabIndex={activeTab}
                    onActivate={(e: TabBarOnActivateEventT) =>
                      setActiveTab(e.detail.index)
                    }
                  >
                    <For
                      of={AssessmentResponse.OF_CHOICES ?? []}
                      render={(choice, index: number) => (
                        <TabBar.Tab
                          className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__list"
                          key={index}
                        >
                          {choice.label}
                        </TabBar.Tab>
                      )}
                    />
                  </TabBar>
                  <List>
                    <For
                      of={activeResponses.toArray()}
                      render={(response: AssessmentResponse, index: number) => (
                        <List.Item
                          className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__list__inneritem"
                          key={index}
                          ripple={false}
                        >
                          <Tooltip
                            activateOn={['hover', 'focus', 'click']}
                            leaveDelay={1000}
                            content={`${response?.question?.text}: ${response?.answer}`}
                          >
                            <List.Item.Text>{`${response?.question?.text}: ${response?.answer}`}</List.Item.Text>
                          </Tooltip>
                          <List.Item.Meta>
                            <IconButton
                              icon="delete"
                              tag={Link}
                              to={`/assessments/${id}/responses/${response.id}`}
                            />
                          </List.Item.Meta>
                        </List.Item>
                      )}
                    />
                    <If condition={!activeResponses.length}>
                      <List.Item>
                        <List.Item.Text>Ei vastauksia</List.Item.Text>
                      </List.Item>
                    </If>
                  </List>
                </div>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell
          className="mdc-layout-grid__assessment-detail__vocal-replies"
          span={4}
        >
          <Grid.Row className="mdc-layout-grid__assessment-detail__vocal-replies__innerrow">
            <Grid.Cell
              className="mdc-layout-grid__assessment-detail__vocal-replies__innercell"
              span={4}
            >
              <Card
                className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card"
                outlined
              >
                <Typography
                  className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__header"
                  use="headline6"
                  tag="div"
                  style={{ padding: '1rem' }}
                >
                  Suulliset kysymykset
                </Typography>
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <List>
                    <For
                      of={filterByActiveOfChoiceAndExludeAlreadyResponded().toArray()}
                      render={(question: AssessmentQuestion, index: number) => (
                        <List.Item
                          className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__list__inneritem"
                          key={index}
                          tag={Link}
                          to={{
                            pathname: `/assessments/${assessment?.id}/responses/create`,
                            search: `?of=${activeOfChoice.value}&question=${question.id}`,
                          }}
                        >
                          <List.Item.Meta className="mdc-layout-grid__assessment-detail__vocal-replies__innercell__card__list__inneritem__question-icon">
                            <img
                              src="/img/ikoni_question.svg"
                              alt="kysymys-ikoni"
                            />
                          </List.Item.Meta>
                          <List.Item.Text>{question.text}</List.Item.Text>
                        </List.Item>
                      )}
                    />
                  </List>
                </div>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>
      </Grid>
    </>
  );
}
