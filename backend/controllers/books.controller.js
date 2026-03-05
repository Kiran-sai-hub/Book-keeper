import Book from "../models/book.model.js"

const createBook = async (req, res) => {
    try{
        const { title, author, tags } = req.body;
        if(!title || !author) {
            return res.status(400).json({success: false, message: 'All fields are required'});
        }
        const newBook = new Book({
            title: title,
            author: author,
            tags: tags || [],
            user: req.user._id,
        });
        await newBook.save();
        res.status(201).json({success: true, data: newBook});

    }catch(error){
        console.log(`Error on the createBook controller: ${error.message}`);
        res.status(500).json({success: false, message: 'Internal server Error'});
    }
}

const getUsersBooks = async (req, res) => {
    try{
        const { status, tags } = req.query;
        let filter = { user: req.user._id };

        if(status) {
            filter.status = status;
        }

        if(tags) {
            filter.tags = tags;
        }

        const books = await Book.find(filter);
        res.status(200).json({success: true, data: books});
    }catch(error){
        console.log(`Error on the getUsersBooks controller: ${error.message}`);
        res.status(500).json({success: false, message: 'Internal server Error'});
    }
}

const updateBook = async (req, res) => {
    try{
        const bookId = req.params.id;
        const { title, author, tags, status } = req.body;

        const book = await Book.findOne({ _id: bookId, user: req.user._id });
        if(!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }
        if(title) book.title = title;
        if(author) book.author = author;
        if(tags) book.tags = tags;
        if(status) book.status = status;

        await book.save();
        res.status(200).json({success: true, data: book});
    }catch(error){
        console.log(`Error on the updateBook controller: ${error.message}`);
        res.status(500).json({success: false, message: 'Internal server Error'});
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findOneAndDelete({ _id: bookId, user: req.user._id });
        if(!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }
;
        res.status(200).json({success: true, message: 'Book deleted successfully'});
    }catch(error){
        console.log(`Error on the deleteBook controller: ${error.message}`);
        res.status(500).json({success: false, message: 'Internal server Error'});
    }
}

export { createBook, getUsersBooks, updateBook, deleteBook };