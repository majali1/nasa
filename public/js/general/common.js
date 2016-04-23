String.prototype.format = function (args) {
    var newStr = this;
    for (var key in args) {
        newStr = newStr.split('{' + key + '}').join(args[key]);
    }
    return newStr;
}