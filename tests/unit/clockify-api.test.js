const ClockifyAPI = require('../../src/clockify-api');

const testApiKey = 'test_api_key_12345';
const testUserId = 'test_user_id_67890';
const testWorkspaceId = 'test_workspace_id_abcde';

// Mock the fetch function
global.fetch = jest.fn();

describe('ClockifyAPI', () => {
  let clockifyAPI;

  beforeEach(() => {
    clockifyAPI = new ClockifyAPI(testApiKey);
    jest.clearAllMocks();
  });

  test('successful connection', async () => {
    //const mockResponse = { data: 'test' };
    const mockResponse = [{billable: false, costRate: null}];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const response = await clockifyAPI.getTimeEntries(testWorkspaceId, testUserId);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/workspaces/${testWorkspaceId}/user/${testUserId}/time-entries`),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': testApiKey,
        }),
      })
    );
  });

  test('getWorkspaceId success', async () => {
    const mockWorkspace = { id: testWorkspaceId };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockWorkspace),
    });

    const workspaceId = await clockifyAPI.getWorkspaceId();
    expect(workspaceId).toBe(testWorkspaceId);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/workspaces'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': testApiKey,
        }),
      })
    );
  });

  test('getUserId success', async () => {
    const mockUser = { id: testUserId };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const userId = await clockifyAPI.getUserId();
    expect(userId).toBe(testUserId);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': testApiKey,
        }),
      })
    );
  });

  // ... other test cases
});