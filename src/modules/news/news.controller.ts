import { Body, Controller, Post } from '@nestjs/common';
import { NewService } from './new.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewService) {}

    @Post('')
    getAll(@Body() props) {
        return this.newsService.getListNews(props);
    }

    @Post('/createNews')
    createUserAddress(@Body() props) {
        console.log('🚀 ~ file: news.controller.ts:13 ~ NewsController ~ createUserAddress ~ props:', props);
        return this.newsService.createNews(props);
    }

    @Post('/updateNews')
    updateUserAddress(@Body() props) {
        return this.newsService.updateNews(props);
    }
}
