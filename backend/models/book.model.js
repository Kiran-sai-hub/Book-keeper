import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'reading', 'wants-to-read'],
        default: 'wants-to-read',
    },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;