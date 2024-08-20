const tags = [
  {
    name: 'Skill',
    description: 'Skills related routes'
  }
]

const paths = {
  '/skill/getDefault': {
    get: {
      tags: ['Skill'],
      description: 'Get default skills.',
      responses: {
        '200': {
          description: 'Successfully Fetched default skills',
          content: {
            schema: {
              $ref: '#/definitions/get_default_skills_response'
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
    description: 'Skill not found',
    content: {
      schema: {
        $ref: '#/definitions/skill_not_found_response'
      }
    }
  },
  skill_not_found_response: {
    example: {
      data: null,
      code: 404010,
      message: 'Skill not found'
    }
  },
  get_default_skills_response: {
    example: {
      data: {
        defaultSkills: [
          {
            id: '123asda',
            skill: 'skill 1',
            defaultSkill: true,
            createdAt: '2024-07-11T12:59:11.411Z',
            updatedAt: '2024-07-11T12:59:11.411Z'
          },
          {
            id: '123asdb',
            skill: 'skill 2',
            defaultSkill: true,
            createdAt: '2024-07-11T12:59:11.411Z',
            updatedAt: '2024-07-11T12:59:11.411Z'
          }
        ],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const skillDocs = { tags, paths, definitions }
