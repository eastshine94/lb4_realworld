import { Entity, model, property } from '@loopback/repository';
import dayjs from 'dayjs';

@model()
export class Comment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

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
    type: 'string',
    required: true
  })
  body: string;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
