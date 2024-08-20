const tags = [
  {
    name: 'Collaboration',
    description: 'Collaborations related routes'
  }
]

const paths = {
  '/collaboration': {
    post: {
      tags: ['Collaboration'],
      description: 'Create collaboration',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/create_collaboration_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Successfully created collaboration',
          content: {
            schema: {
              $ref: '#/definitions/200_response'
            }
          }
        }
      }
    }
  },
  '/collaboration/{collaborationId}': {
    put: {
      tags: ['Collaboration'],
      description: 'Send response on collaboration request',
      parameters: [
        {
          in: 'path',
          name: 'collaborationId',
          type: 'string',
          required: false,
          description: 'Collaboration Id'
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/send_response_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Succesfully responsed on collaboration request',
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
  '401_response': {
    example: {
      data: null,
      code: 401001,
      message: 'Invalid token'
    }
  },
  '404': {
    description: 'Collaboration not found',
    content: {
      schema: {
        $ref: '#/definitions/collaboration_not_found_response'
      }
    }
  },
  send_response_body: {
    example: {
      collaborationStatus: true
    }
  },
  create_collaboration_body: {
    example: {
      projectId: 'c4ecdc20-3dc5-4b6a-a4e6-19c73bf32f3b',
      amount: 55.0
    }
  },
  collaboration_not_found_response: {
    example: {
      data: null,
      code: 404017,
      message: 'Collaboration not found'
    }
  }
}

export const collaborationDocs = { tags, paths, definitions }
