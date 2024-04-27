export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = [],
    stack = ""
  ) {
    console.log("Error", Error);
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.sucess = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// console.log(ApiError.);
