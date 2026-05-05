import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FollowModule } from './modules/follow/follow.module';
import { PostModule } from './modules/post/post.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { FeedModule } from './modules/feed/feed.module';

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
})
export class AppModule {}
