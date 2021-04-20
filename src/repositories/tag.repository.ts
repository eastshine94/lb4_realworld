import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Tag, TagRelations} from '../models';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.tagname,
  TagRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Tag, dataSource);
  }
}
