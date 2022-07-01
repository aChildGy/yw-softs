import { Injectable } from '@nestjs/common';
import { CreateTooInput } from './dto/create-too.input';
import { UpdateTooInput } from './dto/update-too.input';

@Injectable()
export class TooService {
  create(createTooInput: CreateTooInput) {
    console.log(createTooInput);
    return 'This action adds a new too';
  }

  findAll() {
    return `This action returns all too`;
  }

  findOne(id: number) {
    return `This action returns a #${id} too`;
  }

  update(id: number, updateTooInput: UpdateTooInput) {
    console.log(updateTooInput);
    return `This action updates a #${id} too`;
  }

  remove(id: number) {
    return `This action removes a #${id} too`;
  }
}
