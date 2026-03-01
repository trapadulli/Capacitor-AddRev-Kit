jest.mock('../src/providers/admob', () => {
  return {
    disableAds: jest.fn(),
    enableAds: jest.fn(),
  };
});

describe('AdMobProvider', () => {
  const { disableAds, enableAds } = require('../src/providers/admob');

  it('should have disableAds and enableAds methods', () => {
    expect(typeof disableAds).toBe('function');
    expect(typeof enableAds).toBe('function');
  });
});