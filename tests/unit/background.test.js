const ClockifyAPI = require('./background');

// Mock the fetch function
global.fetch = jest.fn();

describe('ClockifyAPI', () => {
  let background;

  beforeEach(() => {
    background = new ClockifyAPI('test_api_key');
    jest.clearAllMocks();
  });

  test('successful connection', async () => {
    const mockResponse = { data: 'test' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const response = await background.getTimeEntries();
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/time-entries'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': 'test_api_key',
        }),
      })
    );
  });

  test('authentication error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(background.getTimeEntries()).rejects.toThrow('Authentication failed');
  });

  test('network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(background.getTimeEntries()).rejects.toThrow('Network error');
  });

  test('data processing', async () => {
    const mockData = [
      { id: '1', description: 'Task 1', timeInterval: { duration: 'PT1H30M' } },
      { id: '2', description: 'Task 2', timeInterval: { duration: 'PT45M' } },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const processedData = await background.getProcessedTimeEntries();
    expect(processedData).toHaveLength(2);
    expect(processedData[0].durationMinutes).toBe(90);
    expect(processedData[1].durationMinutes).toBe(45);
  });

  test('handling empty response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    });

    const processedData = await background.getProcessedTimeEntries();
    expect(processedData).toHaveLength(0);
  });

  test('error logging', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    fetch.mockRejectedValueOnce(new Error('API Error'));

    await expect(background.getTimeEntries()).rejects.toThrow('API Error');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('API Error'));

    consoleSpy.mockRestore();
  });
});
