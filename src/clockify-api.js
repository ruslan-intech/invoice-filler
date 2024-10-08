const fetch = require('node-fetch');

class ClockifyAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.clockify.me/api/v1';
  }

  async getWorkspaceId() {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const workspaces = await response.json();
      
      const workspaceIds = workspaces.map(workspace => workspace.id);
      return workspaceIds;
    } catch (error) {
      console.error('Error fetching workspace ID:', error);
      throw error;
    }
  }

  async getUserId() {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      return user.id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;
    }
  }

  async getTimeEntries(workspaceId, userId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/workspaces/${workspaceId}/user/${userId}/time-entries?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  }

  async getProcessedTimeEntries(workspaceId, userId, params = {}) {
    const timeEntries = await this.getTimeEntries(workspaceId, userId, params);
    return this.processTimeEntries(timeEntries);
  }

  processTimeEntries(timeEntries) {
    return timeEntries.map(entry => ({
      id: entry.id,
      description: entry.description,
      projectId: entry.projectId,
      userId: entry.userId,
      //billable: entry.billable,
      task: entry.task,
      startTime: new Date(entry.timeInterval.start),
      endTime: new Date(entry.timeInterval.end),
      durationMinutes: this.calculateDurationMinutes(entry.timeInterval.duration)
    }));
  }

  calculateDurationMinutes(duration) {
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(matches[1] || 0);
    const minutes = parseInt(matches[2] || 0);
    const seconds = parseInt(matches[3] || 0);
    return hours * 60 + minutes + Math.round(seconds / 60);
  }
}

module.exports = ClockifyAPI;