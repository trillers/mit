var widget = {}
function Commenter(){

}
Commenter.prototype.init = function(options){
    this.container = options.container;
    _build(this, this.container);
}
Commenter.prototype.input = function(userName){
    var $container = $(this.container);
    if(this.toUser){
        _replaceUser($container, userName);
    }
    else{
        _createToUser(this, $container, userName);
    }
}
function _createToUser(wg, $container, userName){
    var html = "<b class='touserdiv reply_to'>"+ "@" + userName + "</b>"
    $container.prepend(html);
    wg.toUser = true;
}
function _replaceUser($container, userName){
    $container.find(">.touserdiv").text("@" + userName);
}
function _build(wg, container){
    var $container = $(container);
    var $input = $container.find("input");
    $input.on('keydown', function(e){
        if($input.val() === "" && (e.keyCode === 46 || e.keyCode === 110 || e.keyCode === 8)){
            wg.trigger('toUserRemove');
            wg.toUser = false;
            $container.find(">.touserdiv").remove();
        }
    })

}
widget.commenter = Commenter;
module.exports = widget;