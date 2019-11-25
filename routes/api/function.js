
const getSymbol = (array) =>{
    var str = '';
    array.forEach(element =>{
        str = str+element.symbol+','
    })
    return str;
}
module.exports.getSymbol = getSymbol;
