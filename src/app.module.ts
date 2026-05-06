import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { FollowModule } from './modules/follow/follow.module.js';
import { PostModule } from './modules/post/post.module.js';
import { LikeModule } from './modules/like/like.module.js';
import { CommentModule } from './modules/comment/comment.module.js';
import { FeedModule } from './modules/feed/feed.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { validateEnv } from './config/env.validation.js';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
     AuthModule,
     UserModule,
     FollowModule,
     PostModule,
     LikeModule,
     CommentModule,
     FeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path')
  }
}
