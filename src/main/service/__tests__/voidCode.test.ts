import { createVoidCode, getVoidCode } from '../voidCode';

describe('VoidCode', () => {
  it('should create settings file', async () => {
    expect.assertions(1);
    const result = await createVoidCode('1322432454667');
    expect(result.isSuccess).toBe(true);
  });
  it('should get settings file', async () => {
    expect.assertions(2);
    const result = await getVoidCode();
    expect(result.isSuccess).toBe(true);
    expect(result.result).toBe('1322432454667');
  });
});
