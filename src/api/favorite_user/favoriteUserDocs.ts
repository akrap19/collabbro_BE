const tags = [
  {
    name: 'Favorite User',
    description: 'Favorite users related routes'
  }
]

const paths = {
  '/favoriteProject': {
    put: {
      tags: ['Favorite User'],
      description: 'Create or delete new favorite user',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/toogle_favorite_user_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Succefully updated favorite users for user',
          content: {
            schema: {
              $ref: '#/definitions/200_response'
            }
          }
        }
      }
    },
    get: {
      tags: ['Favorite User'],
      description: 'Get favorite users for user',
      responses: {
        '200': {
          description: 'Succefully fetch favorite users',
          content: {
            schema: {
              $ref: '#/definitions/get_favorite_users_for_user_response'
            }
          }
        }
      }
    }
  }
}

const definitions = {
  '200_response': {
    example: {
      data: null,
      code: 200000,
      message: 'OK'
    }
  },
  '401_response': {
    example: {
      data: null,
      code: 401001,
      message: 'Invalid token'
    }
  },
  toogle_favorite_user_body: {
    example: {
      userId: '94104c89-e04a-41b6-9902-e19c723c1354'
    }
  },
  get_favorite_users_for_user_response: {
    example: {
      data: {
        favoriteUsers: [{}, {}],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const favoriteUserDocs = { tags, paths, definitions }
