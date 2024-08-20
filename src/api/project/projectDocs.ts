const tags = [
  {
    name: 'Project',
    description: 'Projects related routes'
  }
]

const paths = {
  '/project': {
    post: {
      tags: ['Project'],
      description: 'Create new project',
      requestBody: {
        description: 'File size should be in bytes',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/create_project_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Succefully created project',
          content: {
            schema: {
              $ref: '#/definitions/create_project_response'
            }
          }
        }
      }
    },
    get: {
      tags: ['Project'],
      description: 'Get list of projects',
      responses: {
        '200': {
          description: 'Succefully fetch projects',
          content: {
            schema: {
              $ref: '#/definitions/get_projects_response'
            }
          }
        }
      }
    }
  },
  '/project/{id}': {
    post: {
      tags: ['Project'],
      description: 'Create new project',
      parameters: [
        {
          in: 'path',
          name: 'id',
          type: 'string',
          required: false,
          description: 'Project ID'
        }
      ],
      responses: {
        '200': {
          description: 'Succefully created project',
          content: {
            schema: {
              $ref: '#/definitions/get_project_response'
            }
          }
        },
        '404': {
          description: 'Project not found',
          content: {
            schema: {
              $ref: '#/definitions/project_not_found_response'
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
  '404': {
    description: 'Project not found',
    content: {
      schema: {
        $ref: '#/definitions/project_not_found_response'
      }
    }
  },
  project_not_found_response: {
    example: {
      data: null,
      code: 404015,
      message: 'Project not found'
    }
  },
  create_project_response: {
    example: {
      data: {},
      code: 200000,
      message: 'OK'
    }
  },
  create_project_body: {
    example: {
      name: 'Project Song',
      projectType: 'Collaboration',
      description: 'Need guitar and drumms on rock song',
      paid: true,
      totalAmount: 100,
      currencyCode: '$',
      deadline: '2024-03-06',
      tags: 'Rock, Guitar, Drums',
      views: 5,
      instrumentIds: [
        'dfd01fe1-c113-4c8b-919b-e23f74e21299',
        'a3cdcce4-bb9e-419f-b0d6-d8a1176cb155'
      ],
      skillIds: [
        '25b1a554-b603-42dd-ab70-a14d38e4a7ea',
        '686858f9-ecb3-4a35-bda3-5bfa86ca071f'
      ],
      mediaFiles: [
        {
          mediaType: 'Project cover image',
          mediaFileName: 'cover.jpg',
          fileSize: 0.3
        },
        {
          mediaType: 'Project track preview',
          mediaFileName: 'preview.mp3',
          fileSize: 25.6
        },
        {
          mediaType: 'Project other',
          mediaFileName: 'extra-file.mp3',
          fileSize: 14.6
        }
      ]
    }
  },
  get_project_response: {
    example: {
      data: {
        project: {},
        code: 200000,
        message: 'OK'
      }
    }
  },
  get_projects_response: {
    example: {
      data: {
        projects: [{}, {}]
      },
      code: 200000,
      message: 'OK'
    }
  }
}

export const projectDocs = { tags, paths, definitions }
