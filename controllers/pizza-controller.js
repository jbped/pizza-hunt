const { Pizza } = require('../models');

const pizzaController = {
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: "comments",
                select: "-__v"
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getPizzaById({ params }, res) {
        Pizza.findById(params.id)
            .populate({
                path: "comments",
                select: "-__v"
            })
            .select("-__v")
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: "No pizza found with the provided ID" });
                    return;
                }
                res.json(dbData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbData => res.json(dbData))
            .catch(err => res.status(400).json(err));
    },
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: "No pizza found with the provided ID" });
                    return;
                }
                res.json(dbData)
            })
            .catch(err => res.status(400).json(err));
    },
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: "No pizza found with the provided ID" });
                    return;
                }
                res.json(dbData)
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController