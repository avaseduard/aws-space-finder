import exp = require('constants');
import { handler } from '../../src/services/monitor/handler';

describe('Monitor lambda tests', () => {
  const fetchSpy = jest.spyOn(global, 'fetch');
  fetchSpy.mockImplementation(() => Promise.resolve({} as any));

  afterEach(() => jest.clearAllMocks());

  test('Makes requests for records in SNS events', async () => {
    await handler({ Records: [{ Sns: { Message: 'Test message' } }] } as any, {});
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      body: JSON.stringify({
        text: `Houston, we've got a problem: Test message`,
      }),
    });
  });

  test('No sns records, no requests', async () => {
    await handler({ Records: [] } as any, {});
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
