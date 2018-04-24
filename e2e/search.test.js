const timeout = 5000

describe('Users search', () => {
  let page
  beforeAll(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  }, timeout)

  afterAll(async () => {
    await page.close()
  })

  it('should fill in search on keyboard', async () => {
    const input = await page.$('input')
    await page.keyboard.press('a');
    await page.keyboard.press('b');
    await page.keyboard.press('c');

    const inputValue = await page.evaluate((el) => el.value, input)

    expect(inputValue).toEqual('abc')
  }, 6000)

  it('should perform a search on items', async () => {
    const testInput = 'ad'
    await page.type('input', testInput);

    await page.waitFor(900)
    const allItems = await page.$$('li h3')
    const itemTexts = await page.evaluate((items) => items.map(() => item.textContent), allItems)
    expect(itemTexts.filter((text) => text.indexOf(testInput) > -1)).toHaveLength(itemTexts.length)
  }, 6000)
}, timeout)
