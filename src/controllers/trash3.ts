import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Article,
TagList,
Tag,
} from '../models';
import {ArticleRepository} from '../repositories';

export class ArticleTagController {
  constructor(
    @repository(ArticleRepository) protected articleRepository: ArticleRepository,
  ) { }

  @get('/articles/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of Article has many Tag through TagList',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.articleRepository.tags(id).find(filter);
  }

  @post('/articles/{id}/tags', {
    responses: {
      '200': {
        description: 'create a Tag model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tag)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Article.prototype.slug,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {
            title: 'NewTagInArticle',
            exclude: ['tagname'],
          }),
        },
      },
    }) tag: Omit<Tag, 'tagname'>,
  ): Promise<Tag> {
    return this.articleRepository.tags(id).create(tag);
  }

  @patch('/articles/{id}/tags', {
    responses: {
      '200': {
        description: 'Article.Tag PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {partial: true}),
        },
      },
    })
    tag: Partial<Tag>,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.articleRepository.tags(id).patch(tag, where);
  }

  @del('/articles/{id}/tags', {
    responses: {
      '200': {
        description: 'Article.Tag DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.articleRepository.tags(id).delete(where);
  }
}
