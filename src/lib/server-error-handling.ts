import { ZodError } from "zod"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const handleServerError = (error: unknown): ApiError => {
  console.error("Server error:", error)

  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {}
    error.errors.forEach((err) => {
      const path = err.path.join(".")
      if (!formattedErrors[path]) {
        formattedErrors[path] = []
      }
      formattedErrors[path].push(err.message)
    })

    return new ApiError("Validation failed", 400, formattedErrors)
  }

  if (error instanceof Error) {
    // Check for specific error types and handle accordingly
    if (error.name === "MongoError" && (error as any).code === 11000) {
      return new ApiError("Duplicate key error", 409)
    }

    if (error.message.includes("Network Error")) {
      return new ApiError("Network error occurred", 503)
    }

    return new ApiError(error.message, 500)
  }

  return new ApiError("An unexpected error occurred", 500)
}

export const logServerError = (error: unknown) => {
  console.error("Server error:", error)
  // You can add more sophisticated logging here, such as sending to a logging service
}

