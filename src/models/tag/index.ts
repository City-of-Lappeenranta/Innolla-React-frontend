import { Model, State } from '@dream/lucid-orm';

import { TagStore } from './store';

interface Category {
  label: string;
  value: string;
}

export class Tag extends Model<Tag> {
  static SKILLS = 'skills';
  static POINT_OF_INTERESTS = 'point_of_interests';
  static DEVELOPMENT_TARGET = 'development_target';
  static OTHER = 'other';

  static CATEGORY_CHOICES: Array<Category> = [
    { label: 'Vahvuudet', value: Tag.SKILLS },
    { label: 'Kiinnostuksen kohteet', value: Tag.POINT_OF_INTERESTS },
    { label: 'Harjoiteltavat asiat', value: Tag.DEVELOPMENT_TARGET },
    { label: 'Muuta huomioitavaa', value: Tag.OTHER },
  ];

  title: string | undefined;
  category: string | undefined;

  constructor(props: Partial<Tag>) {
    super(props);
    Object.assign(this, props);
  }

  static state = new State<Tag>();
  static store = new TagStore();
}
