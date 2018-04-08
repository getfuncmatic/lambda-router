var path = require('../lib/path')

//expect(houseForSale).toMatchObject(desiredHouse);
describe('Parse a path', () => {
  it ('parse Express style paths', async () => {
    var re = path.pathToRegexp('/hello/:userid')
    expect(re.exec('/hello/123')).toBeTruthy()
    expect(re.exec('/hello')).toBeFalsy()
    expect(re.exec('/world/123')).toBeFalsy()
  })
}) 



