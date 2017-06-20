(function(D) {
    var A = "Lite-1.0";
    D.fn.cycle = function(E) {
        return this.each(function() {
            E = E || {};
            if (this.cycleTimeout) {
                clearTimeout(this.cycleTimeout)
            }
            this.cycleTimeout = 0;
            this.cyclePause = 0;
            var I = D(this);
            var J = E.slideExpr ? D(E.slideExpr, this) : I.children();
            var G = J.get();
            if (G.length < 2) {
                if (window.console && window.console.log) {
                    window.console.log("terminating; too few slides: " + G.length)
                }
                return
            }
            var H = D.extend({}, D.fn.cycle.defaults, E || {}, D.metadata ? I.metadata() : D.meta ? I.data() : {});
            H.before = H.before ? [H.before] : [];
            H.after = H.after ? [H.after] : [];
            H.after.unshift(function() {
                H.busy = 0
            });
            var F = this.className;
            H.width = parseInt((F.match(/w:(\d+)/) || [])[1]) || H.width;
            H.height = parseInt((F.match(/h:(\d+)/) || [])[1]) || H.height;
            H.timeout = parseInt((F.match(/t:(\d+)/) || [])[1]) || H.timeout;
            if (I.css("position") == "static") {
                I.css("position", "relative")
            }
            if (H.width) {
                I.width(H.width)
            }
            if (H.height && H.height != "auto") {
                I.height(H.height)
            }
            var K = 0;
            J.css({
                position: "absolute",
                top: 0,
                left: 0
            }).hide().each(function(M) {
                D(this).css("z-index", G.length - M)
            });
            D(G[K]).css("opacity", 1).show();
            if (D.browser.msie) {
                G[K].style.removeAttribute("filter")
            }
            if (H.fit && H.width) {
                J.width(H.width)
            }
            if (H.fit && H.height && H.height != "auto") {
                J.height(H.height)
            }
            if (H.pause) {
                I.hover(function() {
                    this.cyclePause = 1
                }, function() {
                    this.cyclePause = 0
                })
            }
            D.fn.cycle.transitions.fade(I, J, H);
            J.each(function() {
                var M = D(this);
                this.cycleH = (H.fit && H.height) ? H.height : M.height();
                this.cycleW = (H.fit && H.width) ? H.width : M.width()
            });
            J.not(":eq(" + K + ")").css({
                opacity: 0
            });
            if (H.cssFirst) {
                D(J[K]).css(H.cssFirst)
            }
            if (H.timeout) {
                if (H.speed.constructor == String) {
                    H.speed = {
                        slow: 600,
                        fast: 200
                    }[H.speed] || 400
                }
                if (!H.sync) {
                    H.speed = H.speed / 2
                }
                while ((H.timeout - H.speed) < 250) {
                    H.timeout += H.speed
                }
            }
            H.speedIn = H.speed;
            H.speedOut = H.speed;
            H.slideCount = G.length;
            H.currSlide = K;
            H.nextSlide = 1;
            var L = J[K];
            if (H.before.length) {
                H.before[0].apply(L, [L, L, H, true])
            }
            if (H.after.length > 1) {
                H.after[1].apply(L, [L, L, H, true])
            }
            if (H.click && !H.next) {
                H.next = H.click
            }
            if (H.next) {
                D(H.next).bind("click", function() {
                    return C(G, H, H.rev ? -1 : 1)
                })
            }
            if (H.prev) {
                D(H.prev).bind("click", function() {
                    return C(G, H, H.rev ? 1 : -1)
                })
            }
            if (H.timeout) {
                this.cycleTimeout = setTimeout(function() {
                    B(G, H, 0, !H.rev)
                }, H.timeout + (H.delay || 0))
            }
        })
    };

    function B(J, E, I, K) {
        if (E.busy) {
            return
        }
        var H = J[0].parentNode,
            M = J[E.currSlide],
            L = J[E.nextSlide];
        if (H.cycleTimeout === 0 && !I) {
            return
        }
        if (I || !H.cyclePause) {
            if (E.before.length) {
                D.each(E.before, function(N, O) {
                    O.apply(L, [M, L, E, K])
                })
            }
            var F = function() {
                if (D.browser.msie) {
                    this.style.removeAttribute("filter")
                }
                D.each(E.after, function(N, O) {
                    O.apply(L, [M, L, E, K])
                })
            };
            if (E.nextSlide != E.currSlide) {
                E.busy = 1;
                D.fn.cycle.custom(M, L, E, F)
            }
            var G = (E.nextSlide + 1) == J.length;
            E.nextSlide = G ? 0 : E.nextSlide + 1;
            E.currSlide = G ? J.length - 1 : E.nextSlide - 1
        }
        if (E.timeout) {
            H.cycleTimeout = setTimeout(function() {
                B(J, E, 0, !E.rev)
            }, E.timeout)
        }
    }

    function C(E, F, I) {
        var H = E[0].parentNode,
            G = H.cycleTimeout;
        if (G) {
            clearTimeout(G);
            H.cycleTimeout = 0
        }
        F.nextSlide = F.currSlide + I;
        if (F.nextSlide < 0) {
            F.nextSlide = E.length - 1
        } else {
            if (F.nextSlide >= E.length) {
                F.nextSlide = 0
            }
        }
        B(E, F, 1, I >= 0);
        return false
    }
    D.fn.cycle.custom = function(K, H, I, E) {
        var J = D(K),
            G = D(H);
        G.css({
            opacity: 0
        });
        var F = function() {
            G.animate({
                opacity: 1
            }, I.speedIn, I.easeIn, E)
        };
        J.animate({
            opacity: 0
        }, I.speedOut, I.easeOut, function() {
            J.css({
                display: "none"
            });
            if (!I.sync) {
                F()
            }
        });
        if (I.sync) {
            F()
        }
    };
    D.fn.cycle.transitions = {
        fade: function(F, G, E) {
            G.not(":eq(0)").css("opacity", 0);
            E.before.push(function() {
                D(this).show()
            })
        }
    };
    D.fn.cycle.ver = function() {
        return A
    };
    D.fn.cycle.defaults = {
        timeout: 4000,
        speed: 1000,
        next: null,
        prev: null,
        before: null,
        after: null,
        height: "auto",
        sync: 1,
        fit: 0,
        pause: 0,
        delay: 0,
        slideExpr: null
    }
})(jQuery);
! function($) {
    "use strict"
    var toggle = '[data-toggle="dropdown"]',
        Dropdown = function(element) {
            var $el = $(element).on('click.dropdown.data-api', this.toggle)
            $('html').on('click.dropdown.data-api', function() {
                $el.parent().removeClass('open')
            })
        }
    Dropdown.prototype = {
        constructor: Dropdown,
        toggle: function(e) {
            var $this = $(this),
                selector = $this.attr('data-target'),
                $parent, isActive
            if (!selector) {
                selector = $this.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '')
            }
            $parent = $(selector)
            $parent.length || ($parent = $this.parent())
            isActive = $parent.hasClass('open')
            clearMenus() !isActive && $parent.toggleClass('open')
            return false
        }
    }

    function clearMenus() {
        $(toggle).parent().removeClass('open')
    }
    $.fn.dropdown = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('dropdown')
            if (!data) $this.data('dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }
    $.fn.dropdown.Constructor = Dropdown
    $(function() {
        $('html').on('click.dropdown.data-api', clearMenus)
        $('body').on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    })
}(window.jQuery);;
! function($) {
    "use strict"
    var Tab = function(element) {
        this.element = $(element)
    }
    Tab.prototype = {
        constructor: Tab,
        show: function() {
            var $this = this.element,
                $ul = $this.closest('ul:not(.dropdown-menu)'),
                selector = $this.attr('data-target'),
                previous, $target
            if (!selector) {
                selector = $this.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '')
            }
            if ($this.parent('li').hasClass('active')) return
            previous = $ul.find('.active a').last()[0]
            $this.trigger({
                type: 'show',
                relatedTarget: previous
            })
            $target = $(selector)
            this.activate($this.parent('li'), $ul)
            this.activate($target, $target.parent(), function() {
                $this.trigger({
                    type: 'shown',
                    relatedTarget: previous
                })
            })
        },
        activate: function(element, container, callback) {
            var $active = container.find('> .active'),
                transition = callback && $.support.transition && $active.hasClass('fade')

            function next() {
                $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
                element.addClass('active')
                if (transition) {
                    element[0].offsetWidth
                    element.addClass('in')
                } else {
                    element.removeClass('fade')
                }
                if (element.parent('.dropdown-menu')) {
                    element.closest('li.dropdown').addClass('active')
                }
                callback && callback()
            }
            transition ? $active.one($.support.transition.end, next) : next()
            $active.removeClass('in')
        }
    }
    $.fn.tab = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('tab')
            if (!data) $this.data('tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.tab.Constructor = Tab
    $(function() {
        $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
            e.preventDefault()
            $(this).tab('show')
        })
    })
}(window.jQuery);;;
(function(a) {
    a.backstretch = function(l, b, j) {
        function m(c) {
            try {
                h = {
                    left: 0,
                    top: 0
                }, e = f.width(), d = e / k, d >= f.height() ? (i = (d - f.height()) / 2, g.centeredY && a.extend(h, {
                    top: "-" + i + "px"
                })) : (d = f.height(), e = d * k, i = (e - f.width()) / 2, g.centeredX && a.extend(h, {
                    left: "-" + i + "px"
                })), a("#backstretch, #backstretch img:not(.deleteable)").width(e).height(d).filter("img").css(h)
            } catch (b) {}
            "function" == typeof c && c()
        }
        var n = {
                centeredX: !0,
                centeredY: !0,
                speed: 0
            },
            c = a("#backstretch"),
            g = c.data("settings") || n;
        c.data("settings");
        var f = "onorientationchange" in window ? a(document) : a(window),
            k, e, d, i, h;
        b && "object" == typeof b && a.extend(g, b);
        b && "function" == typeof b && (j = b);
        a(document).ready(function() {
            if (l) {
                var b;
                0 == c.length ? c = a("<div />").attr("id", "backstretch").css({
                    left: 0,
                    top: 0,
                    position: "fixed",
                    overflow: "hidden",
                    zIndex: -999999,
                    margin: 0,
                    padding: 0,
                    height: "100%",
                    width: "100%"
                }) : c.find("img").addClass("deleteable");
                b = a("<img />").css({
                    position: "absolute",
                    display: "none",
                    margin: 0,
                    padding: 0,
                    border: "none",
                    zIndex: -999999
                }).bind("load", function(b) {
                    var d = a(this),
                        e;
                    d.css({
                        width: "auto",
                        height: "auto"
                    });
                    e = this.width || a(b.target).width();
                    b = this.height || a(b.target).height();
                    k = e / b;
                    m(function() {
                        d.fadeIn(g.speed, function() {
                            c.find(".deleteable").remove();
                            "function" == typeof j && j()
                        })
                    })
                }).appendTo(c);
                0 == a("body #backstretch").length && a("body").append(c);
                c.data("settings", g);
                b.attr("src", l);
                a(window).resize(m)
            }
        });
        return this
    }
})(jQuery);;
(function(t, e, i) {
    function n(i, n, o) {
        var r = e.createElement(i);
        return n && (r.id = Z + n), o && (r.style.cssText = o), t(r)
    }

    function o() {
        return i.innerHeight ? i.innerHeight : t(i).height()
    }

    function r(e, i) {
        i !== Object(i) && (i = {}), this.cache = {}, this.el = e, this.value = function(e) {
            var n;
            return void 0 === this.cache[e] && (n = t(this.el).attr("data-cbox-" + e), void 0 !== n ? this.cache[e] = n : void 0 !== i[e] ? this.cache[e] = i[e] : void 0 !== X[e] && (this.cache[e] = X[e])), this.cache[e]
        }, this.get = function(e) {
            var i = this.value(e);
            return t.isFunction(i) ? i.call(this.el, this) : i
        }
    }

    function h(t) {
        var e = W.length,
            i = (z + t) % e;
        return 0 > i ? e + i : i
    }

    function a(t, e) {
        return Math.round((/%/.test(t) ? ("x" === e ? E.width() : o()) / 100 : 1) * parseInt(t, 10))
    }

    function s(t, e) {
        return t.get("photo") || t.get("photoRegex").test(e)
    }

    function l(t, e) {
        return t.get("retinaUrl") && i.devicePixelRatio > 1 ? e.replace(t.get("photoRegex"), t.get("retinaSuffix")) : e
    }

    function d(t) {
        "contains" in y[0] && !y[0].contains(t.target) && t.target !== v[0] && (t.stopPropagation(), y.focus())
    }

    function c(t) {
        c.str !== t && (y.add(v).removeClass(c.str).addClass(t), c.str = t)
    }

    function g(e) {
        z = 0, e && e !== !1 && "nofollow" !== e ? (W = t("." + te).filter(function() {
            var i = t.data(this, Y),
                n = new r(this, i);
            return n.get("rel") === e
        }), z = W.index(_.el), -1 === z && (W = W.add(_.el), z = W.length - 1)) : W = t(_.el)
    }

    function u(i) {
        t(e).trigger(i), ae.triggerHandler(i)
    }

    function f(i) {
        var o;
        if (!G) {
            if (o = t(i).data(Y), _ = new r(i, o), g(_.get("rel")), !$) {
                $ = q = !0, c(_.get("className")), y.css({
                    visibility: "hidden",
                    display: "block",
                    opacity: ""
                }), L = n(se, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden"), b.css({
                    width: "",
                    height: ""
                }).append(L), D = T.height() + k.height() + b.outerHeight(!0) - b.height(), j = C.width() + H.width() + b.outerWidth(!0) - b.width(), A = L.outerHeight(!0), N = L.outerWidth(!0);
                var h = a(_.get("initialWidth"), "x"),
                    s = a(_.get("initialHeight"), "y"),
                    l = _.get("maxWidth"),
                    f = _.get("maxHeight");
                _.w = (l !== !1 ? Math.min(h, a(l, "x")) : h) - N - j, _.h = (f !== !1 ? Math.min(s, a(f, "y")) : s) - A - D, L.css({
                    width: "",
                    height: _.h
                }), J.position(), u(ee), _.get("onOpen"), O.add(F).hide(), y.focus(), _.get("trapFocus") && e.addEventListener && (e.addEventListener("focus", d, !0), ae.one(re, function() {
                    e.removeEventListener("focus", d, !0)
                })), _.get("returnFocus") && ae.one(re, function() {
                    t(_.el).focus()
                })
            }
            var p = parseFloat(_.get("opacity"));
            v.css({
                opacity: p === p ? p : "",
                cursor: _.get("overlayClose") ? "pointer" : "",
                visibility: "visible"
            }).show(), _.get("closeButton") ? B.html(_.get("close")).appendTo(b) : B.appendTo("<div/>"), w()
        }
    }

    function p() {
        y || (V = !1, E = t(i), y = n(se).attr({
            id: Y,
            "class": t.support.opacity === !1 ? Z + "IE" : "",
            role: "dialog",
            tabindex: "-1"
        }).hide(), v = n(se, "Overlay").hide(), S = t([n(se, "LoadingOverlay")[0], n(se, "LoadingGraphic")[0]]), x = n(se, "Wrapper"), b = n(se, "Content").append(F = n(se, "Title"), I = n(se, "Current"), P = t('<button type="button"/>').attr({
            id: Z + "Previous"
        }), K = t('<button type="button"/>').attr({
            id: Z + "Next"
        }), R = n("button", "Slideshow"), S), B = t('<button type="button"/>').attr({
            id: Z + "Close"
        }), x.append(n(se).append(n(se, "TopLeft"), T = n(se, "TopCenter"), n(se, "TopRight")), n(se, !1, "clear:left").append(C = n(se, "MiddleLeft"), b, H = n(se, "MiddleRight")), n(se, !1, "clear:left").append(n(se, "BottomLeft"), k = n(se, "BottomCenter"), n(se, "BottomRight"))).find("div div").css({
            "float": "left"
        }), M = n(se, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"), O = K.add(P).add(I).add(R)), e.body && !y.parent().length && t(e.body).append(v, y.append(x, M))
    }

    function m() {
        function i(t) {
            t.which > 1 || t.shiftKey || t.altKey || t.metaKey || t.ctrlKey || (t.preventDefault(), f(this))
        }
        return y ? (V || (V = !0, K.click(function() {
            J.next()
        }), P.click(function() {
            J.prev()
        }), B.click(function() {
            J.close()
        }), v.click(function() {
            _.get("overlayClose") && J.close()
        }), t(e).bind("keydown." + Z, function(t) {
            var e = t.keyCode;
            $ && _.get("escKey") && 27 === e && (t.preventDefault(), J.close()), $ && _.get("arrowKey") && W[1] && !t.altKey && (37 === e ? (t.preventDefault(), P.click()) : 39 === e && (t.preventDefault(), K.click()))
        }), t.isFunction(t.fn.on) ? t(e).on("click." + Z, "." + te, i) : t("." + te).live("click." + Z, i)), !0) : !1
    }

    function w() {
        var e, o, r, h = J.prep,
            d = ++le;
        if (q = !0, U = !1, u(he), u(ie), _.get("onLoad"), _.h = _.get("height") ? a(_.get("height"), "y") - A - D : _.get("innerHeight") && a(_.get("innerHeight"), "y"), _.w = _.get("width") ? a(_.get("width"), "x") - N - j : _.get("innerWidth") && a(_.get("innerWidth"), "x"), _.mw = _.w, _.mh = _.h, _.get("maxWidth") && (_.mw = a(_.get("maxWidth"), "x") - N - j, _.mw = _.w && _.w < _.mw ? _.w : _.mw), _.get("maxHeight") && (_.mh = a(_.get("maxHeight"), "y") - A - D, _.mh = _.h && _.h < _.mh ? _.h : _.mh), e = _.get("href"), Q = setTimeout(function() {
                S.show()
            }, 100), _.get("inline")) {
            var c = t(e);
            r = t("<div>").hide().insertBefore(c), ae.one(he, function() {
                r.replaceWith(c)
            }), h(c)
        } else _.get("iframe") ? h(" ") : _.get("html") ? h(_.get("html")) : s(_, e) ? (e = l(_, e), U = new Image, t(U).addClass(Z + "Photo").bind("error", function() {
            h(n(se, "Error").html(_.get("imgError")))
        }).one("load", function() {
            d === le && setTimeout(function() {
                var e;
                t.each(["alt", "longdesc", "aria-describedby"], function(e, i) {
                    var n = t(_.el).attr(i) || t(_.el).attr("data-" + i);
                    n && U.setAttribute(i, n)
                }), _.get("retinaImage") && i.devicePixelRatio > 1 && (U.height = U.height / i.devicePixelRatio, U.width = U.width / i.devicePixelRatio), _.get("scalePhotos") && (o = function() {
                    U.height -= U.height * e, U.width -= U.width * e
                }, _.mw && U.width > _.mw && (e = (U.width - _.mw) / U.width, o()), _.mh && U.height > _.mh && (e = (U.height - _.mh) / U.height, o())), _.h && (U.style.marginTop = Math.max(_.mh - U.height, 0) / 2 + "px"), W[1] && (_.get("loop") || W[z + 1]) && (U.style.cursor = "pointer", U.onclick = function() {
                    J.next()
                }), U.style.width = U.width + "px", U.style.height = U.height + "px", h(U)
            }, 1)
        }), U.src = e) : e && M.load(e, _.get("data"), function(e, i) {
            d === le && h("error" === i ? n(se, "Error").html(_.get("xhrError")) : t(this).contents())
        })
    }
    var v, y, x, b, T, C, H, k, W, E, L, M, S, F, I, R, K, P, B, O, _, D, j, A, N, z, U, $, q, G, Q, J, V, X = {
            html: !1,
            photo: !1,
            iframe: !1,
            inline: !1,
            transition: "elastic",
            speed: 300,
            fadeOut: 300,
            width: !1,
            initialWidth: "600",
            innerWidth: !1,
            maxWidth: !1,
            height: !1,
            initialHeight: "450",
            innerHeight: !1,
            maxHeight: !1,
            scalePhotos: !0,
            scrolling: !0,
            opacity: .9,
            preloading: !0,
            className: !1,
            overlayClose: !0,
            escKey: !0,
            arrowKey: !0,
            top: !1,
            bottom: !1,
            left: !1,
            right: !1,
            fixed: !1,
            data: void 0,
            closeButton: !0,
            fastIframe: !0,
            open: !1,
            reposition: !0,
            loop: !0,
            slideshow: !1,
            slideshowAuto: !0,
            slideshowSpeed: 2500,
            slideshowStart: "start slideshow",
            slideshowStop: "stop slideshow",
            photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
            retinaImage: !1,
            retinaUrl: !1,
            retinaSuffix: "@2x.$1",
            current: "image {current} of {total}",
            previous: "previous",
            next: "next",
            close: "close",
            xhrError: "This content failed to load.",
            imgError: "This image failed to load.",
            returnFocus: !0,
            trapFocus: !0,
            onOpen: !1,
            onLoad: !1,
            onComplete: !1,
            onCleanup: !1,
            onClosed: !1,
            rel: function() {
                return this.rel
            },
            href: function() {
                return t(this).attr("href")
            },
            title: function() {
                return this.title
            }
        },
        Y = "colorbox",
        Z = "cbox",
        te = Z + "Element",
        ee = Z + "_open",
        ie = Z + "_load",
        ne = Z + "_complete",
        oe = Z + "_cleanup",
        re = Z + "_closed",
        he = Z + "_purge",
        ae = t("<a/>"),
        se = "div",
        le = 0,
        de = {},
        ce = function() {
            function t() {
                clearTimeout(h)
            }

            function e() {
                (_.get("loop") || W[z + 1]) && (t(), h = setTimeout(J.next, _.get("slideshowSpeed")))
            }

            function i() {
                R.html(_.get("slideshowStop")).unbind(s).one(s, n), ae.bind(ne, e).bind(ie, t), y.removeClass(a + "off").addClass(a + "on")
            }

            function n() {
                t(), ae.unbind(ne, e).unbind(ie, t), R.html(_.get("slideshowStart")).unbind(s).one(s, function() {
                    J.next(), i()
                }), y.removeClass(a + "on").addClass(a + "off")
            }

            function o() {
                r = !1, R.hide(), t(), ae.unbind(ne, e).unbind(ie, t), y.removeClass(a + "off " + a + "on")
            }
            var r, h, a = Z + "Slideshow_",
                s = "click." + Z;
            return function() {
                r ? _.get("slideshow") || (ae.unbind(oe, o), o()) : _.get("slideshow") && W[1] && (r = !0, ae.one(oe, o), _.get("slideshowAuto") ? i() : n(), R.show())
            }
        }();
    t[Y] || (t(p), J = t.fn[Y] = t[Y] = function(e, i) {
        var n, o = this;
        if (e = e || {}, t.isFunction(o)) o = t("<a/>"), e.open = !0;
        else if (!o[0]) return o;
        return o[0] ? (p(), m() && (i && (e.onComplete = i), o.each(function() {
            var i = t.data(this, Y) || {};
            t.data(this, Y, t.extend(i, e))
        }).addClass(te), n = new r(o[0], e), n.get("open") && f(o[0])), o) : o
    }, J.position = function(e, i) {
        function n() {
            T[0].style.width = k[0].style.width = b[0].style.width = parseInt(y[0].style.width, 10) - j + "px", b[0].style.height = C[0].style.height = H[0].style.height = parseInt(y[0].style.height, 10) - D + "px"
        }
        var r, h, s, l = 0,
            d = 0,
            c = y.offset();
        if (E.unbind("resize." + Z), y.css({
                top: -9e4,
                left: -9e4
            }), h = E.scrollTop(), s = E.scrollLeft(), _.get("fixed") ? (c.top -= h, c.left -= s, y.css({
                position: "fixed"
            })) : (l = h, d = s, y.css({
                position: "absolute"
            })), d += _.get("right") !== !1 ? Math.max(E.width() - _.w - N - j - a(_.get("right"), "x"), 0) : _.get("left") !== !1 ? a(_.get("left"), "x") : Math.round(Math.max(E.width() - _.w - N - j, 0) / 2), l += _.get("bottom") !== !1 ? Math.max(o() - _.h - A - D - a(_.get("bottom"), "y"), 0) : _.get("top") !== !1 ? a(_.get("top"), "y") : Math.round(Math.max(o() - _.h - A - D, 0) / 2), y.css({
                top: c.top,
                left: c.left,
                visibility: "visible"
            }), x[0].style.width = x[0].style.height = "9999px", r = {
                width: _.w + N + j,
                height: _.h + A + D,
                top: l,
                left: d
            }, e) {
            var g = 0;
            t.each(r, function(t) {
                return r[t] !== de[t] ? (g = e, void 0) : void 0
            }), e = g
        }
        de = r, e || y.css(r), y.dequeue().animate(r, {
            duration: e || 0,
            complete: function() {
                n(), q = !1, x[0].style.width = _.w + N + j + "px", x[0].style.height = _.h + A + D + "px", _.get("reposition") && setTimeout(function() {
                    E.bind("resize." + Z, J.position)
                }, 1), t.isFunction(i) && i()
            },
            step: n
        })
    }, J.resize = function(t) {
        var e;
        $ && (t = t || {}, t.width && (_.w = a(t.width, "x") - N - j), t.innerWidth && (_.w = a(t.innerWidth, "x")), L.css({
            width: _.w
        }), t.height && (_.h = a(t.height, "y") - A - D), t.innerHeight && (_.h = a(t.innerHeight, "y")), t.innerHeight || t.height || (e = L.scrollTop(), L.css({
            height: "auto"
        }), _.h = L.height()), L.css({
            height: _.h
        }), e && L.scrollTop(e), J.position("none" === _.get("transition") ? 0 : _.get("speed")))
    }, J.prep = function(i) {
        function o() {
            return _.w = _.w || L.width(), _.w = _.mw && _.mw < _.w ? _.mw : _.w, _.w
        }

        function a() {
            return _.h = _.h || L.height(), _.h = _.mh && _.mh < _.h ? _.mh : _.h, _.h
        }
        if ($) {
            var d, g = "none" === _.get("transition") ? 0 : _.get("speed");
            L.remove(), L = n(se, "LoadedContent").append(i), L.hide().appendTo(M.show()).css({
                width: o(),
                overflow: _.get("scrolling") ? "auto" : "hidden"
            }).css({
                height: a()
            }).prependTo(b), M.hide(), t(U).css({
                "float": "none"
            }), c(_.get("className")), d = function() {
                function i() {
                    t.support.opacity === !1 && y[0].style.removeAttribute("filter")
                }
                var n, o, a = W.length;
                $ && (o = function() {
                    clearTimeout(Q), S.hide(), u(ne), _.get("onComplete")
                }, F.html(_.get("title")).show(), L.show(), a > 1 ? ("string" == typeof _.get("current") && I.html(_.get("current").replace("{current}", z + 1).replace("{total}", a)).show(), K[_.get("loop") || a - 1 > z ? "show" : "hide"]().html(_.get("next")), P[_.get("loop") || z ? "show" : "hide"]().html(_.get("previous")), ce(), _.get("preloading") && t.each([h(-1), h(1)], function() {
                    var i, n = W[this],
                        o = new r(n, t.data(n, Y)),
                        h = o.get("href");
                    h && s(o, h) && (h = l(o, h), i = e.createElement("img"), i.src = h)
                })) : O.hide(), _.get("iframe") ? (n = e.createElement("iframe"), "frameBorder" in n && (n.frameBorder = 0), "allowTransparency" in n && (n.allowTransparency = "true"), _.get("scrolling") || (n.scrolling = "no"), t(n).attr({
                    src: _.get("href"),
                    name: (new Date).getTime(),
                    "class": Z + "Iframe",
                    allowFullScreen: !0
                }).one("load", o).appendTo(L), ae.one(he, function() {
                    n.src = "//about:blank"
                }), _.get("fastIframe") && t(n).trigger("load")) : o(), "fade" === _.get("transition") ? y.fadeTo(g, 1, i) : i())
            }, "fade" === _.get("transition") ? y.fadeTo(g, 0, function() {
                J.position(0, d)
            }) : J.position(g, d)
        }
    }, J.next = function() {
        !q && W[1] && (_.get("loop") || W[z + 1]) && (z = h(1), f(W[z]))
    }, J.prev = function() {
        !q && W[1] && (_.get("loop") || z) && (z = h(-1), f(W[z]))
    }, J.close = function() {
        $ && !G && (G = !0, $ = !1, u(oe), _.get("onCleanup"), E.unbind("." + Z), v.fadeTo(_.get("fadeOut") || 0, 0), y.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
            y.hide(), v.hide(), u(he), L.remove(), setTimeout(function() {
                G = !1, u(re), _.get("onClosed")
            }, 1)
        }))
    }, J.remove = function() {
        y && (y.stop(), t[Y].close(), y.stop(!1, !0).remove(), v.remove(), G = !1, y = null, t("." + te).removeData(Y).removeClass(te), t(e).unbind("click." + Z).unbind("keydown." + Z))
    }, J.element = function() {
        return t(_.el)
    }, J.settings = X)
})(jQuery, document, window);;
(function($) {
    $.timeliner = function(options) {
        if ($.timeliners == null) {
            $.timeliners = {
                options: []
            };
            $.timeliners.options.push(options)
        } else {
            $.timeliners.options.push(options)
        }
        $(document).ready(function() {
            for (var i = 0; i < $.timeliners.options.length; i++) {
                startTimeliner($.timeliners.options[i])
            }
        })
    };

    function startTimeliner(options) {
        var settings = {
            timelineContainer: options["timelineContainer"] || "#timelineContainer",
            startState: options["startState"] || "closed",
            startOpen: options["startOpen"] || [],
            baseSpeed: options["baseSpeed"] || 200,
            speed: options["speed"] || 4,
            fontOpen: options["fontOpen"] || "1.2em",
            fontClosed: options["fontClosed"] || "1em",
            expandAllText: options["expandAllText"] || "+ expand all",
            collapseAllText: options["collapseAllText"] || "- collapse all"
        };

        function openEvent(eventHeading, eventBody) {
            $(eventHeading).removeClass("closed").addClass("open").animate({
                fontSize: settings.fontOpen
            }, settings.baseSpeed);
            $(eventBody).show(settings.speed * settings.baseSpeed)
        }

        function closeEvent(eventHeading, eventBody) {
            $(eventHeading).animate({
                fontSize: settings.fontClosed
            }, 0).removeClass("open").addClass("closed");
            $(eventBody).hide(settings.speed * settings.baseSpeed)
        }
        if ($(settings.timelineContainer).data("started")) {
            return
        } else {
            $(settings.timelineContainer).data("started", true);
            $(settings.timelineContainer + " " + ".expandAll").html(settings.expandAllText);
            $(settings.timelineContainer + " " + ".collapseAll").html(settings.collapseAllText);
            if (settings.startState === "closed") {
                $(settings.timelineContainer + " " + ".timelineEvent").hide();
                $.each($(settings.startOpen), function(index, value) {
                    openEvent($(value).parent(settings.timelineContainer + " " + ".timelineMinor").find("dt a"), $(value))
                })
            } else {
                openEvent($(settings.timelineContainer + " " + ".timelineMinor dt a"), $(settings.timelineContainer + " " + ".timelineEvent"))
            }
            $(settings.timelineContainer).on("click", ".timelineMinor dt", function() {
                var currentId = $(this).attr("id");
                if ($(this).find("a").is(".open")) {
                    closeEvent($("a", this), $("#" + currentId + "EX"))
                } else {
                    openEvent($("a", this), $("#" + currentId + "EX"))
                }
            });
            $(settings.timelineContainer).on("click", ".timelineMajorMarker", function() {
                var numEvents = $(this).parents(".timelineMajor").find(".timelineMinor").length;
                var numOpen = $(this).parents(".timelineMajor").find(".open").length;
                if (numEvents > numOpen) {
                    openEvent($(this).parents(".timelineMajor").find("dt a", "dl.timelineMinor"), $(this).parents(".timelineMajor").find(".timelineEvent"))
                } else {
                    closeEvent($(this).parents(".timelineMajor").find("dl.timelineMinor a"), $(this).parents(".timelineMajor").find(".timelineEvent"))
                }
            });
            $(settings.timelineContainer + " " + ".expandAll").click(function() {
                if ($(this).hasClass("expanded")) {
                    closeEvent($(this).parents(settings.timelineContainer).find("dt a", "dl.timelineMinor"), $(this).parents(settings.timelineContainer).find(".timelineEvent"));
                    $(this).removeClass("expanded").html(settings.expandAllText)
                } else {
                    openEvent($(this).parents(settings.timelineContainer).find("dt a", "dl.timelineMinor"), $(this).parents(settings.timelineContainer).find(".timelineEvent"));
                    $(this).addClass("expanded").html(settings.collapseAllText)
                }
            })
        }
    }
})(jQuery);;
$(document).ready(function() {
    $.backstretch("/images/bg2.jpg", {
        speed: 450
    }, {
        centeredX: true
    }, {
        centeredY: true
    });
    $(".submenu").hide();
    $("li.menuItem").hover(function() {
        $(this).children("ul").stop(true, true).show(600);
    }, function() {
        $(this).children("ul").hide(800);
    });
    (function($) {
        var cache = [];
        $.preLoadImages = function() {
            var args_len = arguments.length;
            for (var i = args_len; i--;) {
                var cacheImage = document.createElement('img');
                cacheImage.src = arguments[i];
                cache.push(cacheImage);
            }
        }
    })(jQuery)
    jQuery.preLoadImages("/images/logo_truth_collapsed2.jpg", "/images/home_still_woodward.jpg", "/images/home_still_civilrights.jpg");
    $('div.imageRotate1').cycle({
        fx: 'fade',
        delay: 0,
        timeout: 6500,
        speed: 2000,
        continuous: 1,
        height: 248,
        pause: 1
    });
    $('div.imageRotate2').cycle({
        fx: 'fade',
        delay: 3000,
        timeout: 6500,
        speed: 2000,
        continuous: 1,
        height: 248,
        pause: 1
    });
    if ($('.dropdown-toggle').length) {
        $('.dropdown-toggle').dropdown();
    }
    $("[id^='fullJbox']").hide();
    $("a.JboxExpanderLink").click(function() {
        var x = $(this).parents("[id^='Jbox']").attr('id');
        $("#full" + x).slideToggle(400);
        $(this).toggleClass('expanded')
    });
    $("a[href^='http']").not("[href*='investigatingpower.org']").attr('target', '_blank');
    $(".CBmodal").colorbox({
        inline: true,
        innerWidth: 640,
        innerHeight: "70%"
    });
    $.timeliner({
        timelineContainer: '#list_mccarthytimeline',
        startOpen: ['#19530831EX', '#19531109EX']
    });
    $.timeliner({
        timelineContainer: '#list_civilrightstimeline',
        startOpen: ['#19550828EX', '#19570904EX', '#19610504EX', '#19630828EX', '#19680404EX']
    });
    $.timeliner({
        timelineContainer: '#list_vietnamtimeline',
        startOpen: ['#19691113EX', '#19710613EX', '#19710618EX'],
    });
    $.timeliner({
        timelineContainer: '#list_watergatetimeline',
        startOpen: ['#19720528EX', '#19730517EX'],
    });
    $.timeliner({
        timelineContainer: '#list_corporatepowertimeline',
        startOpen: ['#19940324EX', '#19950912EX'],
    });
    $.timeliner({
        timelineContainer: '#list_911timeline',
        startOpen: ['#20011125EX', '#20021004EX', '#20021226EX', '#20030318EX', '#20030319EX', '#20051102EX', '#20060906EX', '#20071004EX', '#20100316EX'],
    });
});