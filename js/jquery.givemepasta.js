/*!
 * jQuery SEOP Give Me Pasta plugin (Inspired by the food Im eating while thinking about this)
 * author: Zeus Camua
 * Licensed under the MIT license
 */

;(function($, window, document, undefined) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.
    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).
    // Create the defaults once
    var pluginName = 'giveMePasta',
        defaults = {
            'cookingTime': 1000,
            'impatient': false,
            'anxious': false,
            'iconX': 0,
            'iconY': 0,
            'iconPosition' : 'right',
            'cookedIcon': '',
            'cookingIcon': '',
            afterServing: function(){
                return;
            },
            whileServing: function(){
                return;
            },
            beforeServing: function(){
                return;
            }
        };

    // The actual plugin constructor

    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {


        init: function() {

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and 
            // call them like so: this.yourOtherFunction(this.element, this.options).
            var $element = $(this.element);

            $element = $.extend({}, this.Impatience($element), this.Anxiety($element), $element);

            this.CookTheSpaghetti($element.find('.handler'));
        },

        //
        // If the user wants to show a javascript side dropdown indicator
        //
        Anxiety: function(el) {
            if (!this.options.anxious) return {};

            var options = this.options;

            $el = el.find('.handler');
            $el.css({
                'position': 'relative'
            });
            
            if (!$el.hasClass('served')) {
                return $el.append('<img src="' + options.cookingIcon + '" style="position: absolute; ' + options.iconPosition + ':' + options.iconX + 'px; top:'+ options.iconY + 'px;"/>');
            }
            return $el.append('<img src="' + options.cookedIcon + '" style="position: absolute; ' + options.iconPosition + ':' + options.iconX + 'px; top:'+ options.iconY + 'px;"/>');
        },

        //
        // If the user wants to have the dropdown open upon load
        //
        Impatience: function(el) {
            if (!this.options.impatient) {
                return el.find('.content').css({
                    'display': 'none'
                });
            }

            return el.find('.handler').toggleClass('served');
        },

        CookTheSpaghetti: function(el) {

            var options = this.options;
            var $element = $(this.element);

            el.css({ 'cursor' : 'pointer' });
            el.find('a').unbind();
            
            el.click(function() {

                options.beforeServing();

                $(this).toggleClass('served');


                /*  If the user wants to see the dropdown icon through plugin
                ---------------------------------------------------------*/
                if (options.anxious){

                    var iconUrl = $(this).hasClass('served') ? options.cookedIcon : options.cookingIcon;

                    $(this).find('img').attr('src', iconUrl);

                }

                
                /* Slide Animation
                ---------------------------------------------------------*/
                $element.find('.content').stop(true,true).slideToggle(options.speed, function(){

                    options.afterServing();

                });


            });

        }
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {

        return this.each(function() {

            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);