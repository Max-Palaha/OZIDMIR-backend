import { Module } from '@nestjs/common';
import { likesService } from './likes.service';

@Module({
  imports:[],
  providers: [likesService],
  exports: [likesService]
})
export class LikesModule {}
