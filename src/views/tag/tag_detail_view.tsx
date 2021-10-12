import { Link, Route, useParams } from 'react-router-dom';
import { Typography, IconButton, Button } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Grid, Card, List } from 'utils/rmwc';
import { Tag } from 'models/tag';
import { TagEditDialog } from './dialogs/tag_edit_dialog';
import { TagDeleteView } from './tag_delete_view';

export default function TagDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const tag: Tag | undefined = Tag.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    Tag.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Tag.store.forId(id);
  }, []);

  return (
    <>
      <Route path="/tags/:id/edit">
        <TagEditDialog tag={tag} />
      </Route>
      <Route path="/tags/:id/delete" component={TagDeleteView} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/tags" />
        </Grid.Cell>
        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/tags/${id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/tags/${id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={6}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Tagi
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {tag?.title ?? '-'}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
        <Grid.Cell span={6}>
          <Card outlined>
            <Typography
              use="subtitle1"
              tag="div"
              style={{ padding: '0.5rem 1rem' }}
            >
              Kategoria
            </Typography>
            <List.Divider />
            <Card.PrimaryAction>
              <div style={{ padding: '1rem' }}>
                <Typography use="body1" tag="span">
                  {Tag.CATEGORY_CHOICES.find((o) => o.value === tag?.category)
                    ?.label ?? '-'}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
}
