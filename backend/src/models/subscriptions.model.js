import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        channel: {
            type: String,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("subscription", subscriptionSchema);
