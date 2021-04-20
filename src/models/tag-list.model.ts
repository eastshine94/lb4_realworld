import {Entity, model, property} from '@loopback/repository';

@model()
export class TagList extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  slug?: string;

  @property({
    type: 'string',
  })
  tagname?: string;

  constructor(data?: Partial<TagList>) {
    super(data);
  }
}

export interface TagListRelations {
  // describe navigational properties here
}

export type TagListWithRelations = TagList & TagListRelations;
