import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { CommentLike } from '../comment-like/entitis/comment-like.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(CommentLike)
        private readonly commentLikeRepository: Repository<CommentLike>,
    ) {}

    // 게시글 유효성 확인
    private async verifyPostId(postId: number) {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }
        return post;
    }

    // 댓글 유효성 확인
    private async verifyCommentId(id: number) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다1.');
        }
        return comment;
    }

    // 게시글에 해당 댓글이 있는지 확인
    private async verifyPostAndComment(id: number, postId: number) {
        const comment = await this.commentRepository.findOne({ where: { id, postId } });
        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다2.');
        }
    }

    // 대댓글 기능 부모 댓글 확인
    private async verifyParentId(parentId: number) {
        const comment = await this.commentRepository.findOne({ where: { parentId } });
        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }
    }

    async findCommentById(id: number) {
        const findComment = await this.commentRepository.findOne({ where: { id } });
        return findComment;
    }

    // 댓글 작성
    async createComment(postId: number, userId: number, createCommentDto: CreateCommentDto) {
        const comment = this.commentRepository.create({ postId, userId, ...createCommentDto });
        return this.commentRepository.save(comment);
    }

    // 해당 게시글 댓글 전체 조회
    async findAllCommentByPostId(postId: number) {
        await this.verifyPostId(postId);
        const comments = this.commentRepository.find({ where: { postId } });
        return comments;
    }

    // 댓글 수정
    async updateComment(id: number, postId: number, updateCommentDto: UpdateCommentDto) {
        await this.verifyPostAndComment(id, postId);

        const updatComment = await this.commentRepository.update(id, updateCommentDto);
        return this.verifyCommentId(id);
    }

    // 댓글 삭제
    async deleteComment(id: number, postId: number) {
        await this.verifyPostAndComment(id, postId);

        const result = await this.commentRepository.delete(id);
    }

    // 대댓글 작성
    async createReplyComment(
        postId: number,
        parentId: number,
        userId: number,
        createReplyDto: CreateReplyDto,
    ) {
        await this.verifyPostAndComment(parentId, postId);

        const reply = this.commentRepository.create({
            parentId,
            postId,
            userId,
            ...createReplyDto,
        });

        return this.commentRepository.save(reply);
    }

    // 대댓글 수정
    async updateReplyComment(
        postId: number,
        parentId: number,
        id: number,
        updateReplyDto: UpdateReplyDto,
    ) {
        await this.verifyPostAndComment(parentId, postId);
        await this.verifyCommentId(id);

        const updateReply = await this.commentRepository.update(id, updateReplyDto);
        return this.verifyCommentId(id);
    }

    // 대댓글 삭제
    async deleteReplyComment(id: number, parentId: number, postId: number) {
        await this.verifyPostAndComment(parentId, postId);
        await this.verifyCommentId(id);

        const result = await this.commentRepository.delete(id);
    }

    // 좋아요 추가
    async addCommentLike(userId: number, commentId: number): Promise<number> {
        // 좋아요를 눌렀는지 확인
        const existingLike = await this.commentLikeRepository.findOne({
            where: { userId, commentId },
        });

        if (existingLike) {
            // 이미 좋아요를 눌렀으면 취소
            await this.commentLikeRepository.delete(existingLike.id);
            return -1;
        } else {
            // 좋아요 추가
            const newLike = this.commentLikeRepository.create({ userId, commentId });
            await this.commentLikeRepository.save(newLike);
            return 1;
        }
    }
}
