function calcularIMC(peso, altura) {
    return peso / (altura ** 2)
}

module.exports = { calcularIMC }