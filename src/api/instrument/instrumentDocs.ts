const tags = [
  {
    name: 'Instrument',
    description: 'Instruments related routes'
  }
]

const paths = {
  '/instrument/getDefault': {
    get: {
      tags: ['Instrument'],
      description: 'Get default instruments.',
      responses: {
        '200': {
          description: 'Successfully Fetched default instruments',
          content: {
            schema: {
              $ref: '#/definitions/get_default_instruments_response'
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
    description: 'Instrument not found',
    content: {
      schema: {
        $ref: '#/definitions/instrument_not_found_response'
      }
    }
  },
  instrument_not_found_response: {
    example: {
      data: null,
      code: 404012,
      message: 'Instrument not found'
    }
  },
  get_default_instruments_response: {
    example: {
      data: {
        defaultInstruments: [
          {
            id: '123asda',
            instrument: 'instrum 1',
            defaultInstrument: true,
            createdAt: '2024-07-11T12:56:51.551Z',
            updatedAt: '2024-07-11T12:56:51.551Z'
          },
          {
            id: '123asdb',
            instrument: 'instrum 2',
            defaultInstrument: true,
            createdAt: '2024-07-11T12:56:51.551Z',
            updatedAt: '2024-07-11T12:56:51.551Z'
          }
        ],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const instrumentDocs = { tags, paths, definitions }
