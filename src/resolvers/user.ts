import { hash, verify } from "argon2";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";


@InputType()
class UsernamePasswordInput {
    @Field(() => String)
    username: string
    @Field(() => String)
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string
}
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}



@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'length must be greater than 2',
                    },
                ]
            }
        }
        if (options.password.length <= 6) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'length must be greater than 6',
                    },
                ]
            }
        }
        const hashePassword = await hash(options.password);

        const user = em.create(User, {
            username: options.username,
            passwored: hashePassword
        });
        try {
            await em.persistAndFlush(user);
        } catch (err) {
            console.log(err.code);

            if (err.code === 23505 || err.code === 11000) {
                return {
                    errors: [{
                        field: 'Register',
                        message: 'User already exists'
                    }],
                }
            }
            return {
                errors: [{
                    field: 'Undefined',
                    message: err.message,
                }],
            }
        }

        return { user, };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if (!user) {
            return {
                errors: [{
                    field: 'User issues',
                    message: 'User o Password incorrect',
                },]
            };
        }

        const valid = await verify(user.passwored, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: 'User issues',
                    message: 'User o Password incorrect',
                },]
            };
        }

        req.session!.userId = user._id?.toString();
        console.log(req.session!.userId);

        return { user, }
    }
}