(function(window, $) {
    
    'use strict';

	function HotSug(wrapper, options) {//$.removecookie('item-list')
        var defaults = {
            cookieName: 'item-list',
            dataName: 'num',      
            hoverElem: 'div',
            highlightElem: 'a',
            changeTime: '2000',
            expires: 7,
            maxCount: 10
        }
        this.$wrapper = $(wrapper);
        this.options = $.extend(defaults, options);
        this.init();
        this.bindListeners();
    }

    HotSug.prototype = {
        init: function() {
            var _this = this,
                value = Cookies.get(this.options.cookieName);

            if (value) {
                var arr = value.split(',');
                this.$wrapper.find(this.options.hoverElem).each(function() {
                    for(var i = 0; i < arr.length; i++) {
                        if ($(this).data(_this.options.dataName) == arr[i]) {
                            $(this).find(_this.options.highlightElem).addClass('viewed');
                        }
                    }
                });
            }
        }, 

        bindListeners: function() {
            var _this = this,
                highlightElem;

            this.$wrapper.find(this.options.hoverElem).click(function() {
                highlightElem = $(this).find(_this.options.highlightElem);
                if (!highlightElem.hasClass('viewed')) {   //放在事件内判断，不能放在事件外判断，否则定时器定义语句每次鼠标enter都会执行
                    highlightElem.addClass('viewed');                
                    _this.addCookie(this);
                }
            });

            this.$wrapper.find(this.options.hoverElem).each(function() {
                var hoverElem = this,
                    highlightElem,
                    timerO, 
                    timerI, 
                    longEnough = false;

                $(this).mouseenter(function() {
                    highlightElem = $(this).find(_this.options.highlightElem);
                    if (!highlightElem.hasClass('viewed')) {   //放在事件内判断，不能放在事件外判断，否则定时器定义语句每次鼠标enter都会执行
             
                        timerO = setTimeout(function() {
                            longEnough = true;
                        }, _this.options.changeTime);

                        timerI = setInterval(function() {
                            if (longEnough) {
                                highlightElem.addClass('viewed');
                                _this.addCookie(hoverElem);
                            }
                        }, 200);
                    }            
                }).mouseleave(function() {
                    clearTimeout(timerO)
                    clearInterval(timerI);                        
                });
            });
        },

        addCookie: function(hoverElem) {
            var index = $(hoverElem).data(this.options.dataName),
                value = Cookies.get(this.options.cookieName) || '',
                arr;
                
            if (value) {
                arr = value.split(',');                                    
                arr.push(index);
                if (arr.length > this.options.maxCount) {
                    var newArr = [];
                    for(var i = parseInt(this.options.maxCount/2); i < arr.length; i++)
                        newArr[i - parseInt(this.options.maxCount/2)] = arr[i];
                    value = newArr.join(',')
                } else {
                    value = arr.join(',')
                }
                
            } else {
                value = index;
            }
            Cookies.set(this.options.cookieName, value, {expires: this.options.expires});
        }
    }

    window.HotSug = HotSug;

    $.fn.hotsug = function(options) {
        new HotSug(this, options);
        return $(this);
    }
    
})(window, jQuery);