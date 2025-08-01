/**
 * Mock do axios para testes
 */

// Dados mock para testes
const mockProducts = [
  {
    id: 1,
    name: 'RD Station Marketing',
    preferences: ['marketing', 'automation'],
    features: ['email-marketing', 'landing-pages'],
  },
  {
    id: 2,
    name: 'RD Station CRM',
    preferences: ['sales', 'crm'],
    features: ['lead-management', 'pipeline'],
  },
];

const axiosMock = {
  get: jest.fn((url) => {
    if (url.includes('/products')) {
      return Promise.resolve({
        data: mockProducts,
        status: 200,
        statusText: 'OK',
      });
    }
    return Promise.resolve({
      data: [],
      status: 200,
      statusText: 'OK',
    });
  }),
  post: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
    })
  ),
  put: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
    })
  ),
  delete: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
    })
  ),
  create: jest.fn(() => ({
    get: jest.fn(() =>
      Promise.resolve({
        data: mockProducts,
        status: 200,
        statusText: 'OK',
      })
    ),
    post: jest.fn(() =>
      Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
      })
    ),
    put: jest.fn(() =>
      Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
      })
    ),
    delete: jest.fn(() =>
      Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
      })
    ),
  })),
};

export default axiosMock;
