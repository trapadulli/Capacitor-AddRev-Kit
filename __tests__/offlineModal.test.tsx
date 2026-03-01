import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineModal } from '../src/network/offline';

jest.mock('@capacitor/network', () => ({
  Network: {
    getStatus: jest.fn(),
    addListener: jest.fn()
  }
}));

describe('OfflineModal', () => {
  it('renders nothing when online', async () => {
    const { Network } = require('@capacitor/network');
    Network.getStatus.mockResolvedValue({ connected: true });
    Network.addListener.mockImplementation((_, cb) => Promise.resolve({ remove: () => {} }));
    render(<OfflineModal />);
    expect(screen.queryByText(/You need to be online/)).toBeNull();
  });

  it('renders offline message', async () => {
    const { Network } = require('@capacitor/network');
    Network.getStatus.mockResolvedValue({ connected: false });
    Network.addListener.mockImplementation((_, cb) => Promise.resolve({ remove: () => {} }));
    render(<OfflineModal />);
    expect(await screen.findByText(/You need to be online/)).toBeInTheDocument();
  });
});
