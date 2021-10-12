import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { DataTable, Grid } from 'utils/rmwc';

import { AssessmentQuestion } from 'models/assessment_question';
import { AssessmentQuestionCreateDialog } from 'views/assessment_question/dialogs/assessment_question_create_dialog';
import { useSetState, useAsyncEffect } from 'hooks';

export default function AssessmentQuestionListView() {
  const setState = useSetState();
  const questions = AssessmentQuestion.state.all();

  useAsyncEffect(async (isMounted) => {
    AssessmentQuestion.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });

    AssessmentQuestion.store.all();
  }, []);

  return (
    <>
      <Route
        path="/assessment-questions/create"
        component={AssessmentQuestionCreateDialog}
      />
      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Arviointikysymykset</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 220 }}
              tag={Link}
              to="/assessment-questions/create"
            >
              Luo arviointikysymys
            </Button>
          </div>
        </Grid.Cell>

        <Grid.Cell span={12}>
          <DataTable style={{ width: '100%' }}>
            <DataTable.Content>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.HeadCell></DataTable.HeadCell>
                  <DataTable.HeadCell>Kohde</DataTable.HeadCell>
                  <DataTable.HeadCell>Kysymys</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={questions.toArray()}
                  render={(assessmentQuestion, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/assessment-questions/${assessmentQuestion.id}`}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {
                          AssessmentQuestion.OF_CHOICES.find(
                            (choice) => choice.value === assessmentQuestion.of
                          )?.label
                        }
                      </DataTable.Cell>
                      <DataTable.Cell>{assessmentQuestion.text}</DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!questions.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei arviointikysymyksiä</DataTable.Cell>
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
