import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNeedInfoDto } from './dto/create-need-info.dto';
import { UpdateNeedInfoDto } from './dto/update-need-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NeedInfo } from './entities/need-info.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class NeedInfoService {
    constructor(
        @InjectRepository(NeedInfo) private readonly needInfoRepository: Repository<NeedInfo>,
    ) {}

    // 필요 기술 스택 생성
    async create(projectPostId: number, createNeedInfoDto: CreateNeedInfoDto) {
        const { stack, numberOfPeople } = createNeedInfoDto;

        const result = await this.needInfoRepository.save({
            projectPostId,
            stack,
            numberOfPeople,
        });

        return result;
    }

    // 필요 기술 조회
    async findAll(projectPostId: number) {
        const result = await this.needInfoRepository.find({
            where: { projectPostId },
        });
        return result;
    }

    // 필요 기술 스택 인원 변경
    async update(projectPostId: number, id: number, updateNeedInfoDto: UpdateNeedInfoDto) {
        const { numberOfPeople } = updateNeedInfoDto;

        await this.needInfoRepository.update({ projectPostId, id }, { numberOfPeople });

        const result = await this.findById(projectPostId, id);

        return result;
    }

    // 필요 기술 스택 삭제
    async remove(projectPostId: number, id: number) {
        await this.findById(projectPostId, id);

        await this.needInfoRepository.delete({ projectPostId, id });
        return { message: '답변 삭제 완료' };
    }

    // Id로 찾는 함수
    async findById(projectPostId: number, id: number) {
        const result = await this.needInfoRepository.findOne({ where: { projectPostId, id } });

        if (_.isNil(result)) {
            throw new BadRequestException('존재하지않는 프로젝트입니다');
        }

        return result;
    }
}