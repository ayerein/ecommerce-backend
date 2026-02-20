import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const ordersSchema = new mongoose.Schema({
    items: [
        {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        price: Number
        }
    ],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

ordersSchema.plugin(mongoosePaginate);

export default mongoose.model("Orders", ordersSchema)