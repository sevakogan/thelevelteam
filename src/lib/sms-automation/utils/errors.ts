/**
 * Custom error types for the SMS widget
 */

export class SMSAutomationError extends Error {
  constructor(message: string, public code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'SMSAutomationError';
  }
}

export class ValidationError extends SMSAutomationError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends SMSAutomationError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends SMSAutomationError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class IntegrationError extends SMSAutomationError {
  constructor(
    service: string,
    message: string,
    public originalError?: Error
  ) {
    super(`${service} integration error: ${message}`, 'INTEGRATION_ERROR');
    this.name = 'IntegrationError';
  }
}

export function getErrorResponse(error: unknown): {
  message: string;
  code: string;
  status: number;
} {
  if (error instanceof SMSAutomationError) {
    let status = 500;
    if (error.code === 'VALIDATION_ERROR') status = 400;
    if (error.code === 'NOT_FOUND') status = 404;
    if (error.code === 'UNAUTHORIZED') status = 401;

    return {
      message: error.message,
      code: error.code,
      status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
}
