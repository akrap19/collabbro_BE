const tags = [
  {
    name: 'Payment',
    description: 'Transcations related routes'
  }
]

const paths = {
  '/payment/webhook': {
    post: {
      tags: ['Payment'],
      description:
        'PayPal webhook logic. Note: It should not alloy otu to call from the app. Only PayPal should activate it. Header data is provided by PayPal itself.',
      parameters: [
        {
          in: 'header',
          name: 'paypal-auth-algo',
          type: 'string',
          required: true,
          description: 'Barnahus ID'
        },
        {
          in: 'header',
          name: 'paypal-cert-url',
          type: 'string',
          required: true,
          description: 'Barnahus ID'
        },
        {
          in: 'header',
          name: 'paypal-transmission-id',
          type: 'string',
          required: true,
          description: 'Barnahus ID'
        },
        {
          in: 'header',
          name: 'paypal-transmission-sig',
          type: 'string',
          required: true,
          description: 'Barnahus ID'
        },
        {
          in: 'header',
          name: 'paypal-transmission-time',
          type: 'string',
          required: true,
          description: 'Barnahus ID'
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/paypal_webhook_body'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Webhook successfully proccesed.',
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
        }
      }
    }
  }
}

const definitions = {
  edit_case_body: {
    example: {
      event_type: 'PAYMENT.AUTHORIZATION.VOID',
      resource: {
        id: 'asdsadsadas'
      }
    }
  },
  '200_response': {
    example: {
      data: null,
      code: 200000,
      message: 'OK'
    }
  },
  forbidden_response: {
    example: {
      data: null,
      code: 403000,
      message: 'Forbidden'
    }
  }
}

export const paymentDocs = { tags, paths, definitions }
