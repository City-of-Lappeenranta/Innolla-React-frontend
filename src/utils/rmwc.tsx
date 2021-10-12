import React from 'react';
import { Location } from 'history';
import * as rmwc from 'rmwc';
import { Image } from 'react-extras';

export class DataTable extends React.Component<{
  className?: string;
  style?: any;
}> {
  static Content = rmwc.DataTableContent;
  static Head = rmwc.DataTableHead;
  static Row = rmwc.DataTableRow;
  static HeadCell = rmwc.DataTableHeadCell;
  static Body = rmwc.DataTableBody;
  static Cell = rmwc.DataTableCell;
  render() {
    return <rmwc.DataTable {...this.props} />;
  }
}

export class Drawer extends React.Component<{
  dismissible?: boolean;
  open?: boolean;
  modal?: boolean;
  onClose?: any;
}> {
  static Title = rmwc.DrawerTitle;
  static Header = rmwc.DrawerHeader;
  static Subtitle = rmwc.DrawerSubtitle;
  static Content = rmwc.DrawerContent;
  static AppContent = rmwc.DrawerAppContent;
  render() {
    return <rmwc.Drawer {...this.props} />;
  }
}

export class Dialog extends React.Component<{
  open?: boolean;
  onClose?: any;
  onClosed?: any;
  preventOutsideDismiss?: boolean;
  className?: any;
  style?: any;
}> {
  static Title = rmwc.DialogTitle;
  static Content = rmwc.DialogContent;
  static Actions = rmwc.DialogActions;
  static Button = rmwc.DialogButton;
  render() {
    return <rmwc.Dialog {...this.props} />;
  }
}

export class ListItem extends React.Component<{
  tag?: any;
  to?: any;
  activated?: boolean;
  disabled?: boolean;
  location?: Location;
  onClick?: Function;
  selected?: boolean;
  ripple?: boolean;
  className?: string;
}> {
  static Text = rmwc.ListItemText;
  static PrimaryText = rmwc.ListItemPrimaryText;
  static SecondaryText = rmwc.ListItemSecondaryText;
  static Meta = rmwc.ListItemMeta;
  static Graphic = rmwc.ListItemGraphic;
  render() {
    let activated = this.props.activated;

    if (this.props.location) {
      activated = this.props.location.pathname.includes(this.props.to);
    }

    return <rmwc.ListItem {...this.props} activated={activated} />;
  }
}

export class List extends React.Component<{
  tag?: any;
  to?: any;
  style?: any;
  twoLine?: boolean;
  className?: string;
}> {
  static Item = ListItem;
  static Divider = rmwc.ListDivider;
  render() {
    return <rmwc.List {...this.props} />;
  }
}

export class TopAppBar extends React.Component<{
  navigationMenu?: boolean;
  navigationMenuTo?: string;
  fixed?: boolean;
}> {
  static Title = rmwc.TopAppBarTitle;
  static NavigationIcon = rmwc.TopAppBarNavigationIcon;
  static Row = rmwc.TopAppBarRow;
  static Section = rmwc.TopAppBarSection;
  static ActionItem = rmwc.TopAppBarActionItem;
  render() {
    return <rmwc.TopAppBar {...this.props} />;
  }
}

export class Card extends React.Component<{
  className?: string;
  style?: any;
  outlined?: boolean;
}> {
  static PrimaryAction = rmwc.CardPrimaryAction;
  static Media = rmwc.CardMedia;
  render() {
    return <rmwc.Card {...this.props} />;
  }
}

export function ImageField({ value, defaultValue, onChange, ...rest }: any) {
  function _onChange(e: any) {
    return onChange({ currentTarget: { value: e.target.files[0] } });
  }

  value = value instanceof File ? value.name : value;
  defaultValue =
    defaultValue instanceof File ? defaultValue.name : defaultValue;

  return (
    <rmwc.TextField
      className={'mdc-text-field--file ' + rest.className}
      onChange={_onChange}
      type="file"
      {...rest}
    >
      {rest.children}
      <label htmlFor={rest.id}>
        {value || defaultValue || 'Choose file...'}
      </label>
    </rmwc.TextField>
  );
}

export class GridTilePrimary extends React.Component<{
  className?: string;
  src?: string;
  alt?: string;
  style?: any;
}> {
  static Content = rmwc.GridTilePrimaryContent;
  render() {
    return <rmwc.GridTilePrimary {...this.props} />;
  }
}

export class GridTile extends React.Component<{
  className?: string;
  style?: any;
  tag?: any;
  to?: any;
}> {
  static Primary = GridTilePrimary;
  static Secondary = rmwc.GridTileSecondary;
  static Icon = rmwc.GridTileIcon;
  static Title = rmwc.GridTileTitle;
  render() {
    return <rmwc.GridTile {...this.props} />;
  }
}

export class Grid extends React.Component<{
  fixedColumnWidth?: boolean;
  className?: string;
  style?: any;
}> {
  static Row = rmwc.GridRow;
  static Cell = rmwc.GridCell;
  static List = rmwc.GridList;
  static Tile = GridTile;
  render() {
    return <rmwc.Grid {...this.props} />;
  }
}

export class TabBar extends React.Component<{
  className?: string;
  activeTabIndex?: number;
  onActivate?: any;
  indicatorTransition?: 'slide' | 'fade';
}> {
  static Tab = rmwc.Tab;
  render() {
    return <rmwc.TabBar {...this.props} />;
  }
}
export class Smiley extends React.Component<{
  url: string;
  onClick?: Function;
  active?: boolean;
}> {
  render() {
    return (
      <rmwc.Ripple
        unbounded
        onClick={() => {
          if (!this.props.onClick) return;
          this.props.onClick();
        }}
      >
        <div
          style={{
            height: 71,
            width: 71,
            cursor: 'pointer',
            borderRadius: 100,
            backgroundColor: this.props.active
              ? 'var(--mdc-theme-smiley)'
              : 'unset',
          }}
        >
          <Image url={this.props.url} />
        </div>
      </rmwc.Ripple>
    );
  }
}
