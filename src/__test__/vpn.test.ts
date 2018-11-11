import { generatePadding, readKeyFromFile } from '../vpnUtils'

describe('VPN utils', () => {
  describe('Generate padding', () => {
    it('should create random string', () => {
      const padding = generatePadding();
      expect(padding.length).toBeLessThanOrEqual(50);
      expect(padding.length).toBeGreaterThanOrEqual(20);
    });
  });
  describe('Read key file', () => {
    it('should read key from file', () => {
      const fname = './src/__test__/myKey.txt';
      try {
        const key = readKeyFromFile(fname);
        expect(key).toBe('thisIsMyCryptoKey');
      } catch(e) {
        expect(e).toBe(null);
      }
    });
  });

});

