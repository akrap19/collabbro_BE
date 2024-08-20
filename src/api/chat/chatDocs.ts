const tags = [
    {
      name: 'Chat',
      description: 'Chats related routes'
    }
  ]

  const paths = {
    '/chat': {
      post: {
        tags: ['Chat'],
        description: 'Create chat',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/create_chat_body'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successfully created chat',
            content: {
              schema: {
                $ref: '#/definitions/200_response'
              }
            }
          }
        }
      },
      get: {
        tags: ['Chat'],
        description: 'Get chats for user',
        responses: {
          '200': {
            description: 'Successfully fetched chats for user',
            content: {
              schema: {
                $ref: '#/definitions/get_chats_for_user_response'
              }
            }
          }
        }
      }
    },
    '/chat/{chatId}': {
      get: {
        tags: ['Chat'],
        description: 'Get chat by chatId',
        parameters: [
          {
            in: 'path',
            name: 'chatId',
            type: 'string',
            required: false,
            description: 'Chat Id'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully fetched chat by id',
            content: {
              schema: {
                $ref: '#/definitions/get_chat_response'
              }
            }
          }
        }
      },
      delete: {
        tags: ['Chat'],
        description: 'Delete Chat',
        parameters: [
          {
            in: 'path',
            name: 'chatId',
            type: 'string',
            required: false,
            description: 'Chat Id'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/delete_chat_body'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successfully deleted article',
            content: {
              schema: {
                $ref: '#/definitions/200_response'
              }
            }
          },
          '403': {
            description: 'Forbidden',
            content: {
              schema: {
                $ref: '#/definitions/forbidden_response'
              }
            }
          },
          '410': {
            description: 'Gone',
            content: {
              schema: {
                $ref: '#/definitions/gone_response'
              }
            }
          }
        }
      }
    },
    '/chat/markAsUnread/{chatId}': {
      get: {
        tags: ['Chat'],
        description: 'Mark chat as unread',
        parameters: [
          {
            in: 'path',
            name: 'chatId',
            type: 'string',
            required: false,
            description: 'Chat Id'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully marked chat as unread',
            content: {
              schema: {
                $ref: '#/definitions/200_response'
              }
            }
          }
        }
      },
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
      description: 'Chat not found',
      content: {
        schema: {
          $ref: '#/definitions/chat_not_found_response'
        }
      }
    },
    create_chat_body: {
      example: {
        chatMembersId: ['c4ecdc20-3dc5-4b6a-a4e6-19c73bf32f3b']
      }
    },
    get_chat_response: {
      example: {
        data: {
          chat: {}},
        code: 200000,
        message: 'OK'
      }
    },
    get_chats_for_user_response: {
      example: {
        data: {
          chats: []},
        code: 200000,
        message: 'OK'
      }
    },
    chat_not_found_response: {
      example: {
        data: null,
        code: 404019,
        message: 'Chat not found'
      }
    },
    delete_chat_body: {
      example: {
        id: 'c4ecdc20-3dc5-4b6a-a4e6-19c73bf32f3b'
      }
    }
  }
  
  export const chatDocs = { tags, paths, definitions }
  