export interface ExceptionLoggerEntity {
  id: number;

  message: string;

  context: string;

  stack: string;

  level: string;

  status: number;

  createdAt: string;
}
