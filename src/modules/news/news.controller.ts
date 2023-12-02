import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NewService } from './new.service';
import { Public } from 'src/guard/jwtGuard';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewService) {}
    @Public()
    @Post('/filter')
    getAll(@Body() props) {
        return this.newsService.getListNews(props);
    }

    @Get('getMe/:id')
    geOne(@Param('id') id: number) {
        return this.newsService.getOne(Number(id));
    }

    @Public()
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
