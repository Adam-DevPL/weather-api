import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DateParam = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const date = new Date(request.params[data]);
    if (!(date instanceof Date) && isNaN(date)) {
      return null;
    }
    const now = new Date();
    const day: number = 60 * 60 * 24 * 1000;
    const minRangeDate = new Date(new Date(now.getTime() + day).toDateString());
    const maxDateRange = new Date(
      new Date(now.getTime() + 7 * day).toDateString(),
    );

    return date > minRangeDate && date <= maxDateRange ? date : null;
  },
);
