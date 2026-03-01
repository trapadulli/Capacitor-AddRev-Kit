jest.mock('../src/providers/revenuecat', () => ({
  initRevenueCat: jest.fn(),
  isSubscribed: jest.fn().mockResolvedValue(true),
  purchase: jest.fn().mockResolvedValue(true),
  restore: jest.fn().mockResolvedValue(true)
}));
jest.mock('../src/providers/admob', () => ({
  disableAds: jest.fn(),
  enableAds: jest.fn()
}));

describe('Monetization Orchestrator', () => {
  it('bootMonetization disables ads for pro', async () => {
    const { bootMonetization } = require('../src/core/monetization');
    const { disableAds } = require('../src/providers/admob');
    await bootMonetization();
    expect(disableAds).toHaveBeenCalled();
  });

  it('handlePurchase disables ads on purchase', async () => {
    const { handlePurchase } = require('../src/core/monetization');
    const { disableAds } = require('../src/providers/admob');
    await handlePurchase();
    expect(disableAds).toHaveBeenCalled();
  });

  it('handleRestore disables ads on restore', async () => {
    const { handleRestore } = require('../src/core/monetization');
    const { disableAds } = require('../src/providers/admob');
    await handleRestore();
    expect(disableAds).toHaveBeenCalled();
  });
});