/**
 * Created by royhyang on 2016/7/17.
 */
module.exports.escapeRegExp = function(str){
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&");
}
