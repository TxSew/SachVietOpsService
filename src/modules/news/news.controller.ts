import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NewService } from './new.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewService) {}

    @Post('/filter')
    getAll(@Body() props) {
        return this.newsService.getListNews(props);
    }

    @Get('getMe/:id')
    geOne(@Param('id') id: number) {
        return this.newsService.getOne(Number(id));
    }

    @Get('detail/:id')
    getDetail(@Param('id') slug: string) {
        return this.newsService.getDetail(slug);
    }
    @Post('/createNews')
    createUserAddress(@Body() props) {
        console.log(props);
        return this.newsService.createNews(props);
    }

    @Post('/updateNews')
    updateUserAddress(@Body() props) {
        return this.newsService.updateNews(props);
    }

    @Delete('removeNews/:id')
    deleteNews(@Param('id') id: number) {
        return this.newsService.deleteNews(id);
    }
}
