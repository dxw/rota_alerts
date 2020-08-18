const UpcomingRotation = require('../lib/upcoming_rotation')
const MockDate = require('mockdate')
const axios = require('axios')

jest.mock('axios')

describe('UpcomingRotations', () => {
  beforeEach(() => {
    // Mock the HTTP reponse from the API
    const data = {
      data: [{
        start_date: '2020-01-01',
        end_date: '2020-01-08',
        first_line: {
          name: 'Alice',
          email: 'alice@example.com'
        },
        second_line: {
          name: 'Bob',
          email: 'bob@example.com'
        }
      },
      {
        start_date: '2020-01-09',
        end_date: '2020-01-16',
        first_line: {
          name: 'Eve',
          email: 'eve@example.com'
        },
        second_line: {
          name: 'Trent',
          email: 'trent@example.com'
        }
      }
      ]
    }

    axios.get.mockImplementationOnce(() => Promise.resolve(data))
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('returns a rotation when one is available', async () => {
    MockDate.set('2020-01-02')

    const upcomingRotation = new UpcomingRotation()

    expect(await upcomingRotation.find()).toEqual({
      start_date: '2020-01-09',
      end_date: '2020-01-16',
      first_line: {
        name: 'Eve',
        email: 'eve@example.com'
      },
      second_line: {
        name: 'Trent',
        email: 'trent@example.com'
      }
    })
  })

  test('returns nothing when there is no rotation', async () => {
    MockDate.set('2020-01-03')

    const upcomingRotation = new UpcomingRotation()

    expect(await upcomingRotation.find()).toEqual(undefined)
  })
})
