import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initEmail, sendLeadMagnet, sendNurtureEmail, sendProductDelivery, isEmailReady } from '../email.js';
import { Resend } from 'resend';

// Create a stable mock for the send function
const sendMock = vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null });

// Mock Resend
vi.mock('resend', () => {
  const MockResend = vi.fn().mockImplementation(function() {
    this.emails = {
      send: sendMock,
    };
  });
  return {
    Resend: MockResend,
  };
});

describe('email.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMock.mockResolvedValue({ data: { id: 'test-id' }, error: null });
  });

  describe('initEmail', () => {
    it('should initialize with a valid API key', () => {
      const result = initEmail('re_valid_key');
      expect(result).toBe(true);
      expect(isEmailReady()).toBe(true);
      expect(Resend).toHaveBeenCalledWith('re_valid_key');
    });

    it('should not initialize with an invalid API key', () => {
      const result = initEmail('invalid_key');
      expect(result).toBe(false);
      expect(isEmailReady()).toBe(false);
    });
  });

  describe('Email Sending Functions', () => {
    beforeEach(() => {
      initEmail('re_test_key');
    });

    it('sendLeadMagnet should send email with correct parameters', async () => {
      const params = {
        firstName: 'John',
        email: 'john@example.com',
        agencyName: 'John Agency'
      };
      const result = await sendLeadMagnet(params);
      
      expect(result.success).toBe(true);
      expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
        to: [params.email],
        subject: expect.stringContaining('Agency Automation Guide'),
        html: expect.stringContaining('Hi John')
      }));
    });

    it('sendNurtureEmail should send Day 2 email with correct parameters', async () => {
      const params = {
        email: 'john@example.com',
        firstName: 'John',
        agencyName: 'John Agency',
        day: 2
      };
      const result = await sendNurtureEmail(params);
      
      expect(result.success).toBe(true);
      expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
        to: [params.email],
        subject: expect.stringContaining('Manual Work Tax'),
      }));
    });

    it('sendNurtureEmail should fail for invalid day', async () => {
      const params = {
        email: 'john@example.com',
        firstName: 'John',
        agencyName: 'John Agency',
        day: 1
      };
      const result = await sendNurtureEmail(params);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid nurture day');
    });

    it('sendProductDelivery should send email with correct parameters', async () => {
      const params = {
        email: 'john@example.com',
        name: 'John',
        productName: 'Template Pack (Lead Gen Essentials)',
        productPrice: 14900
      };
      const result = await sendProductDelivery(params);
      
      expect(result.success).toBe(true);
      expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
        to: [params.email],
        subject: expect.stringContaining('Template Pack (Lead Gen Essentials)'),
      }));
    });

    it('should handle Resend API errors gracefully', async () => {
      sendMock.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'API Error' } 
      });

      const result = await sendLeadMagnet({ 
        firstName: 'John', 
        email: 'john@example.com' 
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('API Error');
    });

    it('should handle exceptions gracefully', async () => {
      sendMock.mockRejectedValueOnce(new Error('Network Error'));

      const result = await sendLeadMagnet({ 
        firstName: 'John', 
        email: 'john@example.com' 
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network Error');
    });
  });
});
