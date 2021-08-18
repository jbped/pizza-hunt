const { Comment, Pizza } = require("../models");

const commentController = {
    addComment({ params, body }, res) {
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    // query param
                    { _id: params.pizzaId },
                    // Pushes comments with the appropriate ID to the appropriate pizza that they should be associated with
                    { $push: { comments: _id } },
                    // Returns the updated pizza
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with the provided id' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    res.status(404).json({ message: 'No comment found with the provided id' });
                    return;
                }
                return Pizza.findOneAndUpdate(
                    // Finds the pizza the comment is associated with
                    { _id: params.pizzaId },
                    // Pull removes the comment from the Pizza Comments array
                    { $pull: { comments: params.commentId } },
                    // Returns the updated pizza
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with the provided id' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            // Finds the comment that the new reply will be associated with
            { _id: params.commentId },
            // Pushes the new reply to the replies arr
            { $push: { replies: body } },
            // Returns the updated comment
            { new: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    removeReply({ params }, res) {
        Comment.findOneAndDelete(
            // Finds the comment that the new reply will be associated with
            { _id: params.commentId },
            // Pulls the deleted reply from the replies arr
            { $pull: { replyId: params.replyId } },
            // Returns the updated comment
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    }
}

module.exports = commentController;