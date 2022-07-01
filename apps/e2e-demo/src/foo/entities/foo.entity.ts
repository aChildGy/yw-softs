import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Foo {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  exampleField: number;
  @Column()
  field1: number;
  @Column()
  field2: number;
}
