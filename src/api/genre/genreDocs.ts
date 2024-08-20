const tags = [
  {
    name: 'Genre',
    description: 'Genres related routes'
  }
]

const paths = {
  '/genre/getDefault': {
    get: {
      tags: ['Genre'],
      description: 'Get default genres.',
      responses: {
        '200': {
          description: 'Successfully Fetched default genres',
          content: {
            schema: {
              $ref: '#/definitions/get_default_genres_response'
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
    description: 'Genre not found',
    content: {
      schema: {
        $ref: '#/definitions/genre_not_found_response'
      }
    }
  },
  genre_not_found_response: {
    example: {
      data: null,
      code: 404014,
      message: 'Genre not found'
    }
  },
  get_default_genres_response: {
    example: {
      data: {
        defaultGenres: [
          {
            id: '123asd',
            genre: 'genre 1',
            defaultGenre: true,
            createdAt: '2024-07-11T12:49:27.669Z',
            updatedAt: '2024-07-11T12:49:27.669Z'
          },
          {
            id: '123asda',
            genre: 'genre 2',
            defaultGenre: true,
            createdAt: '2024-07-11T12:50:24.041Z',
            updatedAt: '2024-07-11T12:50:24.041Z'
          },
          {
            id: '123asdb',
            genre: 'genre 3',
            defaultGenre: true,
            createdAt: '2024-07-11T12:50:24.041Z',
            updatedAt: '2024-07-11T12:50:24.041Z'
          }
        ],
        code: 200000,
        message: 'OK'
      }
    }
  }
}

export const genreDocs = { tags, paths, definitions }
