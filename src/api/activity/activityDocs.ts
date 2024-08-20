const tags = [
  {
    name: 'Activity',
    description: 'Activities related routes'
  }
]

const paths = {
  '/activity': {
    get: {
      tags: ['Activity'],
      description: 'Get list of activities',
      responses: {
        '200': {
          description: 'Succefully fetch activities',
          content: {
            schema: {
              $ref: '#/definitions/get_activities_response'
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
  get_activities_response: {
    example: {
      data: {
        activities: [{}, {}]
      },
      code: 200000,
      message: 'OK'
    }
  }
}

export const activityDocs = { tags, paths, definitions }
