class ApiError extends Error {
  constructor(message, statusCode, stack = '', error = []) {
    super(message)
    this.stack = stack
    this.statusCode = statusCode
    this.error = error
    this.success = false
  }
}

export default ApiError