const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
    {
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: "Please provide text for the body of the reply",
            trim: true
        },
        writtenBy: {
            type: String,
            required: "Please provide a name for the author of the reply"
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        },
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: "Please provide a name for the commenter"
        },
        commentBody: {
            type: String,
            required: "Please provide text for the body of the comment"
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        replies: [ReplySchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    }
);

CommentSchema.virtual("replyCount").get(function() {
    return this.replies.length
})

const Comment = new model("Comment", CommentSchema);

module.exports = Comment;