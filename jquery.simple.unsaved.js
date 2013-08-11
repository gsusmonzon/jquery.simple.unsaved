/*
 * Detects unsaved changes on forms, and prompt user if leaving the page before saving.
 *	How it works: hash the state of the form at the begining, and check if hash matches before leaving
 *
 * USAGE: $('form').checkChanges();
 *
 * Customization is zero
 *
 * NOTE: it works for jQUery < 1.7 . For jQuery >= 1.7 replace 'bind' for 'on' method ( http://api.jquery.com/on/ )
 *
 * NOTE: jQuery +1.7 'makes' change event to bubble, so it would be 'simpler' to detect changes there
 *  $('form').change(onFormDirty);
 *  $('form').submit(resetFormDirty);
 */
;
(function checkChanges($) {

    var DATA_KEY = 'dirrty',
            DIRTY_CLASS = false, //'dirty-form',
            WATCH_CLASS = 'app-watch',
            bound = false,
            //HASH from a string: http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
            hashCode = Array.prototype.reduce ? function(s) {
        return s.split("").reduce(function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    } : function(s) {
        var hash = 0,
                i, l, char;
        if (s.length === 0) {
            return hash;
        }
        for (i = 0, l = s.length; i < l; i++) {
            char = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };


    function _isDirty() {
        //this is a DOM elemtn
        if (this.nodeName !== 'FORM') {
            return false;
        }
        var $self = $(this),
                hash = hashCode($self.serialize());
        return (hash !== $.data(this, DATA_KEY));
    }
    ;

    function _rehash($el) {
        var hash = hashCode($el.serialize());
        $.data($el[0], DATA_KEY, hash);
        return hash;
    }
    ;

    function _checksubmit(e) {
        var $self = $(this);
        _rehash($self);
        DIRTY_CLASS && $self.removeClass(DIRTY_CLASS);
    }
    ;


    function bindGlobal() {
        $(window).bind('beforeunload', function() {
            var $dirtyForms = $("form").filter('.' + WATCH_CLASS).filter(_isDirty);
            if ($dirtyForms.length > 0) {
                // unbindGlobal() //if we want to ask only once
                DIRTY_CLASS && $dirtyForms.addClass(DIRTY_CLASS);
                return "You have unsaved changes. Leave this page anyways?";
            }
        });
        bound = true;
    }
    ;

    // function unbindGlobal(){
    // 	$(window).unbind('beforeunload');
    // 	bound = false;
    // }


    var methods = {
        init: function() {
            return this.each(function(e) {
                if (this.nodeName !== 'FORM') {
                    return;
                }
                if ((this.getAttribute('method') || 'GET').toUpperCase() === 'GET') {
                    return;
                }
                var $self = $(this);
                _rehash($self);
                if (!$self.hasClass(WATCH_CLASS)) {
                    $self.addClass(WATCH_CLASS);
                    $self.bind('submit', _checksubmit);
                    bound || bindGlobal();
                }
            });
        },
        // check: function() {
        // 	return this.each(function(e) {
        // 		if (this.nodeName !== 'FORM') {return;}
        // 		DIRTY_CLASS && $(this).toggleClass(DIRTY_CLASS, _isDirty(this));
        // 	});
        // },
        destroy: function() {
            this.filter('.' + WATCH_CLASS).each(function() {
                var $self = $(this).removeClass(WATCH_CLASS).unbind('submit', _checksubmit);
                $.removeData(this, DATA_KEY);
                DIRTY_CLASS && $self.removeClass(DIRTY_CLASS);
            });
            return this;
        }
    };


    $.fn.checkChanges = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };


}(jQuery));