import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FollowModule } from './modules/follow/follow.module';
import { PostModule } from './modules/post/post.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { FeedModule } from './modules/feed/feed.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
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
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
