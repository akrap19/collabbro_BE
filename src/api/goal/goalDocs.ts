const tags = [
  {
    name: 'Goal',
    description: 'Goals related routes'
  }
]

const paths = {
  '/goal/getDefault': {
    get: {
      tags: ['Goal'],
      description: 'Get default goals.',
      responses: {
        '200': {
          description: 'Successfully Fetched default goals',
          content: {
            schema: {
              $ref: '#/definitions/get_default_goals_response'
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
    description: 'Goal not found',
    content: {
      schema: {
        $ref: '#/definitions/goal_not_found_response'
      }
    }
  },
  goal_not_found_response: {
    example: {
      data: null,
      code: 404013,
      message: 'Goal not found'
    }
  },
  get_default_goals_response: {
    example: {
      data: {
        defaultGoals: [
          {
            id: '123asda',
            goalContent: 'goal_content 1',
            defaultGoal: true,
            createdAt: '2024-07-11T12:59:11.432Z',
            updatedAt: '2024-07-11T12:59:11.432Z'
          },
          {
            id: '123asdb',
            goalContent: 'goal_content 2',
            defaultGoal: true,
            createdAt: '2024-07-11T12:59:11.432Z',
            updatedAt: '2024-07-11T12:59:11.432Z'
          }
        ],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const goalDocs = { tags, paths, definitions }
