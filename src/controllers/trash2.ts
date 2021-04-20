import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import { User, Article } from '../models';
import { UserRepository } from '../repositories';

export class UserArticleController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository
  ) {}

  @get('/users/{id}/articles', {
    responses: {
      '200': {
        description: 'Array of User has many Article',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Article) }
          }
        }
      }
    }
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Article>
  ): Promise<Article[]> {
    return this.userRepository.articles(id).find({ include: ['user'] });
  }

  @post('/users/{id}/articles', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Article) } }
      }
    }
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.username,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, {
            title: 'NewArticleInUser',
            exclude: ['slug'],
            optional: ['username']
          })
        }
      }
    })
    article: Omit<Article, 'slug'>
  ): Promise<Article> {
    return this.userRepository.articles(id).create(article);
  }

  @patch('/users/{id}/articles', {
    responses: {
      '200': {
        description: 'User.Article PATCH success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, { partial: true })
        }
      }
    })
    article: Partial<Article>,
    @param.query.object('where', getWhereSchemaFor(Article))
    where?: Where<Article>
  ): Promise<Count> {
    return this.userRepository.articles(id).patch(article, where);
  }

  @del('/users/{id}/articles', {
    responses: {
      '200': {
        description: 'User.Article DELETE success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Article))
    where?: Where<Article>
  ): Promise<Count> {
    return this.userRepository.articles(id).delete(where);
  }
}
