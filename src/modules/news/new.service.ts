import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { NewsModel } from './news.schema';
import { Op } from 'sequelize';

@Injectable()
export class NewService {
    async getListNews(props) {
        let limit = props.limit || 8;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const listAll = await NewsModel.findAll({});
        let status = {};
        if (props.status) {
            status = {
                status: { [Op.eq]: null },
            };
        }
        const news = await NewsModel.findAll({
            limit: limited,
            offset: offset,
            where: status,
        });
        return {
            totalPage: Math.ceil(listAll.length / limited),
            data: news,
        };
    }
    async getDetail(slug: string) {
        if (!slug) throw ResponseError.badInput('news empty value');

        const getNew = await NewsModel.findOne({
            where: { slug: slug },
        });
        return getNew;
    }

    async getOne(id: number) {
        const getNew = await NewsModel.findOne({
            where: { id: id },
        });
        return getNew;
    }
    async createNews(props) {
        try {
            const news = await NewsModel.create(props);
            return news;
        } catch (err) {
            throw ResponseError.badInput(err);
        }
    }

    async updateNews(props) {
        try {
            await NewsModel.update(props, {
                where: { id: props.id },
            });
            return {
                message: 'update News successfully',
            };
        } catch (err) {
            throw ResponseError.badInput(err);
        }
    }
    async deleteNews(id) {
        await NewsModel.destroy({
            where: { id: id },
        });
        return {
            message: ' delete News successfully',
        };
    }
}
