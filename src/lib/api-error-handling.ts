import { NextResponse } from "next/server"

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

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, errors: error.errors }, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: "An unexpected error occurred", message: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
}

export function unauthorizedError(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbiddenError(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export function notFoundError(resource: string): NextResponse {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}

export function badRequestError(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 })
}

