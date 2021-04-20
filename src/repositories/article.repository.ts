import { inject, Getter } from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyThroughRepositoryFactory
} from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Article, ArticleRelations, User, Tag, TagList } from '../models';
import { UserRepository } from './user.repository';
import { TagListRepository } from './tag-list.repository';
import { TagRepository } from './tag.repository';
import dayjs from 'dayjs';

export class ArticleRepository extends DefaultCrudRepository<
  Article,
  typeof Article.prototype.slug,
  ArticleRelations
> {
  public readonly author: BelongsToAccessor<
    User,
    typeof Article.prototype.slug
  >;

  public readonly tags: HasManyThroughRepositoryFactory<
    Tag,
    typeof Tag.prototype.tagname,
    TagList,
    typeof Article.prototype.slug
  >;

  // article api를 return 해줌
  public readonly getArticle = (article: Article) => {
    const tagList: Array<string> =
      article.tags?.reduce(
        (acc, curr) => [...acc, curr.tagname],
        [] as Array<string>
      ) || [];
    return { ...article, username: undefined, tags: undefined, tagList };
  };

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('TagListRepository')
    protected tagListRepositoryGetter: Getter<TagListRepository>,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>
  ) {
    super(Article, dataSource);
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = dayjs();
    });
    this.tags = this.createHasManyThroughRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
      tagListRepositoryGetter
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
    this.author = this.createBelongsToAccessorFor(
      'author',
      userRepositoryGetter
    );
    this.registerInclusionResolver('author', this.author.inclusionResolver);
  }
}
