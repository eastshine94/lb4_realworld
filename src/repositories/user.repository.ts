import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { User, UserRelations, Article} from '../models';
import {ArticleRepository} from './article.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.username,
  UserRelations
> {

  public readonly articles: HasManyRepositoryFactory<Article, typeof User.prototype.username>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('ArticleRepository') protected articleRepositoryGetter: Getter<ArticleRepository>,) {
    super(User, dataSource);
    this.articles = this.createHasManyRepositoryFactoryFor('articles', articleRepositoryGetter,);
    this.registerInclusionResolver('articles', this.articles.inclusionResolver);
  }
}
