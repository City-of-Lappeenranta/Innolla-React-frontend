import { Route, Link, useParams } from 'react-router-dom';
import { Typography, Button, IconButton } from 'rmwc';

import { Grid, Card, List } from 'utils/rmwc';
import { useSetState, useAsyncEffect } from 'hooks';
import { AssessmentQuestionEditDialog } from 'views/assessment_question/dialogs/assessment_question_edit_dialog';
import { AssessmentQuestionDeleteView } from './assessment_question_delete_view';
import { AssessmentQuestion } from 'models/assessment_question';

export default function AssessmentQuestionDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const question: AssessmentQuestion | undefined =
    AssessmentQuestion.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    AssessmentQuestion.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    AssessmentQuestion.store.forId(id);
  }, []);

  return (
    <>
      <Route path="/assessment-questions/:id/edit">
        <AssessmentQuestionEditDialog question={question} />
      </Route>
      <Route
        path="/assessment-questions/:id/delete"
        component={AssessmentQuestionDeleteView}
      />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/assessment-questions" />
        </Grid.Cell>
        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/assessment-questions/${id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/assessment-questions/${id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={12}>
          <Grid.Row>
            <Grid.Cell span={4}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Kohde
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {
                        AssessmentQuestion.OF_CHOICES.find(
                          (choice) => choice.value === question?.of
                        )?.label
                      }
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={8}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Kysymys
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {question?.text}
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
          </Grid.Row>
        </Grid.Cell>
      </Grid>
    </>
  );
}
