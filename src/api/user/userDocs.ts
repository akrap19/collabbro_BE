const tags = [
  {
    name: 'User',
    description: 'Users related routes'
  }
]

const paths = {
  '/user': {
    get: {
      tags: ['User'],
      description: 'Get User object',
      responses: {
        '200': {
          description: 'Successfully Fetched User',
          content: {
            schema: {
              $ref: '#/definitions/get_user_response'
            }
          }
        }
      }
    }
  },
  '/user/{id}': {
    get: {
      tags: ['User'],
      description: 'Get User object',
      parameters: [
        {
          in: 'path',
          name: 'id',
          type: 'string',
          required: false,
          description: 'User ID'
        }
      ],
      responses: {
        '200': {
          description: 'Successfully Fetched user profile',
          content: {
            schema: {
              $ref: '#/definitions/get_user_response'
            }
          }
        }
      }
    }
  },
  '/user/finshOnboarding': {
    put: {
      tags: ['User'],
      description: 'Finish onboardnig flow for user',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/finish_onboarding_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Succefully finished onboarding flow',
          parameters: [
            {
              in: 'path',
              name: 'id',
              type: 'string',
              required: false,
              description: 'User ID'
            }
          ],
          content: {
            schema: {
              $ref: '#/definitions/200_response'
            }
          }
        }
      }
    }
  },
  '/user/toogleNotifications': {
    get: {
      tags: ['User'],
      description: 'Tooggle notification permission',

      responses: {
        '200': {
          description: 'Succefully finished onboarding flow',
          content: {
            schema: {
              $ref: '#/definitions/200_response'
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
  '404': {
    description: 'User not found',
    content: {
      schema: {
        $ref: '#/definitions/user_not_found_response'
      }
    }
  },
  '401_response': {
    example: {
      data: null,
      code: 401001,
      message: 'Invalid token'
    }
  },
  user_not_found_response: {
    example: {
      data: null,
      code: 404001,
      message: 'User not found'
    }
  },
  get_user_response: {
    example: {
      data: {
        user: {
          id: 'addd72d7-64d3-48fb-8d82-3000769515f1',
          email: 'john.doe@email.com',
          password:
            '$2b$12$HsMT65Gi3HztRedm31pqmOGxX2OcI97YNW748CJe1EtOGQJEDNpsC',
          authType: 'Password',
          onboardingFlow: false,
          notifications: false,
          profileHandle: 'profileHandle',
          country: 'USA',
          language: 'English',
          daw: null,
          profilePictureFileName: null,
          storageUsage: 0,
          createdAt: '2024-07-11T11:59:06.078Z',
          updatedAt: '2024-07-11T11:59:06.078Z'
        }
      },
      code: 200000,
      message: 'OK'
    }
  },
  finish_onboarding_body: {
    example: {
      profileHandle: 'profileHandle',
      country: 'USA',
      language: 'English',
      skills: ['Producing', 'Keyboard'],
      professions: ['Drummer', 'Bass player'],
      instruments: ['Guitar', 'Banjo'],
      daws: ['FL Studio', 'Garageband'],
      genres: ['Blues', 'Electro'],
      goals: ['Collaborate on Projects', 'Monetising skills']
    }
  }
}

export const userDocs = { tags, paths, definitions }
