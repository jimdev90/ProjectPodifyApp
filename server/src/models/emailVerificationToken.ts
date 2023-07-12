// interface

import { Model, ObjectId, Schema, model } from "mongoose";

interface EmailVerificationTokenDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

// expire them after 1hrs: caducan después de 1 hora

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 3600, // 60 min * 60 sec = 3600s
            default: Date.now()
        }
    }
);

export default model('EmailVerificationTokenSchema', emailVerificationTokenSchema) as Model<EmailVerificationTokenDocument>;