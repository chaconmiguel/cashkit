/**
 * Crypto utilities for Facebook Conversions API
 * Hashes customer data before sending to Facebook
 */

import crypto from 'crypto';

/**
 * Hash email address using SHA256 (required by Facebook CAPI)
 * @param email - Customer email address
 * @returns SHA256 hash in lowercase hex
 */
export function hashEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  // Facebook requires: lowercase, trimmed, then hashed
  const normalized = email.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Hash phone number using SHA256
 * @param phone - Phone number (should be in E.164 format)
 * @returns SHA256 hash in lowercase hex
 */
export function hashPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove all non-numeric characters
  const normalized = phone.replace(/\D/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalize and hash a general string value
 * @param value - String to hash
 * @returns SHA256 hash in lowercase hex
 */
export function hashValue(value: string): string {
  if (!value || typeof value !== 'string') return '';
  
  const normalized = value.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

