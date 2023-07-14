import { getPlatform } from './getPlatform';

describe('getPlatform', () => {
  it('should get platform information correctly', () => {
    const mockNodeVersion = '14.17.0';
    const mockCpuArch = 'x64';
    const mockPlatform = 'linux';

    process = {
      ...process,
      versions: {
        node: mockNodeVersion,
        http_parser: '',
        v8: '',
        ares: '',
        uv: '',
        zlib: '',
        modules: '',
        openssl: ''
      },
      arch: mockCpuArch,
      platform: mockPlatform,
    };

    const result = getPlatform();

    expect(result).toEqual({
      cpuArch: mockCpuArch,
      node: mockNodeVersion,
      platform: mockPlatform,
    });

    jest.restoreAllMocks();
  });
});
