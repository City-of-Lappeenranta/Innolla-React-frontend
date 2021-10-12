import { For, If } from 'react-extras';
import { Link, Route } from 'react-router-dom';
import { Button, IconButton, Typography } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { DataTable, Grid } from 'utils/rmwc';

import { Unit } from 'models';
import { UnitCreateDialog } from 'views/unit/dialogs/unit_dialogs';

export default function UnitListView() {
  const setState = useSetState();
  const units = Unit.state.all();

  useAsyncEffect(async (isMounted) => {
    Unit.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Unit.store.all();
  }, []);

  return (
    <>
      <Route path="/units/create" component={UnitCreateDialog} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <Typography use="headline5">Yksiköt</Typography>
        </Grid.Cell>
        <Grid.Cell desktop={10} tablet={6} phone={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              raised
              style={{ maxWidth: 160 }}
              tag={Link}
              to="/units/create"
            >
              Luo yksikkö
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
                  <DataTable.HeadCell>Katuosoite</DataTable.HeadCell>
                  <DataTable.HeadCell>Paikkakunta</DataTable.HeadCell>
                  <DataTable.HeadCell>Postinumero</DataTable.HeadCell>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                <For
                  of={units.toArray()}
                  render={(unit, index) => (
                    <DataTable.Row key={index} selected={false}>
                      <DataTable.Cell>
                        <IconButton
                          icon="open_in_new"
                          tag={Link}
                          to={`/units/${unit.id}`}
                        ></IconButton>
                      </DataTable.Cell>
                      <DataTable.Cell>{unit.title}</DataTable.Cell>
                      <DataTable.Cell>{unit.address}</DataTable.Cell>
                      <DataTable.Cell>{unit.city}</DataTable.Cell>
                      <DataTable.Cell>{unit.postalCode}</DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
                <If condition={!units.length}>
                  <DataTable.Row>
                    <DataTable.Cell>Ei yksiköitä</DataTable.Cell>
                    <DataTable.Cell></DataTable.Cell>
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
