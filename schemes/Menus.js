const mongoose = require("mongoose")

const menusSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    idPlatoManana: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato',
        required: true
    },
    idPlatoNoche: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato',
        required: true
    }
}, { timestamps: true });

const Menus = mongoose.model("Menus", menusSchema)

module.exports = Menus;