import { Entity, PrimaryKey, Property, Unique  } from "@mikro-orm/core";
import { Field,  ObjectType, ID } from 'type-graphql';

@ObjectType()
@Entity()
@Unique({ properties: ['username'] })
export class User {
  @Field(() => ID, { nullable: true })
  @PrimaryKey()
  _id?: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique: true })
  @Unique()
  username!: string;
    
  @Property({ type: "text" })
  passwored!: string;
}
