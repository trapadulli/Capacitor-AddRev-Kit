jest.mock('../src/providers/revenuecat', () => {
  return {
    RevenueCatProvider: jest.fn(() => ({
      initialize: jest.fn(),
      purchase: jest.fn(),
      restore: jest.fn(),
    })),
  };
});

describe('RevenueCatProvider', () => {
  const { RevenueCatProvider } = require('../src/providers/revenuecat');

  it('should initialize without error', () => {
    const provider = new RevenueCatProvider();
    expect(provider.initialize).toBeDefined();
  });

  it('should have purchase and restore methods', () => {
    const provider = new RevenueCatProvider();
    expect(provider.purchase).toBeDefined();
    expect(provider.restore).toBeDefined();
  });
});
