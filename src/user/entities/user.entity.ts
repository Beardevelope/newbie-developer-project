import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Answer } from 'src/answer/entities/answer.entity';
import { Banner } from 'src/banner/entities/banner.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { ProjectApplicant } from 'src/project-post/entities/projectApplicant.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Column()
    password: string;

    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    @IsString()
    @Column()
    nickname: string;

    @Column({ nullable: true })
    role: string;

    @Column()
    @IsNumber()
    points: number;

    @Column()
    isAdmin: boolean;

    @Column()
    techType: string;

    @Column({ default: null, nullable: true })
    name: string;

    @Column({ default: null, nullable: true })
    contact: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ nullable: true })
    profileImage: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany((type) => Banner, (banner) => banner.user)
    banners: Banner[];

    @OneToMany((type) => Answer, (answer) => answer.user)
    answer: Answer[];

    @OneToMany((type) => Like, (like) => like.user)
    like: Like[];

    @ManyToMany((type) => ProjectPost, (projectPost) => projectPost.user)
    projectPost: ProjectPost[];
}
