const tags = [
  {
    name: 'Profession',
    description: 'Professions related routes'
  }
]

const paths = {
  '/profession/getDefault': {
    get: {
      tags: ['Profession'],
      description: 'Get default professions.',
      responses: {
        '200': {
          description: 'Successfully Fetched default professions',
          content: {
            schema: {
              $ref: '#/definitions/get_default_professions_response'
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
    description: 'Profession not found',
    content: {
      schema: {
        $ref: '#/definitions/profession_not_found_response'
      }
    }
  },
  profession_not_found_response: {
    example: {
      data: null,
      code: 404011,
      message: 'Skill not found'
    }
  },
  get_default_professions_response: {
    example: {
      data: {
        defaultProfessions: [
          {
            id: '123asda',
            profession: 'profession 1',
            defaultProfession: true,
            createdAt: '2024-07-11T12:59:11.419Z',
            updatedAt: '2024-07-11T12:59:11.419Z'
          },
          {
            id: '123asdb',
            profession: 'profession 2',
            defaultProfession: true,
            createdAt: '2024-07-11T12:59:11.419Z',
            updatedAt: '2024-07-11T12:59:11.419Z'
          }
        ],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const professionDocs = { tags, paths, definitions }
