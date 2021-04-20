import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TagList, TagListRelations} from '../models';

export class TagListRepository extends DefaultCrudRepository<
  TagList,
  typeof TagList.prototype.id,
  TagListRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TagList, dataSource);
  }
}
