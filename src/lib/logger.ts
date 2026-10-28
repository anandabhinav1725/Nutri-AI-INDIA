type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

function writeLog(level: LogLevel, message: string, fields: LogFields = {}) {
  if (process.env.NODE_ENV === "test" && level !== "error") {
    return;
  }

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...fields
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.info(JSON.stringify(entry));
}

export const logger = {
  info(message: string, fields?: LogFields) {
    writeLog("info", message, fields);
  },
  warn(message: string, fields?: LogFields) {
    writeLog("warn", message, fields);
  },
  error(message: string, error: unknown, fields: LogFields = {}) {
    writeLog("error", message, {
      ...fields,
      error: serializeError(error)
    });
  }
};

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    };
  }

  return error;
}
