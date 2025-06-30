export class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ClientError";
    this.statusCode = statusCode;
  }
};

export class NotFoundError extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = statusCode;
  }
};

export class UnauthorizedError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = statusCode;
  }
};




