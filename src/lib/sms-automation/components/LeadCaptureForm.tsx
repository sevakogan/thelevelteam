'use client';

import React, { useState } from 'react';
import { leadFormSchema, LeadFormData } from '../lib/validation';
import { z } from 'zod';

interface LeadCaptureFormProps {
  onSubmit?: (data: LeadFormData) => Promise<void>;
  onSuccess?: () => void;
  companyName?: string;
  primaryColor?: string;
}

export function LeadCaptureForm({
  onSubmit,
  onSuccess,
  companyName = 'Our Company',
  primaryColor = '#3b82f6',
}: LeadCaptureFormProps): React.ReactNode {
  const [formData, setFormData] = useState<Partial<LeadFormData>>({
    smsConsent: true,
    emailConsent: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');
    setErrors({});

    try {
      // Validate form data
      const validated = leadFormSchema.parse(formData);

      // Call onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(validated);
      } else {
        // Default: submit to /api/leads
        const response = await fetch('/api/sms-automation/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validated),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit form: ${response.statusText}`);
        }
      }

      setSubmitStatus('success');
      setFormData({ smsConsent: true, emailConsent: true });

      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        setSubmitError(message);
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1f2937',
        }}
      >
        Get Started
      </h2>
      <p
        style={{
          color: '#6b7280',
          marginBottom: '24px',
          fontSize: '14px',
        }}
      >
        Tell us about your project and we'll be in touch shortly.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
            }}
          >
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {errors.name && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
            }}
          >
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {errors.email && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
            }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            style={{
              width: '100%',
              padding: '12px',
              border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {errors.phone && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Project Interest Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
            }}
          >
            What are you interested in?
          </label>
          <input
            type="text"
            name="projectInterest"
            value={formData.projectInterest || ''}
            onChange={handleChange}
            placeholder="e.g., Web development, consulting, etc."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
            }}
          >
            Message
          </label>
          <textarea
            name="message"
            value={formData.message || ''}
            onChange={handleChange}
            placeholder="Tell us about your project..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'none',
            }}
          />
        </div>

        {/* Consent Checkboxes */}
        <div style={{ marginBottom: '24px', paddingTop: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4b5563',
            }}
          >
            <input
              type="checkbox"
              name="smsConsent"
              checked={formData.smsConsent || false}
              onChange={handleChange}
              style={{
                marginRight: '8px',
                cursor: 'pointer',
                width: '16px',
                height: '16px',
              }}
            />
            I'd like to receive SMS updates about my inquiry
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4b5563',
            }}
          >
            <input
              type="checkbox"
              name="emailConsent"
              checked={formData.emailConsent || false}
              onChange={handleChange}
              style={{
                marginRight: '8px',
                cursor: 'pointer',
                width: '16px',
                height: '16px',
              }}
            />
            I'd like to receive email updates about my inquiry
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: submitStatus === 'success' ? '#10b981' : primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background-color 0.2s',
          }}
        >
          {submitStatus === 'success'
            ? '✓ Submitted Successfully'
            : isSubmitting
              ? 'Submitting...'
              : 'Get Started'}
        </button>

        {/* Error Message */}
        {submitStatus === 'error' && submitError && (
          <p
            style={{
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fee2e2',
              borderRadius: '6px',
            }}
          >
            {submitError}
          </p>
        )}

        {/* Success Message */}
        {submitStatus === 'success' && (
          <p
            style={{
              color: '#059669',
              fontSize: '14px',
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#d1fae5',
              borderRadius: '6px',
            }}
          >
            Thanks for reaching out! We'll be in touch shortly.
          </p>
        )}
      </form>
    </div>
  );
}

export default LeadCaptureForm;
