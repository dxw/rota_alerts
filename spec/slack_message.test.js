const SlackMessage = require('../lib/slack_message')
const {
  WebClient
} = require('@slack/web-api')

jest.mock('@slack/web-api')

describe('SlackMessage', () => {
  beforeAll(() => {
    WebClient.mockImplementation(() => {
      return {
        chat: {
          postMessage: jest.fn(() => {
            return Promise.resolve({})
          })
        },
        users: {
          lookupByEmail: jest.fn(() => {
            return Promise.resolve({
              user: {
                id: '1234'
              }
            })
          })
        }
      }
    })
  })

  test('it sends a slack message', async () => {
    const message = new SlackMessage('foo@example.com', 'Hello there!')

    await message.send()

    expect(message.slackClient.users.lookupByEmail).toHaveBeenCalledWith({
      email: 'foo@example.com'
    })
    expect(message.slackClient.chat.postMessage).toHaveBeenCalledWith({
      channel: '1234',
      text: 'Hello there!'
    })
  })
})
