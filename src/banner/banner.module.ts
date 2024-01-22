import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Banner, BannerClick])],
    imports: [TypeOrmModule.forFeature([Banner])],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
