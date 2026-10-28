import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function jsonOk<T>(payload: T) {
  return NextResponse.json(payload);
}

export function jsonWithStatus<T>(payload: T, status: number) {
  return NextResponse.json(payload, { status });
}

export function jsonFailure(params: {
  logMessage: string;
  userMessage: string;
  error: unknown;
  status?: number;
  fields?: Record<string, unknown>;
}) {
  logger.error(params.logMessage, params.error, params.fields);

  return NextResponse.json(
    { error: params.userMessage },
    { status: params.status ?? statusForError(params.error) }
  );
}

export function statusForError(error: unknown) {
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return 400;
  }

  return 500;
}
