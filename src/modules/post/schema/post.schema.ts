import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
})
export class Post {
    @Prop({
        required: true,
    })
    authorId!: string;

    @Prop({
        required: true,
        trim: true,
        maxlength: 500,
    })
    caption!: string;

    @Prop({
        type: [String],
        default: [],
    })
    imageUrls!: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);