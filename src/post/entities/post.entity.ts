import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { PostLike } from 'src/post-like/entities/post-like.entity';
import { Warning } from 'src/warning/entities/warning.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    @IsNotEmpty({ message: '제목란을 확인해주세요' })
    @IsString()
    title: string;

    @Column({ type: 'longtext' })
    @IsNotEmpty({ message: '내용란을 확인해주세요' })
    //@IsString()
    content: string;

    @Column({ nullable: true })
    @IsString()
    image?: string;

    @Column()
    @IsNumber()
    likes: number;

    @Column({ default: 'unfinished' })
    status: string;

    @Column()
    hitCount: number;

    @Column()
    warning: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne((type) => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToMany((type) => Tag, (tag) => tag.posts, { cascade: true })
    @IsNotEmpty({ message: '입력란을 확인해주세요' })
    @JoinTable()
    tags: Tag[];

    @OneToMany((type) => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany((type) => PostLike, (postLike) => postLike.post)
    postLikes: PostLike[];

    @OneToMany((type) => Warning, (warning) => warning.post)
    warnings: Warning[];

    // 저장하기 전에 HTML 이스케이핑 수행
    beforeInsert() {
        this.content = escape(this.content);
    }
}
