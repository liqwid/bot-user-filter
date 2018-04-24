const timeout = 5000

describe('Users pagination', () => {
  let page
  async function scrollToPage(n) {
    await page.evaluate((n) => {
      let container = document.querySelector('ul')
      let itemHeight = document.querySelector('li').offsetHeight
      container.scrollTop = itemHeight * 20 * (n - 1) - container.offsetHeight + 10
    }, n)
  }
  beforeAll(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  }, timeout)

  afterAll(async () => {
    await page.close()
  })

  it('should render next page on scroll', async () => {
    await page.waitFor('li')
    await scrollToPage(2)
    
    await page.waitFor(900)
    const allItems = await page.$$('li')
    expect(allItems).toHaveLength(40)
  })

  it('should not render more than 100 items on scroll', async () => {
    await page.waitFor('li')
    for (let i = 1; i < 6; i++) {
      await scrollToPage(i + 1)
      await page.waitFor(900)
    }
    const allItems = await page.$$('li')
    expect(allItems).toHaveLength(100)
  }, 6000)
}, timeout)
