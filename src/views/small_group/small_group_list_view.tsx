import { For, If } from 'react-extras';
import { Link } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { DataTable, Grid } from 'utils/rmwc';

import { SmallGroup } from 'models';

export function SmallGroupListView() {
  const setState = useSetState();
  let groups = SmallGroup.state.all();

  useAsyncEffect(async (isMounted) => {
    SmallGroup.store.onStateChange(() => {
      if (!isMounted()) return;
      setState(() => {});
    });
    SmallGroup.store.all();
  }, []);

  return (
    <>
      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Pienryhmät</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 160 }}
              tag={Link}
              to="/small-groups/create"
            >
              Luo pienryhmä
            </Button>
          </div>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <DataTable style={{ width: '100%' }}>
            <DataTable.Content>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.HeadCell></DataTable.HeadCell>
                  <DataTable.HeadCell>Nimi</DataTable.HeadCell>
                  <DataTable.HeadCell>Yksikkö</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={groups.toArray()}
                  render={(group, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/small-groups/${group.id}`}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>{group.title ?? '-'}</DataTable.Cell>
                      <DataTable.Cell>
                        {group.unit?.title ?? '-'}
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!groups.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei pienryhmiä</DataTable.Cell>
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
