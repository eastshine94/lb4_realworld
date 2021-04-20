import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
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
import { User } from '../models';
import { UserRepository } from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {}

  // Authentication
  @post('/api/users/login')
  @response(200, {
    description: 'Login',
    content: { 'application/json': { schema: getModelSchemaRef(User) } }
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          example: {
            user: {
              email: 'jake@jake.jake',
              password: 'jakejake'
            }
          }
        }
      }
    })
    req: {
      user: User;
    }
  ): Promise<User> {
    return this.userRepository.create(req.user).catch(err => {
      return err;
    });
  }

  //Registration
  @post('/api/users')
  @response(200, {
    description: 'Registration',
    content: { 'application/json': { schema: getModelSchemaRef(User) } }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          example: {
            user: {
              username: 'Jacob',
              email: 'jake@jake.jake',
              password: 'jakejake'
            }
          }
        }
      }
    })
    req: {
      user: User;
    }
  ): Promise<User> {
    return this.userRepository.findById(req.user.username).catch(err => {
      return err;
    });
  }

  @get('/api/user')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true })
        }
      }
    }
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    //?filter[where][id][gt]=5  => { where: { id: { gt: '5' } } }
    return this.userRepository.find(filter);
  }

  @get('/api/user/{username}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true })
      }
    }
  })
  async findById(
    @param.path.string('username') username: string,
    @param.filter(User, { exclude: 'where' })
    filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(username, filter);
  }

  @patch('/api/user/{username}')
  @response(204, {
    description: 'User PATCH success'
  })
  async updateById(
    @param.path.string('username') username: string,
    @requestBody({
      content: {
        'application/json': {
          example: {
            bio: 'bio',
            image: 'image'
          }
        }
      }
    })
    user: object
  ): Promise<void> {
    await this.userRepository.updateById(username, user);
  }

  // @put('/user/{id}')
  // @response(204, {
  //   description: 'User PUT success'
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() user: User
  // ): Promise<void> {
  //   console.log(user);
  //   await this.userRepository.replaceById(id, user);
  // }

  @del('/api/user/{username}')
  @response(204, {
    description: 'User DELETE success'
  })
  async deleteById(
    @param.path.string('username') username: string
  ): Promise<void> {
    await this.userRepository.deleteById(username);
  }
}
