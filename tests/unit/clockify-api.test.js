const ClockifyAPI = require('./../../src/clockify-api');

const testApiKey = 'test_api_key_12345';
const testUserId = 'test_user_id_67890';
const testWorkspaceId = 'test_workspace_id_abcde';

const incorrectApiKey = 'incorrect_api_key';

// Mock the fetch function
global.fetch = jest.fn();

describe('ClockifyAPI', () => {
  let clockifyAPI;
  let consoleSpy;

  beforeEach(() => {
    clockifyAPI = new ClockifyAPI(testApiKey);
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  
  test('successful getTimeEntries', async () => {
    /*
    const mockResponse = [{ id: '1', description: 'Test entry' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    */

    const timeEntries = await clockifyAPI.getTimeEntries(testWorkspaceId, testUserId);
    const timeEntry = timeEntries[0];

    // Check for presence of all expected keys
    const expectedKeys = [
      'billable', 'costRate', 'customFieldValues', 'description', 'hourlyRate',
      'id', 'isLocked', 'kioskId', 'projectId', 'tagIds', 'taskId', 'timeInterval',
      'type', 'userId', 'workspaceId'
    ];

    expectedKeys.forEach(key => {
      expect(timeEntry).toHaveProperty(key);
    });

    // Check timeInterval separately as it's a nested object
    expect(timeEntry.timeInterval).toHaveProperty('duration');
    expect(timeEntry.timeInterval).toHaveProperty('end');
    expect(timeEntry.timeInterval).toHaveProperty('start');
   
    // Additional type checks if desired
    expect(typeof timeEntry.billable).toBe('boolean');
    expect(typeof timeEntry.description).toBe('string');
    expect(Array.isArray(timeEntry.customFieldValues)).toBe(true);
    expect(typeof timeEntry.id).toBe('string');
  });

  test('incorrect credentials for getTimeEntries', async () => {
    const incorrectClockifyAPI = new ClockifyAPI(incorrectApiKey);
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    await expect(incorrectClockifyAPI.getTimeEntries(testWorkspaceId, testUserId))
      .rejects.toThrow('HTTP error! status: 401');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching time entries:',
      expect.any(Error)
    );
  });

  test('successful getWorkspaceId', async () => {
    const workspaceId = await clockifyAPI.getWorkspaceId();
    expect(workspaceId[0]).toBe(testWorkspaceId);
  });

  test('incorrect credentials for getWorkspaceId', async () => {
    const incorrectClockifyAPI = new ClockifyAPI(incorrectApiKey);
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    await expect(incorrectClockifyAPI.getWorkspaceId())
      .rejects.toThrow('HTTP error! status: 401');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching workspace ID:',
      expect.any(Error)
    );
  });

  
  test('successful getUserId', async () => {
    const userId = await clockifyAPI.getUserId();
    expect(userId).toBe(testUserId);
  });
  

  test('incorrect credentials for getUserId', async () => {
    const incorrectClockifyAPI = new ClockifyAPI(incorrectApiKey);
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    await expect(incorrectClockifyAPI.getUserId())
      .rejects.toThrow('HTTP error! status: 401');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching user ID:',
      expect.any(Error)
    );
  });
});