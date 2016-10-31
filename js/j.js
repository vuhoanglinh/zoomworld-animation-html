var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a;
            (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
};
COMPILED || (goog.isProvided_ = function(a) {
    return !goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, d) {
    a = a.split(".");
    d = d || goog.global;
    !(a[0] in d) && d.execScript && d.execScript("var " + a[0]);
    for (var c; a.length && (c = a.shift());) !a.length && goog.isDef(b) ? d[c] = b : d = d[c] ? d[c] : d[c] = {}
};
goog.getObjectByName = function(a, b) {
    for (var d = a.split("."), c = b || goog.global, e; e = d.shift();)
        if (goog.isDefAndNotNull(c[e])) c = c[e];
        else return null;
    return c
};
goog.globalize = function(a, b) {
    var d = b || goog.global,
        c;
    for (c in a) d[c] = a[c]
};
goog.addDependency = function(a, b, d) {
    if (!COMPILED) {
        var c;
        a = a.replace(/\\/g, "/");
        for (var e = goog.dependencies_, f = 0; c = b[f]; f++) e.nameToPath[c] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][c] = !0;
        for (c = 0; b = d[c]; c++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a, b) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
            var d = a[b].src,
                c = d.lastIndexOf("?"),
                c = -1 == c ? d.length : c;
            if ("base.js" == d.substr(c - 7, 7)) {
                goog.basePath = d.substr(0, c - 7);
                break
            }
        }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' +
            a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in c.written)) {
            if (!(e in c.visited) && (c.visited[e] = !0, e in c.requires))
                for (var g in c.requires[e])
                    if (!goog.isProvided_(g))
                        if (g in c.nameToPath) a(c.nameToPath[g]);
                        else throw Error("Undefined nameToPath for " + g);
            e in d || (d[e] = !0, b.push(e))
        }
    }
    var b = [],
        d = {},
        c = goog.dependencies_,
        e;
    for (e in goog.included_) c.written[e] || a(e);
    for (e = 0; e < b.length; e++)
        if (b[e]) goog.importScript_(goog.basePath + b[e]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
    var b = typeof a;
    if ("object" == b)
        if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var d = Object.prototype.toString.call(a);
            if ("[object Window]" == d) return "object";
            if ("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isDef = function(a) {
    return void 0 !== a
};
goog.isNull = function(a) {
    return null === a
};
goog.isDefAndNotNull = function(a) {
    return null != a
};
goog.isArray = function(a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
    return "string" == typeof a
};
goog.isBoolean = function(a) {
    return "boolean" == typeof a
};
goog.isNumber = function(a) {
    return "number" == typeof a
};
goog.isFunction = function(a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            d;
        for (d in a) b[d] = goog.cloneObject(a[d]);
        return b
    }
    return a
};
goog.bindNative_ = function(a, b, d) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, d) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var c = Array.prototype.slice.call(arguments, 2);
        return function() {
            var d = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(d, c);
            return a.apply(b, d)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};
goog.bind = function(a, b, d) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
    var d = Array.prototype.slice.call(arguments, 1);
    return function() {
        var b = Array.prototype.slice.call(arguments);
        b.unshift.apply(b, d);
        return a.apply(this, b)
    }
};
goog.mixin = function(a, b) {
    for (var d in b) a[d] = b[d]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval)
        if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                d = b.createElement("script");
            d.type = "text/javascript";
            d.defer = !1;
            d.appendChild(b.createTextNode(a));
            b.body.appendChild(d);
            b.body.removeChild(d)
        } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
    var d = function(a) {
            return goog.cssNameMapping_[a] || a
        },
        c = function(a) {
            a = a.split("-");
            for (var b = [], c = 0; c < a.length; c++) b.push(d(a[c]));
            return b.join("-")
        },
        c = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? d : c : function(a) {
            return a
        };
    return b ? a + "-" + c(b) : c(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
    var d = b || {},
        c;
    for (c in d) {
        var e = ("" + d[c]).replace(/\$/g, "$$$$");
        a = a.replace(RegExp("\\{\\$" + c + "\\}", "gi"), e)
    }
    return a
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(a, b, d) {
    goog.exportPath_(a, b, d)
};
goog.exportProperty = function(a, b, d) {
    a[b] = d
};
goog.inherits = function(a, b) {
    function d() {}
    d.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new d;
    a.prototype.constructor = a
};
goog.base = function(a, b, d) {
    var c = arguments.callee.caller;
    if (c.superClass_) return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
        if (g.prototype[b] === c) f = !0;
        else if (f) return g.prototype[b].apply(a, e);
    if (a[b] === c) return a.constructor.prototype[b].apply(a, e);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
var boycoy = {
        Hovers: {}
    },
    Hovers = function() {
        $(".logoContainer .over .head").hide();
        $(".logoContainer .shape").hover(function(a) {
            a = $(a.currentTarget);
            a.parent().find(".out .head").stop().fadeTo("fast", 0);
            a.parent().find(".over .head").stop().fadeTo("fast", 1)
        }, function(a) {
            a = $(a.currentTarget);
            a.parent().find(".out .head").stop().fadeTo("fast", 1);
            a.parent().find(".over .head").stop().fadeTo("fast", 0)
        });
        $(".fb .over").css("opacity", 0);
        $(".fb").hover(function(a) {
            $(".fb .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".fb .over").stop().fadeTo(200,
                0)
        });
        $(".am .over").css("opacity", 0);
        $(".am").hover(function(a) {
            $(".am .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".am .over").stop().fadeTo(200, 0)
        });
        $(".tw .over").css("opacity", 0);
        $(".tw").hover(function(a) {
            $(".tw .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".tw .over").stop().fadeTo(200, 0)
        });
        $(".download .over").css("opacity", 0);
        $(".download").hover(function(a) {
            $(".download .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".download .over").stop().fadeTo(200, 0)
        });
        $(".ad .linkedin .over").css("opacity",
            0);
        $(".ad .linkedin").hover(function(a) {
            $(".ad .linkedin .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".ad .linkedin .over").stop().fadeTo(200, 0)
        });
        $(".jb .linkedin .over").css("opacity", 0);
        $(".jb .linkedin").hover(function(a) {
            $(".jb .linkedin .over").stop().fadeTo(200, 1)
        }, function(a) {
            $(".jb .linkedin .over").stop().fadeTo(200, 0)
        })
    };
var andrzejdus = {
    utils: {}
};
andrzejdus.utils.Utils = {};
var Utils = {
    delegate: function(a, b) {
        return function() {
            return b.apply(a, arguments)
        }
    },
    getComputedStyle: function(a, b) {
        return a.currentStyle ? a.currentStyle[b] : window.getComputedStyle(a)[b]
    },
    addEventListener: function(a, b, d) {
        a.addEventListener ? a.addEventListener(b, d) : a.attachEvent && a.attachEvent(b, d)
    },
    removeEventListener: function(a, b, d) {
        a.removeEventListener ? a.removeEventListener(b, d) : a.detachEvent && a.detachEvent(b, d)
    }
};
boycoy.ParallaxerGroup = {};
var ParallaxerGroup = function(a, b, d, c) {
    ParallaxerGroup.HORIZONTAL = "horizontal";
    ParallaxerGroup.VERTICAL = "vertical";
    var e = null,
        f = Utils.delegate(this, function() {
            void 0 === c && (c = ParallaxerGroup.VERTICAL);
            var a = $(b).first().css("top");
            e = Number("auto" === a ? 0 : a.replace(/px/, ""));
            $(b).first().css("top", "0");
            $(b).first().css("height", "0")
        });
    this.add = function(b, f) {
        return a.addElement($(b).get(0), d * f, e, c)
    };
    this.getContainerVisiblePosition = function() {
        return e
    };
    this.getReferenceSpeed = function() {
        return d
    };
    f()
};
andrzejdus.utils.RequestAnimationFrame = {};
(function() {
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], d = 0; d < b.length && !window.requestAnimationFrame; ++d) window.requestAnimationFrame = window[b[d] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[d] + "CancelAnimationFrame"] || window[b[d] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b, d) {
        var f = (new Date).getTime(),
            g = Math.max(0, 16 - (f - a)),
            m = window.setTimeout(function() {
                b(f + g)
            }, g);
        a = f + g;
        return m
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame =
        function(a) {
            clearTimeout(a)
        })
})();
andrzejdus.utils.events = {};
andrzejdus.utils.events.EventManager = {};

function EventManager(a) {
    var b = [];
    this.addEventListener = function(a) {
        a instanceof Function ? b.push(a) : console.error("Couldn't add event listener. Target isn't a function.")
    };
    this.removeEventListener = function(a) {
        if (a instanceof Function) {
            for (var c = [], e = 0; e < b.length; e++) {
                var f = b[e];
                f !== a && c.push(f)
            }
            b = c
        } else console.error("Couldn't remove event listener. Target isn't a function.")
    };
    this.dispatch = function(d) {
        a && console.log("Dispatching to event listeners. Targets serialization: " + JSON.stringify(b));
        for (var c =
                0; c < b.length; c++) b[c].apply(this, arguments)
    }
};
andrzejdus.utils.events.EventsManager = {};

function EventsManager(a) {
    var b = {};
    this.registerType = function(d) {
        a && console.log('Registering type "' + d + '".');
        void 0 === b[d] ? b[d] = new EventManager(a) : console.error('Type "' + JSON.stringify(d) + '" already registered.')
    };
    this.addEventListener = function(d, c) {
        a && console.log('Adding event listener for "' + d + '".');
        b[d] ? b[d].addEventListener(c) : console.error("Couldn't add event. Type \"" + JSON.stringify(d) + '" doesn\'t exist. Please use "registerType" method first.')
    };
    this.removeEventListener = function(d, c) {
        a && console.log('Removing event listener for "' +
            d + '".');
        b[d] ? b[d].removeEventListener(c) : console.error("Couldn't remove event. Type \"" + JSON.stringify(d) + '" doesn\'t exist. Please use "registerType" method first.')
    };
    this.dispatch = function(d) {
        a && console.log('Dispatching to event listeners for "' + d + '". Event managers serialization: ' + JSON.stringify(b));
        if (b[d]) {
            var c = Array.prototype.slice.call(arguments);
            c.shift();
            b[d].dispatch.apply(this, c)
        } else console.error("Couldn't dispatch event. Type \"" + JSON.stringify(d) + '" doesn\'t exist. Please use "registerType" method first.')
    }
};
andrzejdus.utils.Log = {};
var DEBUG = !0,
    Log = function() {
        this.l = function(a) {
            try {
                console
            } catch (b) {
                console = {}
            }
            if (DEBUG && console && console.log) {
                var d = Error();
                if ((d = d ? d.stack : null) && console.groupCollapsed && console.groupEnd) {
                    var c = 2;
                    0 <= d.search("Error") && (c = 3);
                    var e = null;
                    d.split("\n").length >= c && (e = d.split("\n"));
                    console.groupCollapsed(a + " [" + e[c - 1].split("/").pop().replace(/\)*\n\s*/g, "") + "]");
                    console.log(d.replace(/^Error/, "STACK TRACE"));
                    console.groupEnd()
                } else console.log(a)
            }
        };
        return this
    }();
andrzejdus.parallaxer = {};
andrzejdus.parallaxer.ParallaxerEvent = {};
var ParallaxerEvent = function(a) {
    this.source = a
};
ParallaxerEvent.CURRENT_POSITION_CHANGED = "current_position_changed";
ParallaxerEvent.TARGET_POSITION_CHANGED = "target_position_changed";
ParallaxerEvent.AFTER_FIRST_DRAW = "after_first_draw";
ParallaxerEvent.AFTER_LOOP_STOP = "after_loop_stop";
andrzejdus.utils.Looper = {};
var Looper = function(a) {
    var b = !1,
        d = null,
        c = null;
    this.start = function() {
        !1 === b && (b = !0, c = (new Date).getTime() - 1, e())
    };
    this.stop = function() {
        !0 === b && (b = !1)
    };
    var e = function() {
        if (!0 === b) {
            var f = (new Date).getTime();
            d = f - c;
            c = f;
            requestAnimationFrame(e);
            a(d)
        }
    }
};
andrzejdus.parallaxer.drawer = {};
andrzejdus.parallaxer.drawer.Cache = {};
var Cache = function(a) {
    var b = {};
    this.get = function(d) {
        var c = b[d];
        c || (c = a(d), b[d] = c);
        return c
    }
};
andrzejdus.parallaxer.drawer.VisibilityChecker = {};
var VisibilityChecker = function() {
    var a = null,
        b = null,
        d = Utils.delegate(this, function() {
            e();
            $(window).on("resize", c)
        });
    this.isVisible = function(c, d) {
        var e = !1;
        if (c >= a && c <= b || d >= a && d <= b || c < a && d > b) e = !0;
        return e
    };
    var c = function() {
            e()
        },
        e = function() {
            a = 0;
            b = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight
        };
    d()
};
andrzejdus.parallaxer.drawer.DrawerObject = {};
var DrawerObject = function(a, b, d) {
    var c = !0;
    this.getElement = function() {
        return a
    };
    this.getOffset = function() {
        return d
    };
    this.setOffset = function(a) {
        d = a
    };
    this.getType = function() {
        return b
    };
    this.isVisible = function() {
        return c
    };
    this.updateVisibility = function(a) {
        c = a
    }
};
DrawerObject.HORIZONTAL = "horizontal";
DrawerObject.VERTICAL = "vertical";
andrzejdus.parallaxer.drawer.Drawer = {};
var Drawer = function() {
    var a = Modernizr.prefixed("transform"),
        b = a ? !0 : !1,
        d = {},
        c = {},
        e = null,
        f = new VisibilityChecker,
        g = Utils.delegate(this, function() {
            e = new Cache(function(a) {})
        });
    this.addObject = function(a, b, e, f) {
        d[a] = new DrawerObject(b, e, f);
        c = {}
    };
    this.startFrame = function() {
        c = {}
    };
    this.updateOffset = function(a, b) {
        var g = d[a];
        if (g) {
            g.setOffset(b);
            var h = g.getElement();
            g.updateVisibility(f.isVisible(g.getOffset(), e.get(h)));
            c[a] = g
        } else console.error("Unknown object id " + a)
    };
    this.draw = Utils.delegate(this, function() {
        for (var d in c) {
            var e =
                c[d],
                f = e.getElement();
            f && (b ? f.style[a] = "translate" + (e.getType() === DrawerObject.HORIZONTAL ? "X" : "Y") + "(" + e.getOffset() + "px) translateZ(0px)" : f.style[e.getType() === DrawerObject.HORIZONTAL ? "left" : "top"] = e.getOffset() + "px")
        }
    });
    g()
};
andrzejdus.parallaxer.Parallaxer = {};
var Parallaxer = function(a) {
    var b = null,
        d = null,
        c = null,
        e = null,
        f = null,
        g = [],
        m = new Drawer,
        k = null,
        l = Utils.delegate(this, function() {
            e = c = a;
            b = new EventsManager;
            b.registerType(ParallaxerEvent.CURRENT_POSITION_CHANGED);
            b.registerType(ParallaxerEvent.TARGET_POSITION_CHANGED);
            b.registerType(ParallaxerEvent.AFTER_FIRST_DRAW);
            b.registerType(ParallaxerEvent.AFTER_LOOP_STOP);
            f = d = !1;
            k = new Looper(h)
        });
    this.addEventListener = function(a, c) {
        b.addEventListener(a, c)
    };
    this.removeEventListener = function(a, c) {
        b.removeEventListener(a,
            c)
    };
    this.addElement = function(a, b, c, e) {
        var f = null;
        a && (f = {
            id: g.length,
            element: a,
            speed: b,
            type: e,
            scrollOffset: c
        }, g.push(f));
        d = !1;
        return f
    };
    this.refresh = function() {
        n(0, !0)
    };
    this.isSmoothScrollEnabled = function() {
        return f
    };
    this.setSmoothScrollEnabled = function(a) {
        f = a
    };
    this.getCurrentScrollPosition = function() {
        return c
    };
    this.getTargetScrollPosition = function() {
        return e
    };
    this.setTargetScrollPosition = function(a) {
        e !== a && (e = a, b.dispatch(ParallaxerEvent.TARGET_POSITION_CHANGED, new ParallaxerEvent(this)), d && k.start())
    };
    var h = Utils.delegate(this, function(a) {
            !1 === n(a, !1) && (k.stop(), b.dispatch(ParallaxerEvent.AFTER_LOOP_STOP, new ParallaxerEvent(this)))
        }),
        n = Utils.delegate(this, function(a, q) {
            var h = e - c,
                l = Math.abs(h),
                k = !1;
            if (0.2 < l || q) {
                if (!1 === d)
                    for (var n in g) {
                        var k = g[n],
                            t = k.element,
                            u = 0,
                            x = Utils.getComputedStyle(t, k.type == Parallaxer.HORIZONTAL ? "left" : "top");
                        "auto" !== x && (u += Number(x.replace(/px/, "")), t.style[k.type == Parallaxer.HORIZONTAL ? "left" : "top"] = "0");
                        k.initialVisiblePosition = u;
                        m.addObject(k.id, t, k.type === Parallaxer.HORIZONTAL ?
                            DrawerObject.HORIZONTAL : DrawerObject.VERTICAL, 0)
                    }
                k = !0;
                f ? (h = h / 30 * (a / (1E3 / 60)), 1 > Math.abs(h) && (h = 1 * (0 < h ? 1 : -1)), c += h, 0 > l - Math.abs(h) && (c = e)) : c = e;
                b.dispatch(ParallaxerEvent.CURRENT_POSITION_CHANGED, new ParallaxerEvent(this));
                m.startFrame();
                var l = c,
                    y;
                for (y in g) h = g[y], m.updateOffset(h.id, Math.floor(h.initialVisiblePosition + (h.scrollOffset - l) * h.speed));
                m.draw();
                !1 === d && (d = !0, b.dispatch(ParallaxerEvent.AFTER_FIRST_DRAW, new ParallaxerEvent(this)))
            }
            return k
        });
    l()
};
Parallaxer.HORIZONTAL = "horizontal";
Parallaxer.VERTICAL = "vertical";
boycoy.ParallaxeLoader = {};
var ParallaxeLoader = function(a, b) {
    var d = null,
        c = {},
        e = null,
        f = null,
        g = $(document),
        m = Utils.delegate(this, function() {
            d = new Parallaxer(-1500);
            c.preloader = new ParallaxerGroup(d, ".page0", 0.45);
            c.preloader.add(".page0 .layer.starsBack", 0.7);
            c.preloader.add(".page0 .layer.starsFront", 0.8);
            c.preloader.add(".page0 .layer.ufo", 0.9);
            c.preloader.add(".page0 .layer.logo", 1);
            c.home = new ParallaxerGroup(d, ".page1", 0.45);
            c.home.add(".page1 .layer.background", 1);
            c.home.add(".page1 .layer.big-planet", 1);
            c.home.add(".page1 .layer.hello", 1);
            c.home.add(".page1 .layer.robbo", 1.25);
            c.home.add(".page1 .layer.header",
                1.65);
            c.home.add(".page1 .layer.main.mainLeft", 1.65);
            c.home.add(".page1 .layer.main.mainRight", 1.65);
            c.apps = new ParallaxerGroup(d, ".page2", 0.45);
            c.apps.add(".page2 .layer.background", 1);
            c.home.add(".page2 .layer.clouds3", 1.25);
            c.home.add(".page2 .layer.clouds4", 1.45);
            c.apps.add(".page2 .layer.mainCenter", 1.6);
            //c.apps.add(".page2 .layer.mainLeft", 2.1);
            c.apps.add(".page2 .layer.mainRight", 2.1);
            c.apps.add(".page2 .layer.header", 1.4);
            var a = 1.5;
            c.about = new ParallaxerGroup(d, ".page3", 0.45 * a);
            c.about.add(".page3 .layer.background",
                1);
            c.about.add(".page3 .layer.mountains2", 1.15);
            c.about.add(".page3 .layer.mountains1", 1.4);
            c.about.add(".page3 .layer.header", 1.5);
            c.about.add(".page3 .layer.mainCenter", 1.6);
            c.about.add(".page3 .layer.mainRight", 1.8);
            c.about.add(".page3 .layer.paperWhite", 1.9);
            c.about.add(".page3 .layer.paperYellow", 2.1);
            e = c.contact = new ParallaxerGroup(d, ".page4", 0.45 * 1.55 * a);
            c.contact.add(".page4 .layer.background3", 1);
            c.contact.add(".page4 .layer.background2", 1.15);
            c.contact.add(".page4 .layer.background1", 1.3);
            c.contact.add(".page4 .layer.header", 1.45);
            c.contact.add(".page4 .layer.mainLeft", 1.45);
            c.contact.add(".page4 .layer.mainRight", 1.45);
            f = c.contact.add(".page4 .layer.mainBottom", 1.45);
            (new ParallaxerGroup(d, ".page4", -0.13, ParallaxerGroup.HORIZONTAL)).add(".page4 .layer.background1 .wave", 1);
            (new ParallaxerGroup(d, ".page4", 0.08, ParallaxerGroup.HORIZONTAL)).add(".page4 .layer.background2 .wave", 1);
            (new ParallaxerGroup(d, ".page4", -0.03, ParallaxerGroup.HORIZONTAL)).add(".page4 .layer.background3 .wave",
                1);
            !1 === Modernizr.touch && d.setSmoothScrollEnabled(!0)
        });
    this.init = function() {
        d.refresh();
        n()
    };
    this.start = function() {
        $(window).on("scroll", k);
        $(window).on("resize", l);
        k()
    };
    this.getParallaxer = function() {
        return d
    };
    this.getGroupScrollPosition = function(a) {
        var b = 0;
        c[a] && (b = c[a].getContainerVisiblePosition());
        return b
    };
    var k = function() {
            var a = g.scrollTop();
            d.setTargetScrollPosition(a);
            h(a)
        },
        l = function() {
            n();
            d.refresh();
            h(g.scrollTop())
        },
        h = Utils.delegate(this, function(b) {
            var d = $(window).height() / 2;
            b + d / c.apps.getReferenceSpeed() <
                this.getGroupScrollPosition("apps") ? a.saveLocation("home") : b + d / c.about.getReferenceSpeed() < this.getGroupScrollPosition("about") ? a.saveLocation("apps") : b + d / c.contact.getReferenceSpeed() < this.getGroupScrollPosition("contact") ? a.saveLocation("about") : a.saveLocation("contact")
        }),
        n = function() {
            var a = f.speed,
                a = e.getContainerVisiblePosition() + $(window).height() + (f.initialVisiblePosition + 173 - $(window).height()) / a;
            $(".streacher").height(a)
        };
    m()
};
boycoy.linkUnderliner = {};
boycoy.linkUnderliner.UnderlineCreator = {};
var UnderlineCreator = function(a) {
    this.SHOW = "show";
    this.HIDE = "hide";
    var b = null,
        d = !1,
        c = !1,
        e = !1,
        f = null,
        g = null,
        m = Utils.delegate(this, function() {
            b = new EventsManager;
            b.registerType(this.SHOW);
            b.registerType(this.HIDE);
            a.find(".text").before('<div class="linkLineContainer"><div class="linkLine"></div></div>');
            a.find(".image .over").css("opacity", 0);
            f = a.css("color");
            a.hover(function(a) {
                d = !0;
                !1 === c && k()
            }, function(a) {
                d = !1;
                !1 === e && l()
            })
        });
    this.addEventListener = function(a, c) {
        b.addEventListener(a, c)
    };
    var k = Utils.delegate(this,
            function() {
                if (!1 === e) {
                    g = a.find(".text").width();
                    e = !0;
                    a.find(".text").stop().animate({
                        color: "#ffffff"
                    }, 250);
                    b.dispatch(this.SHOW, {
                        containerElement: a,
                        duration: 250
                    });
                    var c = a.find(".linkLine");
                    c.css("margin-left", 0);
                    c.stop().animate({
                        width: g
                    }, 250, function() {
                        e = !1;
                        !1 === d && l()
                    })
                }
            }),
        l = Utils.delegate(this, function(e) {
            !1 === c && (c = !0, a.find(".text").stop().animate({
                color: f
            }, 250), b.dispatch(this.HIDE, {
                containerElement: a,
                duration: 250
            }), a.find(".linkLine").stop().animate({
                "margin-left": g,
                width: 0
            }, 250, function() {
                c = !1;
                !0 === d && k(e)
            }))
        });
    m()
};
boycoy.linkUnderliner.LinkUnderliner = {};
var LinkUnderliner = function(a) {
    var b = [];
    this.addEventListener = function(a, c) {
        for (var e = 0; e < b.length; e++) b[e].addEventListener(a, c)
    };
    (function() {
        $("." + a).each(function(a, c) {
            b.push(new UnderlineCreator($(c)))
        })
    })()
};
boycoy.Baloons = {};
// var Baloons = function() {
//     var a = $(".page2 .baloonLeft"),
//         b = $(".page2 .baloonCenter"),
//         d = $(".page2 .baloonRight"),
//         c = function() {
//             a.stop().animate({
//                 rotate: "-35deg"
//             }, 1E4, function() {
//                 a.stop().animate({
//                     rotate: "-25deg"
//                 }, 1E4)
//             })
//         },
//         e = function() {
//             b.stop().animate({
//                 rotate: "5deg"
//             }, 7500, function() {
//                 b.stop().animate({
//                     rotate: "-5deg"
//                 }, 7500)
//             })
//         },
//         f = function() {
//             d.stop().animate({
//                 rotate: "35deg"
//             }, 9E3, function() {
//                 d.stop().animate({
//                     rotate: "25deg"
//                 }, 9E3)
//             })
//         };
//     (function() {
//         c();
//         setInterval(function() {
//             c()
//         }, 2E4);
//         e();
//         setInterval(function() {
//             e()
//         }, 15E3);
//         f();
//         setInterval(function() {
//             f()
//         }, 18E3)
//     })()
// };
boycoy.Envelope = {};
var Envelope = function() {
    var a = $(".page4 .envelopeOut"),
        b = [],
        d = [];
    (function() {
        b.push($(".page4 .letter button"));
        for (var c = 0; c < b.length; c++) d.push(!1);
        a.on("click mousemove", function(a) {
            for (var c = 0; c < b.length; c++) {
                var g = b[c],
                    m = g.offset().top,
                    k = m + g.height(),
                    l = g.offset().left,
                    h = l + g.width(),
                    n = !1;
                a.pageX >= l && a.pageX <= h && (n = !0);
                l = !1;
                a.pageY >= m && a.pageY <= k && (l = !0);
                n && l ? (g.trigger(a.type), !1 == d[c] && (d[c] = !0, g.trigger("mouseover"))) : !0 == d[c] && (d[c] = !1, g.trigger("mouseout"))
            }
        })
    })()
};
boycoy.Mail = {};
var Mail = function() {
    var a = 20,
        b = !0,
        d = !1,
        c = $(".page4 .letterWrapper"),
        e = $(".page4 .letter"),
        f = e.find(".underline").css("backgroundColor"),
        g = c.css("top"),
        m = e.find(".mailNameContainer"),
        k = e.find(".mailFromContainer"),
        l = e.find(".mailContentContainer"),
        h = m.find("input"),
        n = k.find("input"),
        p = l.find("textarea").first();
    this.getOverPosition = function() {
        return a
    };
    this.increaseOverPosition = function(b) {
        a += b
    };
    var q = function(a) {
            e.show();
            e.stop().animate({
                top: 0
            }, 1300, function() {
                b = !0;
                d && v();
                a && a()
            })
        },
        s = function(a) {
            r();
            b = !1;
            e.stop().animate({
                top: 255
            }, 1300, function() {
                e.hide();
                a && a()
            })
        },
        v = Utils.delegate(this, function() {
            b && c.stop().animate({
                top: a
            }, 1E3, "easeOutBack", Utils.delegate(this, function() {}))
        }),
        r = Utils.delegate(this, function() {
            b && c.stop().animate({
                top: g
            }, 1E3)
        }),
        w = function() {
            $(".page4 .envelopes").hover(function(a) {
                d = !0;
                v()
            }, function(a) {
                d = !1;
                0 === e.find("input, textarea").filter(":focus").length && r()
            });
            $(".page4").click(function() {
                !1 === d && r()
            })
        },
        t = function(a, b) {
            "true" !== a.data("isErrorSet") && (a.data("isErrorSet",
                "true"), console.log(b), a.find(".underline").delay(b).animate({
                backgroundColor: "#ff0000"
            }, 400), a.find(".exclamationMark").delay(b).fadeIn(400))
        },
        u = function(a) {
            "true" === a.data("isErrorSet") && (a.data("isErrorSet", "false"), a.find(".underline").animate({
                backgroundColor: f
            }, 400), a.find(".exclamationMark").fadeOut(400))
        };
    (function() {
        new Envelope;
        e.find(".exclamationMark").hide();
        e.find(".mailSendContainer .mailSending").hide();
        e.find(".mailSendContainer .mailSent").hide();
        e.find(".mailSendContainer .mailError").hide();
        $(".page4 .letterSent .goBack").click(function() {
            $(".page4 .letterSent").fadeOut(function() {
                h.val("");
                n.val("");
                p.val("");
                q()
            })
        });
        $(".page4 .letterError .goBack").click(function() {
            $(".page4 .letterError").fadeOut(function() {
                q()
            })
        });
        var a = e.find(".mailSendContainer button"),
            b = a.css("background-color");
        a.hover(function(b) {
            b.stopPropagation();
            a.stop().animate({
                "background-color": "#363632"
            })
        }, function(c) {
            c.stopPropagation();
            a.stop().animate({
                "background-color": b
            })
        });
        a.click(function() {
            var a = h.val(),
                b =
                n.val(),
                c = p.val(),
                d = !1;
            if (0 < a.length && 0 < b.length && 0 < c.length) d = !0;
            else {
                var e = 0;
                !(0 < a.length) && "true" !== m.data("isErrorSet") && (t(m, 400 * e), e++);
                !(0 < b.length) && "true" !== k.data("isErrorSet") && (t(k, 400 * e), e++);
                !(0 < c.length) && "true" !== l.data("isErrorSet") && (t(l, 400 * e), e++)
            }!0 === d && s(function() {
                var d = JSON.stringify({
                        name: a,
                        from: b,
                        content: c
                    }),
                    e = !1;
                $.get("sendmail.php", {
                    data: d
                }).success(function() {
                    e = !0;
                    $(".page4 .letterSending").fadeOut(function() {
                        $(".page4 .letterSent").fadeIn()
                    })
                }).error(function() {
                    e = !0;
                    $(".page4 .letterSending").fadeOut(function() {
                        $(".page4 .letterError").fadeIn()
                    })
                });
                setTimeout(function() {
                    !1 === e && $(".page4 .letterSending").fadeIn()
                }, 100)
            })
        });
        e.find("input, textarea").keypress(function(a) {
            $(a.target.parentNode);
            u($(a.target).closest(m));
            u($(a.target).closest(k));
            u($(a.target).closest(l))
        });
        w()
    })()
};
boycoy.MailFieldExpander = {};
var MailFieldExpander = function(a) {
    var b = $(".page4 .letterWrapper"),
        d = $(".page4 .letter"),
        c = d.find(".letterBackground .shape"),
        e = d.find(".mailContentContainer"),
        f = e.find("textarea"),
        g = e.find(".underline").last(),
        m = g,
        k = 2,
        l = d.find("input").height() + 5,
        h = $("<div></div>");
    h.addClass("preWrap");
    h.css("position", "relative");
    h.css("z-index", "100");
    h.css("font-family", f.css("font-family"));
    h.css("font-size", f.css("font-size"));
    h.css("letter-spacing", f.css("letter-spacing"));
    h.css("line-height", f.css("line-height"));
    h.css("width", f.width());
    h.css("visibility", "hidden");
    d.append(h);
    var n = function(a) {
            var b = $(a.target),
                c = null;
            if ("keypress" === a.type) {
                c = b.val().substring(0, s(b));
                switch (a.which) {
                    case 8:
                        c = c.substring(0, c.length - 1);
                        break;
                    case 13:
                        c += "<br />&nbsp;";
                        break;
                    default:
                        c += String.fromCharCode(a.which)
                }
                c += b.val().substring(s(b));
                c = c.replace(/\n/g, "<br />")
            } else c = b.val().replace(/\n$/g, "<br />&nbsp;").replace(/\n/g, "<br />");
            h.html(c);
            b = Math.round(h.height() / 27);
            0 !== b - k && 6 < b && a.preventDefault();
            p()
        },
        p = function() {
            var d =
                Math.round(h.height() / 27),
                g = k;
            0 !== d - k && (g = 6 < d ? 6 : 2 > d ? 2 : d);
            d = g - k;
            if (0 !== d) {
                k = g;
                for (g = 0; g < Math.abs(d); g++) 0 < d ? q() : (e.find(".underline").last().remove(), e.find("br").last().remove(), m = e.find(".underline").last(), a.increaseOverPosition(l), b.stop().animate({
                    top: a.getOverPosition() + "px"
                }, 250), c.height(c.height() - l));
                f.css("height", k * l + 1)
            }
        },
        q = function() {
            var d = g.clone();
            m.after(d);
            m.after("<br />");
            m = d;
            a.increaseOverPosition(-l);
            b.stop().animate({
                top: a.getOverPosition() + "px"
            }, 250, function() {});
            c.height(c.height() +
                l)
        },
        s = function(a) {
            var b = 0;
            a = $(a).get(0);
            if (document.selection) {
                a.focus();
                var b = document.selection.createRange(),
                    c = document.selection.createRange().text.length;
                b.moveStart("character", -a.value.length);
                b = b.text.length - c
            } else if (a.selectionStart || "0" == a.selectionStart) b = a.selectionStart;
            return b
        };
    Utils.delegate(this, function() {
        p();
        f.on("keypress keyup change paste cut drop", n)
    })()
};
boycoy.Menu = {};
var Menu = function() {
    this.MENU_CLICKED = "menu_clicked";
    var a = null,
        b = null,
        d = Utils.delegate(this, function() {
            a = new EventsManager;
            a.registerType(this.MENU_CLICKED);
            var c = {
                    home: Number($(".menus .menu.home .over").css("width").replace(/px$/, "")),
                    apps: Number($(".menus .menu.apps .over").css("width").replace(/px$/, "")),
                    about: Number($(".menus .menu.about .over").css("width").replace(/px$/, "")),
                    contact: Number($(".menus .menu.contact .over").css("width").replace(/px$/, ""))
                },
                d = Number($(".menus").css("height").replace(/px$/, ""));
            $(".menus .menu .over").css("opacity", 0);
            $(".menus .menu .over .background").css("width", 0);
            $(".menus .menu .over .background").css("height", 0);
            $(".menus .menu").each(function(a, b) {
                var m = b.className.split(" ")[1];
                $(b).find(".over .background").css("margin-left", Math.floor(c[m] / 2));
                $(b).find(".over .background").css("margin-top", d / 2)
            });
            $(".menus .menu .selected").css("opacity", 0);
            $(".menus .menu").hover(function(a) {
                a = $(a.currentTarget);
                if (!1 === a.hasClass(b)) {
                    var g = a.attr("class").split(" ")[1];
                    a.find(".over").stop().fadeTo(200,
                        1);
                    a.find(".over .background").stop().animate({
                        width: c[g],
                        height: d,
                        "margin-left": "0px",
                        "margin-right": "0px",
                        "margin-top": "0px"
                    }, 200, "swing")
                }
            }, function(a) {
                a = $(a.currentTarget);
                if (!1 === a.hasClass(b)) {
                    var g = a.attr("class").split(" ")[1];
                    a.find(".over").stop().fadeTo(200, 0);
                    a.find(".over .background").stop().animate({
                        width: 0,
                        height: 0,
                        "margin-left": Math.floor(c[g] / 2),
                        "margin-right": Math.ceil(c[g] / 2),
                        "margin-top": d / 2
                    }, 200, "swing")
                }
            });
            $(".menus .menu").click(Utils.delegate(this, function(b) {
                b = $(b.currentTarget).attr("class").split(" ")[1];
                a.dispatch(this.MENU_CLICKED, {
                    name: b
                })
            }))
        });
    this.addEventListener = function(b, d) {
        a.addEventListener(b, d)
    };
    this.setSelected = function(a, d) {
        d ? $(d + ".menus .menu." + a).off() : b = a;
        $(d + ".menus .menu .over").stop().fadeTo(200, 0);
        $(d + ".menus .menu .selected").stop().fadeTo(200, 0);
        $(d + ".menus .menu." + a + " .selected").stop().fadeTo(200, 1)
    };
    d()
};
boycoy.locationHandler = {};
boycoy.locationHandler.LocationHandler = {};
var LocationHandler = function() {
    this.LOCATION_CHANGED = "location_changed";
    var a = null,
        b = !0,
        d = Utils.delegate(this, function() {
            a = new EventsManager;
            a.registerType(this.LOCATION_CHANGED);
            $(window).on("hashchange", c)
        });
    this.addEventListener = function(b, c) {
        a.addEventListener(b, c)
    };
    this.getLocation = function() {
        return window.location.href.split("#")[1]
    };
    this.goToLocation = function(a) {
        var c = window.location.href.split("#");
        c[1] !== a && (b = !1, c[1] = a, window.location.href = c.join("#"))
    };
    this.saveLocation = function(a) {
        var d =
            window.location.href.split("#");
        d[1] !== a && (b = !1, d[1] = a, $(window).off("hashchange", c), window.location.href = d.join("#"), $(window).on("hashchange", c))
    };
    var c = function() {
            b && e();
            b = !0
        },
        e = Utils.delegate(this, function() {
            a.dispatch(this.LOCATION_CHANGED, {
                name: window.location.href.split("#")[1] || ""
            })
        });
    d()
};
// boycoy.slideShow = {};
// boycoy.slideShow.SlideShow = {};
// var SlideShow = function(a, b, d) {
//     var c = null,
//         e = null,
//         f = function(a) {
//             k(a.target)
//         },
//         g = function(b) {
//             b = (e + 1) % a.length;
//             var d = a[b];
//             l(c, d);
//             c = d;
//             e = b
//         },
//         m = function(b) {
//             b = 0 <= e - 1 ? e - 1 : a.length - 1;
//             var d = a[b];
//             l(c, d);
//             c = d;
//             e = b
//         },
//         k = function(b, d) {
//             var g = h(b);
//             if (null === c || g != h(c.slide)) {
//                 var f = a[g];
//                 l(c, f, d);
//                 c = f;
//                 e = g
//             }
//         },
//         l = function(b, c, d) {
//             d = void 0 != d ? d : 600;
//             b && $(b.slide).css("z-index", 1);
//             $(c.slide).hide();
//             $(c.slide).css("z-index", 2);
//             for (var e = 0; e < a.length; e++) a[e] != b && a[e] != c && $(a[e].slide).css("z-index", 0);
//             $(c.slide).fadeIn(d, function() {});
//             null !== b && ($(b.indicatorOn).fadeOut(d), $(b.indicatorOff).fadeIn(d), $(b.activeArea).addClass("inactive"), $(b.activeArea).removeClass("active"));
//             $(c.indicatorOn).fadeIn(d);
//             $(c.indicatorOff).fadeOut(d);
//             $(c.activeArea).addClass("active");
//             $(c.activeArea).removeClass("inactive")
//         },
//         h = function(a) {
//             var b = null;
//             a && (a.dataset ? b = a.dataset.slide_index : (a = a.getAttribute("data-slide_index")) && (b = a));
//             return Number(b)
//         },
//         n = function(a, b) {
//             a && (a.dataset ? a.dataset.slide_index = b : a.setAttribute("data-slide_index", b))
//         };
//     (function() {
//         for (var c =
//                 0; c < a.length; c++) {
//             var e = a[c],
//                 h = e.slide,
//                 l = e.indicatorOn,
//                 r = e.indicatorOff,
//                 e = e.activeArea;
//             $(h).hide();
//             $(l).hide();
//             $(r).show();
//             n(h, c);
//             n(l, c);
//             n(r, c);
//             n(e, c);
//             $(e).addClass("inactive");
//             $(e).click(f)
//         }
//         $(d).click(g);
//         $(b).click(m);
//         //k(a[0].indicatorOff, 0)
//     })()
// };
boycoy.Screenshots = {};
var Screenshots = function() {
    var a = [];
    $(".screenshots img").each(function(b, d) {
        a.push({
            slide: d,
            indicatorOn: null,
            indicatorOff: null
        })
    });
    $(".indicators .indicator").each(function(b, d) {
        a[b].indicatorOn = $(d).find("img").first().get(0);
        a[b].indicatorOff = $(d).find("img").last().get(0);
        a[b].activeArea = d
    });
    var b = $(".screenshotsFrame .previous .visibleShape"),
        d = $(".screenshotsFrame .next .visibleShape");
    b.hide();
    d.hide();
    $(".screenshotsFrame .previous").hover(function() {
        b.stop().fadeTo(750, 1)
    }, function() {
        b.stop().fadeTo(750,
            0)
    });
    $(".screenshotsFrame .next").hover(function() {
        d.stop().fadeTo(750, 1)
    }, function() {
        d.stop().fadeTo(750, 0)
    });
    // new SlideShow(a, b, d)
};
// boycoy.RoboHand = {};
// var RoboHand = function() {
//     var a = $(".page3 .roboHand"),
//         b = a.find(".roboHandLeft"),
//         d = a.find(".roboHandRight"),
//         c = a.find(".sparkOne"),
//         e = a.find(".sparkTwo"),
//         f = a.find(".sparkThree"),
//         g = !1,
//         m = function() {
//             !1 === g && (isAnmating = !0, l(), k(function() {
//                 l();
//                 k(function() {
//                     setTimeout(function() {
//                         l();
//                         k(function() {
//                             g = !1
//                         })
//                     }, 400)
//                 })
//             }))
//         },
//         k = function(a) {
//             b.stop().animate({
//                 rotate: "5deg"
//             }, 150, "linear", function() {
//                 b.stop().animate({
//                     rotate: "0deg"
//                 }, 150, a)
//             });
//             d.stop().animate({
//                 rotate: "-5deg"
//             }, 150, "linear", function() {
//                 d.stop().animate({
//                         rotate: "0deg"
//                     }, 150,
//                     a)
//             })
//         },
//         l = function() {
//             c.css("display", "block");
//             setTimeout(function() {
//                 c.css("display", "none")
//             }, 60);
//             setTimeout(function() {
//                 e.css("display", "block");
//                 f.css("display", "block")
//             }, 50);
//             setTimeout(function() {
//                 e.css("display", "none");
//                 f.css("display", "none")
//             }, 100)
//         },
//         h = function() {
//             setTimeout(function() {
//                 m();
//                 h()
//             }, 6E4 * Math.random())
//         };
//     a.hover(function(a) {
//         m()
//     }, function(a) {});
//     h()
// };
boycoy.autoDrop = {};
// boycoy.autoDrop.AutoDrop = {};
// var AutoDrop = function(a, b, d) {
//     var c = null,
//         e = [],
//         f = function() {
//             var d = (c + (a.length - 1)) % a.length,
//                 f = a[d];
//             f.style.top = "-" + e[d] + "px";
//             $(f).css("opacity", 0);
//             for (f = 0; f < b + 1; f++) {
//                 var k = a[(d + f) % a.length],
//                     l = 1;
//                 f === b && (l = 0);
//                 $(k).animate({
//                     top: "+=" + e[d],
//                     opacity: l
//                 }, 1200)
//             }
//             c = 0 == c ? a.length - 1 : c - 1
//         };
//     (function() {
//         for (var b = c = 0, m = 0; m < a.length; m++) {
//             var k = a[m],
//                 l = e,
//                 h = m,
//                 n = k,
//                 p = Number($(n).height()),
//                 q = 0,
//                 s = 0;
//             $(n).css("marginTop") && (q = Number($(n).css("marginTop").replace(/px$/, "")));
//             $(n).css("marginBottom") && (s = Number($(n).css("marginBottom").replace(/px$/,
//                 "")));
//             l[h] = p + q + s;
//             k.style.position = "absolute";
//             k.style.top = b + "px";
//             b += e[m]
//         }
//         setInterval(f, d)
//     })()
// };
boycoy.Testimonials = {};
var Testimonials = function() {
    var a = [];
    $(".testimonial").each(function(b, d) {
        a.push(d)
    });
    //new AutoDrop(a, 3, 12E3)
};
boycoy.development = {};
boycoy.development.DragAndDrop = {};
var DragAndDrop = {
    lastX: null,
    lastY: null,
    activeElement: null,
    history: [],
    init: function() {
        window.onmousemove = Utils.delegate(this, function(a) {
            if (null !== this.activeElement) {
                var b = window.pageXOffset + a.clientX;
                a = window.pageYOffset + a.clientY;
                if (null !== this.lastX) {
                    var d = b - this.lastX,
                        c = window.getComputedStyle(this.activeElement).left.replace(/px/, ""),
                        c = parseInt("" !== c ? c : "0");
                    this.activeElement.style.left = c + d + "px"
                }
                if (null !== this.lastY) {
                    var d = a - this.lastY,
                        e = window.getComputedStyle(this.activeElement),
                        c = "auto" !=
                        e.bottom,
                        e = e[c ? "bottom" : "top"].replace(/px/, ""),
                        e = parseInt("" !== e ? e : "0");
                    this.activeElement.style[c ? "bottom" : "top"] = e + (c ? -1 : 1) * d + "px"
                }
                this.lastX = b;
                this.lastY = a
            }
        });
        window.addEventListener("mouseup", Utils.delegate(this, function(a) {
            this.lastY = this.lastX = this.activeElement = null
        }));
        window.addEventListener("keypress", Utils.delegate(this, function(a) {
            console.log(a.keyCode);
            if (48 <= a.keyCode && 57 >= a.keyCode) null !== this.activeElement && document.getElementById("layer" + (a.keyCode - 48)).getElementsByClassName("page1")[0].appendChild(this.activeElement);
            else if (122 === a.keyCode) {
                var b = this.history.pop();
                b && (console.log(b.name), $(b.name).each(function(a, c) {
                    c.style.left = b.left;
                    c.style.top = b.top;
                    c.style.bottom = b.bottom
                }))
            }
        }));
        $(".cloud").each(Utils.delegate(this, function(a, b) {
            this.add(b)
        }))
    },
    add: function(a) {
        a.addEventListener("mousedown", Utils.delegate(this, function(b) {
            document.getElementById("selectedImage").innerHTML = a.className;
            b.preventDefault();
            this.activeElement = b.target;
            this.history.push({
                name: "." + a.className.split(" ").join("."),
                left: a.style.left,
                top: a.style.top,
                bottom: a.style.bottom
            })
        }))
    }
};
boycoy.rotator = {};
boycoy.rotator.Rotator = {};
var Rotator = function(a, b) {
    var d = b(),
        c = [],
        e = 0,
        f = 0,
        g = null;
    this.start = function() {
        calculateForceIntervalId = setInterval(m, 200)
    };
    var m = function() {
            var a = b();
            c.push(a - d);
            d = a;
            5 < c.length && c.shift();
            for (var e = a = 0; e < c.length; e++) a += c[e];
            a /= c.length;
            f = Math.max(Math.abs(a / 8), f);
            f = 6 > f ? f : 6;
            0 < f && null === g && (g = setInterval(k, 40))
        },
        k = function() {
            0.02 < f ? (f -= 0.02, e += 0.05, a.style[Modernizr.prefixed("transform")] = "rotate(" + f * Math.sin(e) + "deg)") : (e = f = 0, null !== g && (clearInterval(g), g = null))
        }
};
boycoy.development.Dev = {};
var Dev = function() {
    this.checkAndInit = function() {
        -1 !== window.location.href.indexOf("#dev") && ($(".togglePage2Layer3").click(function(a, b) {
            "1000" === $("#page2_layer3").css("z-index") ? $("#page2_layer3").css("z-index", "") : $("#page2_layer3").css("z-index", "1000")
        }), $("body").css(Modernizr.prefixed("user-select"), "none"), DragAndDrop.init(), CssGenerator.init(), $(".devTools").show(), $(".devTools .testSpeedAll").click(function() {
            console.debug("Will start in 2 seconds...");
            $(".devTools").hide();
            scrollParallaxer.startTest(function(a,
                b) {
                $(".devTools").show();
                var d = "delta time: " + a + ", iteration time: " + a / b + ", fps: " + 1E3 * (b / a);
                console.debug(d);
                $(".devTools .testSpeedAll .lastResult").html(d)
            })
        }), console.debug("Dev tools initialized"))
    };
    return this
}();
boycoy.Robo = {};
var Robo = function() {
    var a = $(".page1 .armLeft"),
        b = $(".page1 .armRight"),
        d = function() {
            a.stop().animate({
                rotate: "10deg"
            }, 7500, function() {
                a.stop().animate({
                    rotate: "-3deg"
                }, 7500)
            })
        },
        c = function() {
            b.stop().animate({
                rotate: "-7deg"
            }, 1E4, function() {
                b.stop().animate({
                    rotate: "0deg"
                }, 1E4)
            })
        };
    (function() {
        d();
        setInterval(function() {
            d()
        }, 15E3);
        c();
        setInterval(function() {
            c()
        }, 2E4)
    })()
};
boycoy.development.CssGenerator = {};
var CssGenerator = {
    cache: "",
    init: function() {
        $(".generate").click(Utils.delegate(this, function(a) {
            console.log("fefefe");
            this.generate()
        }))
    },
    generate: function() {
        $(".cloud").each(Utils.delegate(this, function(a, b) {
            this.generateElement(b)
        }));
        console.log(this.cache)
    },
    generateElement: function(a) {
        var b = window.getComputedStyle(a).bottom,
            d = window.getComputedStyle(a).top;
        this.cache += "\n";
        this.cache += "." + $(a).attr("class").split(" ").join(".") + " {\n";
        this.cache += "  z-index: 2;\n";
        this.cache += "  position: absolute;\n";
        this.cache = "auto" != b ? this.cache + ("  bottom: " + b + ";\n") : this.cache + ("  top: " + d + ";\n");
        this.cache += "  left: " + window.getComputedStyle(a).left + ";\n";
        this.cache += "}\n"
    }
};
boycoy.Ufo = {};
var Ufo = function() {
    var a = $(".page0 .ufo img"),
        b = function() {
            a.animate({
                marginTop: "-=12px"
            }, {
                duration: 1250,
                queue: !1,
                complete: function() {
                    a.animate({
                        marginTop: "+=12px"
                    }, {
                        duration: 1250,
                        queue: !1
                    })
                }
            })
        },
        d = function() {
            a.animate({
                rotate: "2deg"
            }, {
                duration: 2250,
                queue: !1,
                complete: function() {
                    a.animate({
                        rotate: "-2deg"
                    }, {
                        duration: 2250,
                        queue: !1
                    })
                }
            })
        };
    (function() {
        b();
        setInterval(function() {
            b()
        }, 2500);
        d();
        setInterval(function() {
            d()
        }, 4500)
    })()
};
boycoy.scrollindicator = {};
boycoy.scrollindicator.ScrollIndicator = {};
var ScrollIndicator = function(a) {
    this.POSITION_CHANGED = "position_changed";
    var b = null,
        d = null,
        c = null,
        e = null,
        f = null,
        g = null,
        m = Utils.delegate(this, function() {
            b = new EventsManager;
            b.registerType(this.POSITION_CHANGED);
            e = !1;
            f = 0;
            c = Utils.getComputedStyle(a, "height").replace(/px$/, "");
            d = window.innerHeight;
            Utils.addEventListener(window, "resize", function() {
                d = window.innerHeight
            });
            var g = null,
                h = Modernizr.prefixed("user-select");
            Utils.addEventListener(a, "mousedown", function() {
                e = !0;
                g = $("body").css(Modernizr.prefixed("user-select"));
                !1 !== h && $("body").css(h, "none")
            });
            Utils.addEventListener(window, "mouseup", function() {
                e = !1;
                !1 !== h && $("body").css(h, g)
            });
            Utils.addEventListener(window, "mousemove", Utils.delegate(this, function(a) {
                p();
                e && (f = a.clientY / (d - c), l(), k())
            }));
            p()
        });
    this.addEventListener = function(a, c) {
        b.addEventListener(a, c)
    };
    this.setPosition = function(a) {
        !1 === e && (f = a, l())
    };
    var k = Utils.delegate(this, function() {
            b.dispatch(this.POSITION_CHANGED, {
                position: f
            })
        }),
        l = function() {
            0 > f ? f = 0 : 1 < f && (f = 1);
            a.style.top = f * (d - c) + "px";
            p()
        },
        h = !1,
        n = !1,
        p = function() {
            !0 === h && ($(a).stop(), h = !1);
            !1 === n && (n = !0, $(a).fadeTo(500, 1, function() {
                n = !1
            }));
            null !== g && clearTimeout(g);
            g = setTimeout(function() {
                g = null;
                !0 === n && ($(a).stop(), n = !1);
                !1 === h && (h = !0, $(a).fadeTo(1E3, 0, function() {
                    h = !1
                }))
            }, 2E3)
        };
    m()
};
boycoy.Main = {};
var Main = function() {
    var a = null,
        b = null,
        d = null,
        c = null,
        e = null,
        f = 0,
        g = 0,
        m = !1,
        k = !1,
        l = 0,
        h = function() {
            w();
            e ? ($("html").addClass("no-parallaxe"), $(".page1").attr("id", "home"), $(".page2").attr("id", "apps"), $(".page3").attr("id", "about"), $(".page4").attr("id", "contact")) : $("html").addClass("parallaxe");
            if (!1 == e) {
                var a = $(".page0 img");
                g = a.length;
                a.each(function(a, b) {
                    var c = $(b);
                    0 < c.height() ? p() : c.load(p)
                })
            } else q(), r()
        },
        n = function() {
            k = !0;
            !0 === m && !0 === k && r()
        },
        p = function() {
            f++;
            g === f && q()
        },
        q = function() {
            l = (new Date).getTime();
            $("body").addClass("preloader-ready");
            b = new Menu;
            b.setSelected("home", ".page1 ");
            b.setSelected("apps", ".page2 ");
            b.setSelected("about", ".page3 ");
            b.setSelected("contact", ".page4 ");
            !1 === e ? (a = new LocationHandler, d = new ParallaxeLoader(a, b), c = d.getParallaxer(), a.addEventListener(a.LOCATION_CHANGED, function(a) {
                a = d.getGroupScrollPosition(a.name);
                $(document).scrollTop(a)
            }), Modernizr.csstransforms && new Ufo, c.addEventListener(ParallaxerEvent.AFTER_FIRST_DRAW, s), d.init()) : v()
        },
        s = function() {
            c.removeEventListener(ParallaxerEvent.AFTER_FIRST_DRAW,
                v);
            v()
        },
        v = function() {
            !1 === e && $(".page0").hide();
            $(".page0").css("visibility", "visible");
            !1 === e && $(".page0").fadeIn(1E3, function() {
                m = !0;
                !0 === m && !0 === k && r()
            })
        },
        r = function() {
            (new Rotator($(".description").first().get(0), function() {
                return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop
            })).start();
            new Hovers;
            new Screenshots;
            new Testimonials;
            var b = new Mail;
            new MailFieldExpander(b);
            !1 === e && Modernizr.csstransforms && (new Robo);
            b = new LinkUnderliner("linkify");
            b.addEventListener("show", function(a) {
                a.containerElement.find(".image .over").stop().fadeTo(a.duration, 1)
            });
            b.addEventListener("hide", function(a) {
                a.containerElement.find(".image .over").stop().fadeTo(a.duration, 0)
            });
            b = new LinkUnderliner("linkifyForm");
            b.addEventListener("show", function(a) {
                a.containerElement.find(".image .over").stop().animate({
                    rotate: "-90deg",
                    opacity: 1
                }, a.duration);
                a.containerElement.find(".image .out").stop().animate({
                    rotate: "-90deg"
                }, a.duration)
            });
            b.addEventListener("hide", function(a) {
                a.containerElement.find(".image .over").stop().animate({
                    rotate: "0deg",
                    opacity: 0
                }, a.duration);
                a.containerElement.find(".image .out").stop().animate({
                    rotate: "0deg"
                }, a.duration)
            });
            Dev.checkAndInit();
            !1 === e && (b = a.getLocation(), 0 === window.pageYOffset && (b ? (b = d.getGroupScrollPosition(b), $(document).scrollTop(b)) : $(document).scrollTop(d.getGroupScrollPosition("home"))));
            t()
        },
        w = function() {
            var a = null;
            navigator && navigator.userAgent && (a = navigator.userAgent);
            e = -1 !== a.search(/mobile/i)
        },
        t = function() {
            var a = Math.max(0, 3E3 - ((new Date).getTime() - l));
            $(".page0 .loading").delay(a).fadeOut(function() {
                u()
            })
        },
        u = function() {
            $(".page").css("visibility", "visible");
            !1 === e && (c.addEventListener(ParallaxerEvent.AFTER_LOOP_STOP, function() {
                $(".page0").remove()
            }), d.start(), $("#awwwards").delay(3500).fadeIn(1500))
        };
    Utils.delegate(this, function() {
        $(window).ready(h);
        $(window).load(n)
    })()
};
goog.exportSymbol("Main", Main);