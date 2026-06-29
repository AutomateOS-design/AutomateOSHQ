import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processNurtureSequence } from '../nurture.js';
import { runSql } from '../db.js';
import { sendNurtureEmail } from '../email.js';

// Mock DB and Email
vi.mock('../db.js', () => ({
  runSql: vi.fn(),
}));

vi.mock('../email.js', () => ({
  sendNurtureEmail: vi.fn(),
}));

describe('nurture.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to keep test output clean
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should process Day 2 leads correctly', async () => {
    const mockLeads = [
      { id: 1, email: 'lead1@example.com', firstName: 'Lead1', agencyName: 'Agency1', nurtureStage: 1 },
    ];

    // Mock SQL results for each day
    vi.mocked(runSql).mockImplementation((sql) => {
      if (sql.includes('nurtureStage = 1')) return mockLeads;
      return []; // No leads for other days
    });

    vi.mocked(sendNurtureEmail).mockResolvedValue({ success: true });

    await processNurtureSequence();

    expect(runSql).toHaveBeenCalledWith(expect.stringContaining('nurtureStage = 1'));
    expect(sendNurtureEmail).toHaveBeenCalledWith({
      email: 'lead1@example.com',
      firstName: 'Lead1',
      agencyName: 'Agency1',
      day: 2,
    });
    expect(runSql).toHaveBeenCalledWith(expect.stringContaining('UPDATE leads SET nurtureStage = 2 WHERE id = 1'));
  });

  it('should skip leads who have already purchased an Audit', async () => {
    // This logic is actually in the SQL query itself, which we mock.
    // In our mock, if the query includes the Audit exclusion, we return fewer leads.
    
    vi.mocked(runSql).mockReturnValue([]); // No leads returned because they are filtered by SQL

    await processNurtureSequence();

    expect(runSql).toHaveBeenCalledWith(expect.stringContaining("email NOT IN (SELECT email FROM purchases WHERE productId LIKE '%Audit%')"));
    expect(sendNurtureEmail).not.toHaveBeenCalled();
  });

  it('should not update nurtureStage if email sending fails', async () => {
    const mockLeads = [
      { id: 1, email: 'lead1@example.com', firstName: 'Lead1', agencyName: 'Agency1', nurtureStage: 1 },
    ];

    vi.mocked(runSql).mockImplementation((sql) => {
      if (sql.includes('nurtureStage = 1')) return mockLeads;
      return [];
    });

    vi.mocked(sendNurtureEmail).mockResolvedValue({ success: false });

    await processNurtureSequence();

    expect(sendNurtureEmail).toHaveBeenCalled();
    expect(runSql).not.toHaveBeenCalledWith(expect.stringContaining('UPDATE leads SET nurtureStage = 2'));
  });

  it('should process leads for all stages (Day 2 to 5)', async () => {
    vi.mocked(runSql).mockImplementation((sql) => {
      if (sql.includes('nurtureStage = 1')) return [{ id: 1, email: 'l1@ex.com', nurtureStage: 1 }];
      if (sql.includes('nurtureStage = 2')) return [{ id: 2, email: 'l2@ex.com', nurtureStage: 2 }];
      if (sql.includes('nurtureStage = 3')) return [{ id: 3, email: 'l3@ex.com', nurtureStage: 3 }];
      if (sql.includes('nurtureStage = 4')) return [{ id: 4, email: 'l4@ex.com', nurtureStage: 4 }];
      return [];
    });

    vi.mocked(sendNurtureEmail).mockResolvedValue({ success: true });

    await processNurtureSequence();

    expect(sendNurtureEmail).toHaveBeenCalledTimes(4);
    expect(sendNurtureEmail).toHaveBeenCalledWith(expect.objectContaining({ day: 2 }));
    expect(sendNurtureEmail).toHaveBeenCalledWith(expect.objectContaining({ day: 3 }));
    expect(sendNurtureEmail).toHaveBeenCalledWith(expect.objectContaining({ day: 4 }));
    expect(sendNurtureEmail).toHaveBeenCalledWith(expect.objectContaining({ day: 5 }));
  });

  it('should handle database errors gracefully', async () => {
    vi.mocked(runSql).mockImplementation(() => {
      throw new Error('DB Error');
    });

    await processNurtureSequence();

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error processing nurture sequence'), 'DB Error');
  });
});
