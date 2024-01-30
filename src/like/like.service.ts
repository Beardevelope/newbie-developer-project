import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import _ from 'lodash';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
    ) {}

    async create(projectPostId: number, userId: number) {
        const projectPost = await this.likeRepository.save({ userId, projectPostId });

        return projectPost;
    }

    async findAll(id: number) {
        const likes = await this.likeRepository.find({ where: { id } });

        return likes.map(async (like) => {
            return await this.projectPostRepository.findOne({
                where: { id: like.projectPostId },
            });
        });
    }

    // 유저가 누른 좋아요 목록 전체 조회
    async findAllUser(userId: number) {
        const likes = await this.likeRepository.find({ where: { userId } });

        return likes.map(async (like) => {
            return await this.projectPostRepository.findOne({
                where: { id: like.projectPostId },
            });
        });
    }

    async findOne(id: number, userId: number) {
        const like = await this.likeRepository.findOne({ where: { id, userId } });

        if (_.isNil(like)) {
            throw new NotFoundException('존재하지않은 프로젝트입니다');
        }

        const projectPost = await this.projectPostRepository.findOne({
            where: { id: like.projectPostId },
        });
        return projectPost;
    }

    async remove(id: number) {
        const projectPost = await this.likeRepository.findOne({ where: { id } });

        if (_.isNil(projectPost)) {
            throw new NotFoundException('존재하지않은 프로젝트입니다');
        }

        await this.likeRepository.delete({ id });
        return { message: '좋아요 삭제 성공' };
    }
}
