import { Entity, model, property, hasMany} from '@loopback/repository';
import {Article} from './article.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true
  })
  username: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @property({
    type: 'string',
    default: ''
  })
  bio?: string;

  @property({
    type: 'string',
    default: ''
  })
  image?: string;

  @hasMany(() => Article, {keyTo: 'username'})
  articles: Article[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
