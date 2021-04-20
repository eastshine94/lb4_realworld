import { repository } from '@loopback/repository';
import { param, get, getModelSchemaRef } from '@loopback/rest';
import { Article, User } from '../models';
import { ArticleRepository } from '../repositories';

export class ArticleUserController {
  constructor(
    @repository(ArticleRepository)
    public articleRepository: ArticleRepository
  ) {}

  @get('/articles/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Article',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) }
          }
        }
      }
    }
  })
  async getUser(
    @param.path.string('id') id: typeof Article.prototype.slug
  ): Promise<User> {
    return this.articleRepository.author(id);
  }
}
