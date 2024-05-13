const mongoose = require("mongoose")

const menusSchema = new mongoose.Schema({
    fecha: {
        type: String,
        require: true
    },
    idPlatoManana: {
        type: String,
        require: true
    },
    idPlatoNoche: {
        type: String,
        require: true
    }
}, { timestamps: true })

const Menus = mongoose.model("Menus", menusSchema)

module.exports = Menus;