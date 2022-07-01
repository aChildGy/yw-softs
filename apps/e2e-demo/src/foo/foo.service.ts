import { Injectable } from '@nestjs/common';
import { CreateFooInput } from './dto/create-foo.input';
import { UpdateFooInput } from './dto/update-foo.input';

@Injectable()
export class FooService {
  create(createFooInput: CreateFooInput) {
    console.log(createFooInput);
    return 'This action adds a new foo';
  }

  findAll() {
    return `This action returns all foo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foo`;
  }

  update(id: number, updateFooInput: UpdateFooInput) {
    console.log(updateFooInput);
    return `This action updates a #${id} foo`;
  }

  remove(id: number) {
    return `This action removes a #${id} foo`;
  }
}
