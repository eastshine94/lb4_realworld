import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany
} from '@loopback/repository';
import { User } from './user.model';
import dayjs from 'dayjs';
import { Tag } from './tag.model';
import { TagList } from './tag-list.model';

@model()
export class Article extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true
  })
  slug: string;

  @property({
    type: 'string',
    required: true
  })
  title: string;

  @property({
    type: 'string',
    required: true
  })
  description: string;

  @property({
    type: 'string',
    required: true
  })
  body: string;

  @property({
    type: 'date',
    required: true,
    default: dayjs()
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
    default: dayjs()
  })
  updatedAt: string;

  @property({
    type: 'number',
    default: 0
  })
  favoriteCount?: number;

  @belongsTo(() => User, { name: 'author' })
  username: string;

  @hasMany(() => Tag, {
    through: { model: () => TagList, keyFrom: 'slug', keyTo: 'tagname' }
  })
  tags: Tag[];

  author?: User;

  tagList?: Array<string>;

  constructor(data?: Partial<Article>) {
    super(data);
  }
}

export interface ArticleRelations {
  // describe navigational properties here
}

export type ArticleWithRelations = Article & ArticleRelations;
