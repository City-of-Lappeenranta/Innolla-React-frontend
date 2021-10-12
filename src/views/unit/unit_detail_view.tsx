import { Unit } from 'models';
import { Route, Link, useParams } from 'react-router-dom';
import { Typography, Button, IconButton } from 'rmwc';

import { useSetState, useAsyncEffect } from 'hooks';
import { Grid, Card, List } from 'utils/rmwc';
import { UnitEditDialog } from 'views/unit/dialogs/unit_dialogs';
import { UnitDeleteView } from './unit_delete_view';

export default function UnitDetailView() {
  const setState = useSetState();
  const { id = null }: any = useParams();
  const unit: Unit | undefined = Unit.state.forId(id);

  useAsyncEffect(async (isMounted) => {
    Unit.store.onStateChange(() => {
      if (!isMounted) return;
      setState();
    });
    Unit.store.forId(id);
  }, []);

  return (
    <>
      <Route path="/units/:id/edit">
        <UnitEditDialog unit={unit} />
      </Route>
      <Route path="/units/:id/delete" component={UnitDeleteView} />

      <Grid style={{ maxWidth: 1600, margin: 0, padding: 0 }}>
        <Grid.Cell span={2}>
          <IconButton icon="arrow_back" tag={Link} to="/units" />
        </Grid.Cell>
        <Grid.Cell span={10}>
          <Grid.Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button raised tag={Link} to={`/units/${id}/edit`}>
              Muokkaa
            </Button>
            <Button raised tag={Link} to={`/units/${id}/delete`}>
              Poista
            </Button>
          </Grid.Row>
        </Grid.Cell>

        <Grid.Cell span={4}>
          <Card outlined>
            <Card.PrimaryAction>
              <Card.Media
                sixteenByNine
                style={{
                  backgroundImage: `url(${unit?.floorPlan})`,
                }}
              />
              <div style={{ padding: '0 1rem 1rem 1rem' }}>
                <Typography use="headline6" tag="h2">
                  {unit?.title}
                </Typography>
                <Typography
                  use="subtitle2"
                  tag="h3"
                  style={{ marginTop: '-1rem' }}
                >
                  {unit?.address}
                </Typography>
                <Typography use="body1" tag="div">
                  {unit?.city}
                </Typography>
              </div>
            </Card.PrimaryAction>
          </Card>
        </Grid.Cell>
        <Grid.Cell span={8}>
          <Grid.Row>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Katuosoite
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {unit?.address}
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Paikkakunta
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {unit?.city}
                    </Typography>
                  </div>
                </Card.PrimaryAction>
              </Card>
            </Grid.Cell>
            <Grid.Cell span={12}>
              <Card outlined>
                <Typography
                  use="subtitle1"
                  tag="div"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Postinumero
                </Typography>
                <List.Divider />
                <Card.PrimaryAction>
                  <div style={{ padding: '1rem' }}>
                    <Typography use="body1" tag="span">
                      {unit?.postalCode}
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
