import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const ordersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
    status: {
        type: String,
        default: 'Pendiente de aprobación.',
        enum: [
            'Pendiente de aprobación.', 
            'Orden en proceso.', 
            'Orden lista.', 
            'Orden cancelada.'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

ordersSchema.plugin(mongoosePaginate);

export default mongoose.model("Orders", ordersSchema)