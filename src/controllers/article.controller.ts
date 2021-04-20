import { repository } from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response
} from '@loopback/rest';
import { Article } from '../models';
import { UserRepository } from '../repositories';
import { ArticleRepository } from '../repositories';

export class ArticleController {
  constructor(
    @repository(ArticleRepository)
    public articleRepository: ArticleRepository,

    @repository(UserRepository)
    protected userRepository: UserRepository
  ) {}

  @post('/api/article')
  @response(200, {
    description: 'Article model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Article) } }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          example: {
            title: 'How to train your dragon',
            description: 'Ever wonder how?',
            body: 'It takes a Jacobian',
            username: 'hdkim'
          }
        }
      }
    })
    article: {
      title: string;
      description: string;
      body: string;
      username: string;
    }
  ): Promise<Article> {
    return this.userRepository
      .articles(article.username)
      .create({
        ...article,
        slug: article.title.toLowerCase().replace(/ /gi, '-')
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  // @get('/article/count')
  // @response(200, {
  //   description: 'Article model count',
  //   content: { 'application/json': { schema: CountSchema } }
  // })
  // async count(@param.where(Article) where?: Where<Article>): Promise<Count> {
  //   return this.articleRepository.count(where);
  // }

  @get('/api/articles')
  @response(200, {
    description: 'Array of Article model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Article, { includeRelations: true })
        }
      }
    }
  })
  async find(): Promise<Partial<Article>[]> {
    // const articles = await this.articleRepository.find({
    //   include: [
    //     { relation: 'author', scope: { fields: ['username', 'bio', 'image'] } },
    //     { relation: 'tags' }
    //   ],
    //   fields: [
    //     'slug',
    //     'title',
    //     'body',
    //     'favoriteCount',
    //     'createdAt',
    //     'updatedAt',
    //     'username'
    //   ]
    // });
    const articles = await this.articleRepository.find({
      include: [{ relation: 'author' }]
    });
    // return articles.map(
    //   article => this.articleRepository.getArticle(article),
    //   [] as Partial<Article>[]
    // );
    return articles;
  }

  @get('/api/article/{slug}')
  @response(200, {
    description: 'Article model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Article, { includeRelations: true })
      }
    }
  })
  async findById(
    @param.path.string('slug') slug: string
  ): Promise<Partial<Article>> {
    const article = await this.articleRepository.findById(slug, {
      include: [
        { relation: 'author', scope: { fields: ['username', 'bio', 'image'] } },
        { relation: 'tags' }
      ],
      fields: [
        'slug',
        'title',
        'body',
        'favoriteCount',
        'createdAt',
        'updatedAt',
        'username'
      ]
    });

    return this.articleRepository.getArticle(article);
  }

  @patch('/api/article/{id}')
  @response(204, {
    description: 'Article PATCH success'
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Article, { partial: true })
        }
      }
    })
    article: Article
  ): Promise<void> {
    await this.articleRepository.updateById(id, article);
  }

  @del('/article/{id}')
  @response(204, {
    description: 'Article DELETE success'
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.articleRepository.deleteById(id);
  }
}
