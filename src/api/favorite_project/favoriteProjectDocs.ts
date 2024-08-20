const tags = [
  {
    name: 'Favorite Project',
    description: 'Favorite projects related routes'
  }
]

const paths = {
  '/favoriteProject': {
    put: {
      tags: ['Favorite Project'],
      description: 'Create or delete new favorite project',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/toogle_favorite_project_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Succefully updated favorite projects for user',
          content: {
            schema: {
              $ref: '#/definitions/200_response'
            }
          }
        }
      }
    },
    get: {
      tags: ['Favorite Project'],
      description: 'Get favorite projects for user',
      responses: {
        '200': {
          description: 'Succefully fetch favorite projects',
          content: {
            schema: {
              $ref: '#/definitions/get_favorite_projects_for_user_response'
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
  toogle_favorite_project_body: {
    example: {
      projectId: '94104c89-e04a-41b6-9902-e19c723c1354'
    }
  },
  get_favorite_projects_for_user_response: {
    example: {
      data: {
        favoriteProjects: [{}, {}],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const favoriteProjectDocs = { tags, paths, definitions }
