import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { DataTable, Grid } from 'utils/rmwc';
import { TagCreateDialog } from './dialogs/tag_create_dialog';
import { Tag } from 'models/tag';
import { useSetState, useAsyncEffect } from 'hooks';

export default function TagListView() {
  const setState = useSetState();
  const tags = Tag.state.all();

  useAsyncEffect(async (isMounted) => {
    Tag.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Tag.store.all();
  }, []);

  return (
    <>
      <Route path="/tags/create" component={TagCreateDialog} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Tagit</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 160 }}
              tag={Link}
              to="/tags/create"
            >
              Luo tagi
            </Button>
          </div>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <DataTable style={{ width: '100%' }}>
            <DataTable.Content>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.HeadCell></DataTable.HeadCell>
                  <DataTable.HeadCell>Tagi</DataTable.HeadCell>
                  <DataTable.HeadCell>Kategoria</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={tags.toArray()}
                  render={(tag, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/tags/${tag.id}`}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>{tag.title}</DataTable.Cell>
                      <DataTable.Cell>
                        {Tag.CATEGORY_CHOICES.find(
                          (o) => o.value === tag.category
                        )?.label ?? '-'}
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!tags.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei tageja</DataTable.Cell>
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
