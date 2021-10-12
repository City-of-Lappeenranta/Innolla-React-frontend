import React, { useState } from 'react';
import { For, If } from 'react-extras';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Avatar, TextField } from 'rmwc';

import { List } from 'utils/rmwc';

interface Item {
  label: string;
  value: string;
}

interface Props {
  label: string;
  items: Array<Item>;
  onChange: Function;
  onCreate?: Function;
}

export function FilterSelectField(props: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function includesId(value: string): boolean {
    return value === selectedId;
  }

  function toggleSelection(value: string) {
    return setSelectedId(value);
  }

  useDeepCompareEffect(() => {
    props.onChange(selectedId);
  }, [{ selectedId }]);

  let filtered: Array<Item> = [];
  if (search) {
    filtered = props.items.filter((o) => {
      return o.label?.toLowerCase().includes(search.toLowerCase());
    });
  }

  const showCreate = !!search && props.onCreate !== undefined;

  return (
    <>
      <TextField
        fullwidth
        outlined
        label={props.label}
        style={{ top: 0 }}
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.currentTarget.value)
        }
      />
      <List>
        <For
          of={filtered}
          render={(item: Item, index: number) => (
            <List.Item
              key={index}
              onClick={() => toggleSelection(item.value)}
              selected={includesId(item.value)}
            >
              <List.Item.Graphic tag={Avatar} name={item.label} />
              <List.Item.Text>{item.label}</List.Item.Text>
              <If condition={includesId(item.value)}>
                <List.Item.Meta icon="check" />
              </If>
            </List.Item>
          )}
        />
        <If condition={showCreate}>
          <List.Item
            onClick={() => {
              if (props.onCreate === undefined) return;
              props.onCreate(search);
            }}
          >
            <List.Item.Text>{`Lisää uusi ${search}`}</List.Item.Text>
          </List.Item>
        </If>
      </List>
    </>
  );
}
