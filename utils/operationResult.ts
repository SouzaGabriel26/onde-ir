export type Failure<T = unknown> = {
  data: null;
  error: {
    message: string;
  } & T;
};

export type Success<T> = {
  data: T;
  error: null;
};

function failure<T>(error: Failure['error'] & T): Failure<T> {
  return {
    data: null,
    error,
  };
}

function success<T>(data: T): Success<T> {
  return {
    data,
    error: null,
  };
}

export const operationResult = Object.freeze({
  failure,
  success,
});
