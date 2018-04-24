const timeout = 5000

describe('Users page render', () => {
  let page
  beforeAll(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  }, timeout)

  afterAll(async () => {
    await page.close()
  })

  it('should render searh input', async () => {
    let input = await page.$('input')

    expect(input).toBeTruthy()
  })

  it('should render loader', async () => {
    let loader = await page.$('[role="progressbar"]')

    expect(loader).toBeTruthy()
  })

  it('should render items list', async () => {
    await page.waitFor('li')
    let items = await page.$$('li')

    expect(items).toHaveLength(20)
  }, 6000)
}, timeout)
