import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';

@Injectable()
export class FollowService {
    constructor(private prisma: PrismaService) {}

    async followUser(currentUserId: string, targetUserId: string){

        // prevent self follow
        if (currentUserId === targetUserId) {
            throw new BadRequestException('You cannot follow yourself')
        };
        console.log('current user: ', currentUserId)
        console.log('target user: ', targetUserId)
        // check target user exists
        const targetUser = await this.prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        });

        if (!targetUser) {
            throw new NotFoundException('User not found');
        };

        // check duplication follow
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            throw new BadRequestException('Already following this user');
        };

        // create follow flow
        const follow = await this.prisma.follow.create({

            data: {
                followerId: currentUserId,
                followingId: targetUserId
            }
        });

        return {
            message: 'User followed successfully',
            follow,
        };

    }

}
