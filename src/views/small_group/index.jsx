import { Route, Switch } from 'react-router-dom';

import { SmallGroupListView } from './small_group_list_view';
import { SmallGroupCreateView } from './small_group_create_view';
import { SmallGroupEditView } from './small_group_edit_view';
import { SmallGroupDetailView } from './small_group_detail_view';
import { SmallGroupDeleteView } from './small_group_delete_view';

export function SmallGroupView() {
  return (
    <Switch>
      <Route exact path="/small-groups" component={SmallGroupListView} />

      <Route exact path="/small-groups/create">
        <SmallGroupListView />
        <SmallGroupCreateView />
      </Route>

      <Route exact path="/small-groups/:id/" component={SmallGroupDetailView} />

      <Route exact path="/small-groups/:id/edit">
        <SmallGroupDetailView />
        <SmallGroupEditView />
      </Route>

      <Route exact path="/small-groups/:id/delete">
        <SmallGroupDetailView />
        <SmallGroupDeleteView />
      </Route>
    </Switch>
  );
}
