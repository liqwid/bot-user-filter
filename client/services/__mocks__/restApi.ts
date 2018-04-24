import { of } from 'rxjs'

export default {
  get: jest.fn(() => of({ response: [] })),
  put: jest.fn(() => of({ response: null })),
  post: jest.fn(() => of({ response: null })),
  delete: jest.fn(() => of({ response: null })),
}
