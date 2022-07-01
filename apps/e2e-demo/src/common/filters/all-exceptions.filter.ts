import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
// import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // 注入http适配器,注入的属性都会被实例化
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    const ctx = gqlHost.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { httpAdapter } = this.httpAdapterHost;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // let responseBody: any;
    // if (exception instanceof HttpException) {
    //   responseBody = exception.getResponse().valueOf();
    // } else {
    //   responseBody = {
    //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //     message: exception.message,
    //     timestamp: new Date().toISOString(),
    //     path: httpAdapter.getRequestUrl(request),
    //   };
    // }

    const responseBody = {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      // 若为HttpException，解构响应数据
      ...(exception instanceof HttpException
        ? exception.getResponse().valueOf()
        : {}),
    };

    console.log(responseBody);

    httpAdapter.reply(response, responseBody, status);
  }

  //   let status = 500;
  //   let message = 'Internal Server Error';

  //   if (exception instanceof HttpException) {
  //     status = exception.getStatus();
  //     message = exception.message;
  //   }

  //   if (exception instanceof Error) {
  //     status = 500;
  //     message = exception.message;
  //   }

  //   response.status(status).json({ // 直接获取response的方式 可能不会跨平台通用。此处用的是express.response,使用Http适配器，来达到跨平台的目的，让nest来处理
  //     statusCode: status,
  //     error: message,
  //     timestamp: new Date().toISOString(),
  //     path: request.url,
  //     // stack: exception.stack,
  //   });
  // }
}
