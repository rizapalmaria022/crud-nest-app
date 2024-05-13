import { Injectable, OnModuleInit,  } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
    this.$use(this.categoryFindMiddleware);
    this.$use(this.loggingMiddleware);
    this.$use(this.categorySoftDeleteMiddleware);
  }

  loggingMiddleware: Prisma.Middleware = async (params, next) => {
    console.log(
      `${params.action} ${params.model} ${JSON.stringify(params.args)}`,
    );
 
    const result = await next(params);
 
    console.log(result);
 
    return result;
  };
 
  async onModuleDestroy() {
    await this.$disconnect();
  }

  categoryFindMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.model !== 'User') {
      return next(params);
    }
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      return next({
        ...params,
        action: 'findFirst',
        args: {
          ...params.args,
          where: {
            ...params.args?.where,
            deleted: null,
          },
        },
      });
    }
    if (params.action === 'findMany') {
      return next({
        ...params,
        args: {
          ...params.args,
          where: {
            ...params.args?.where,
            deleted: null,
          },
        },
      });
    }
    return next(params);
  };

  categorySoftDeleteMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.model !== 'User') {
      return next(params);
    }
    if (params.action === 'delete') {
      return next({
        ...params,
        action: 'update',
        args: {
          ...params.args,
          data: {
            deleted: new Date(),
          },
        },
      });
    }
    return next(params);
  };
}
