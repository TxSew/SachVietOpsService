import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { NewsModel } from './news.schema';

@Injectable()
export class NewService {
    async getListNews(props) {
        let limit = props.limit || 8;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const minPrice = props.sortMinPrice || 1;
        const maxPrice = props.sortMaxPrice || 200000000000;
        const searchQuery = props.keyword || '';
        const ct = props.categoryFilter;
        const orderWith = (props.sortWith || 'asc').toLocaleLowerCase() == 'asc' ? 'DESC' : 'ASC';
        const news = NewsModel.findAll({
            limit: limited,
            offset: offset,
        });
        return {
            data: news,
        };
    }
    async createNews(props) {
        if (!props) throw ResponseError.badInput('news empty value');
        const news = await NewsModel.create(props);
        return news;
    }

    async updateNews(props) {
        const userAddress = await NewsModel.upsert(props);
        return userAddress;
    }
}
