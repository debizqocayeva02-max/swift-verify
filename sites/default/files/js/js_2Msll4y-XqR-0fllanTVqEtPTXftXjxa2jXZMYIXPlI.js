/**
 * sticky-sidebar - A JavaScript plugin for making smart and high performance.
 * @version v3.3.1
 * @link https://github.com/abouolia/sticky-sidebar
 * @author Ahmed Bouhuolia
 * @license The MIT License (MIT)
**/
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.StickySidebar=e()}(this,function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var e=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),i=function(){var i=".stickySidebar",n={topSpacing:0,bottomSpacing:0,containerSelector:!1,innerWrapperSelector:".inner-wrapper-sticky",stickyClass:"is-affixed",resizeSensor:!0,minWidth:!1};return function(){function s(e){var i=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t(this,s),this.options=s.extend(n,o),this.sidebar="string"==typeof e?document.querySelector(e):e,void 0===this.sidebar)throw new Error("There is no specific sidebar element.");this.sidebarInner=!1,this.container=this.sidebar.parentElement,this.affixedType="STATIC",this.direction="down",this.support={transform:!1,transform3d:!1},this._initialized=!1,this._reStyle=!1,this._breakpoint=!1,this._resizeListeners=[],this.dimensions={translateY:0,topSpacing:0,lastTopSpacing:0,bottomSpacing:0,lastBottomSpacing:0,sidebarHeight:0,sidebarWidth:0,containerTop:0,containerHeight:0,viewportHeight:0,viewportTop:0,lastViewportTop:0},["handleEvent"].forEach(function(t){i[t]=i[t].bind(i)}),this.initialize()}return e(s,[{key:"initialize",value:function(){var t=this;if(this._setSupportFeatures(),this.options.innerWrapperSelector&&(this.sidebarInner=this.sidebar.querySelector(this.options.innerWrapperSelector),null===this.sidebarInner&&(this.sidebarInner=!1)),!this.sidebarInner){var e=document.createElement("div");for(e.setAttribute("class","inner-wrapper-sticky"),this.sidebar.appendChild(e);this.sidebar.firstChild!=e;)e.appendChild(this.sidebar.firstChild);this.sidebarInner=this.sidebar.querySelector(".inner-wrapper-sticky")}if(this.options.containerSelector){var i=document.querySelectorAll(this.options.containerSelector);if((i=Array.prototype.slice.call(i)).forEach(function(e,i){e.contains(t.sidebar)&&(t.container=e)}),!i.length)throw new Error("The container does not contains on the sidebar.")}"function"!=typeof this.options.topSpacing&&(this.options.topSpacing=parseInt(this.options.topSpacing)||0),"function"!=typeof this.options.bottomSpacing&&(this.options.bottomSpacing=parseInt(this.options.bottomSpacing)||0),this._widthBreakpoint(),this.calcDimensions(),this.stickyPosition(),this.bindEvents(),this._initialized=!0}},{key:"bindEvents",value:function(){window.addEventListener("resize",this,{passive:!0,capture:!1}),window.addEventListener("scroll",this,{passive:!0,capture:!1}),this.sidebar.addEventListener("update"+i,this),this.options.resizeSensor&&"undefined"!=typeof ResizeSensor&&(new ResizeSensor(this.sidebarInner,this.handleEvent),new ResizeSensor(this.container,this.handleEvent))}},{key:"handleEvent",value:function(t){this.updateSticky(t)}},{key:"calcDimensions",value:function(){if(!this._breakpoint){var t=this.dimensions;t.containerTop=s.offsetRelative(this.container).top,t.containerHeight=this.container.clientHeight,t.containerBottom=t.containerTop+t.containerHeight,t.sidebarHeight=this.sidebarInner.offsetHeight,t.sidebarWidth=this.sidebar.offsetWidth,t.viewportHeight=window.innerHeight,this._calcDimensionsWithScroll()}}},{key:"_calcDimensionsWithScroll",value:function(){var t=this.dimensions;t.sidebarLeft=s.offsetRelative(this.sidebar).left,t.viewportTop=document.documentElement.scrollTop||document.body.scrollTop,t.viewportBottom=t.viewportTop+t.viewportHeight,t.viewportLeft=document.documentElement.scrollLeft||document.body.scrollLeft,t.topSpacing=this.options.topSpacing,t.bottomSpacing=this.options.bottomSpacing,"function"==typeof t.topSpacing&&(t.topSpacing=parseInt(t.topSpacing(this.sidebar))||0),"function"==typeof t.bottomSpacing&&(t.bottomSpacing=parseInt(t.bottomSpacing(this.sidebar))||0),"VIEWPORT-TOP"===this.affixedType?t.topSpacing<t.lastTopSpacing&&(t.translateY+=t.lastTopSpacing-t.topSpacing,this._reStyle=!0):"VIEWPORT-BOTTOM"===this.affixedType&&t.bottomSpacing<t.lastBottomSpacing&&(t.translateY+=t.lastBottomSpacing-t.bottomSpacing,this._reStyle=!0),t.lastTopSpacing=t.topSpacing,t.lastBottomSpacing=t.bottomSpacing}},{key:"isSidebarFitsViewport",value:function(){return this.dimensions.sidebarHeight<this.dimensions.viewportHeight}},{key:"observeScrollDir",value:function(){var t=this.dimensions;if(t.lastViewportTop!==t.viewportTop){var e="down"===this.direction?Math.min:Math.max;t.viewportTop===e(t.viewportTop,t.lastViewportTop)&&(this.direction="down"===this.direction?"up":"down")}}},{key:"getAffixType",value:function(){var t=this.dimensions,e=!1;this._calcDimensionsWithScroll();var i=t.sidebarHeight+t.containerTop,n=t.viewportTop+t.topSpacing,s=t.viewportBottom-t.bottomSpacing;return"up"===this.direction?n<=t.containerTop?(t.translateY=0,e="STATIC"):n<=t.translateY+t.containerTop?(t.translateY=n-t.containerTop,e="VIEWPORT-TOP"):!this.isSidebarFitsViewport()&&t.containerTop<=n&&(e="VIEWPORT-UNBOTTOM"):this.isSidebarFitsViewport()?t.sidebarHeight+n>=t.containerBottom?(t.translateY=t.containerBottom-i,e="CONTAINER-BOTTOM"):n>=t.containerTop&&(t.translateY=n-t.containerTop,e="VIEWPORT-TOP"):t.containerBottom<=s?(t.translateY=t.containerBottom-i,e="CONTAINER-BOTTOM"):i+t.translateY<=s?(t.translateY=s-i,e="VIEWPORT-BOTTOM"):t.containerTop+t.translateY<=n&&(e="VIEWPORT-UNBOTTOM"),t.translateY=Math.max(0,t.translateY),t.translateY=Math.min(t.containerHeight,t.translateY),t.lastViewportTop=t.viewportTop,e}},{key:"_getStyle",value:function(t){if(void 0!==t){var e={inner:{},outer:{}},i=this.dimensions;switch(t){case"VIEWPORT-TOP":e.inner={position:"fixed",top:i.topSpacing,left:i.sidebarLeft-i.viewportLeft,width:i.sidebarWidth};break;case"VIEWPORT-BOTTOM":e.inner={position:"fixed",top:"auto",left:i.sidebarLeft,bottom:i.bottomSpacing,width:i.sidebarWidth};break;case"CONTAINER-BOTTOM":case"VIEWPORT-UNBOTTOM":var n=this._getTranslate(0,i.translateY+"px");e.inner=n?{transform:n}:{position:"absolute",top:i.translateY,width:i.sidebarWidth}}switch(t){case"VIEWPORT-TOP":case"VIEWPORT-BOTTOM":case"VIEWPORT-UNBOTTOM":case"CONTAINER-BOTTOM":e.outer={height:i.sidebarHeight,position:"relative"}}return e.outer=s.extend({height:"",position:""},e.outer),e.inner=s.extend({position:"relative",top:"",left:"",bottom:"",width:"",transform:this._getTranslate()},e.inner),e}}},{key:"stickyPosition",value:function(t){if(!this._breakpoint){t=this._reStyle||t||!1;var e=this.getAffixType(),n=this._getStyle(e);if((this.affixedType!=e||t)&&e){var o="affix."+e.toLowerCase().replace("viewport-","")+i;s.eventTrigger(this.sidebar,o),"STATIC"===e?s.removeClass(this.sidebar,this.options.stickyClass):s.addClass(this.sidebar,this.options.stickyClass);for(var r in n.outer)this.sidebar.style[r]=n.outer[r];for(var a in n.inner){var p="number"==typeof n.inner[a]?"px":"";this.sidebarInner.style[a]=n.inner[a]+p}var c="affixed."+e.toLowerCase().replace("viewport-","")+i;s.eventTrigger(this.sidebar,c)}else this._initialized&&(this.sidebarInner.style.left=n.inner.left);this.affixedType=e}}},{key:"_widthBreakpoint",value:function(){window.innerWidth<=this.options.minWidth?(this._breakpoint=!0,this.affixedType="STATIC",this.sidebar.removeAttribute("style"),s.removeClass(this.sidebar,this.options.stickyClass),this.sidebarInner.removeAttribute("style")):this._breakpoint=!1}},{key:"updateSticky",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this._running||(this._running=!0,function(e){requestAnimationFrame(function(){switch(e){case"scroll":t._calcDimensionsWithScroll(),t.observeScrollDir(),t.stickyPosition();break;case"resize":default:t._widthBreakpoint(),t.calcDimensions(),t.stickyPosition(!0)}t._running=!1})}(e.type))}},{key:"_setSupportFeatures",value:function(){var t=this.support;t.transform=s.supportTransform(),t.transform3d=s.supportTransform(!0)}},{key:"_getTranslate",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return this.support.transform3d?"translate3d("+t+", "+e+", "+i+")":!!this.support.translate&&"translate("+t+", "+e+")"}},{key:"destroy",value:function(){window.removeEventListener("resize",this,{caption:!1}),window.removeEventListener("scroll",this,{caption:!1}),this.sidebar.classList.remove(this.options.stickyClass),this.sidebar.style.minHeight="",this.sidebar.removeEventListener("update"+i,this);var t={inner:{},outer:{}};t.inner={position:"",top:"",left:"",bottom:"",width:"",transform:""},t.outer={height:"",position:""};for(var e in t.outer)this.sidebar.style[e]=t.outer[e];for(var n in t.inner)this.sidebarInner.style[n]=t.inner[n];this.options.resizeSensor&&"undefined"!=typeof ResizeSensor&&(ResizeSensor.detach(this.sidebarInner,this.handleEvent),ResizeSensor.detach(this.container,this.handleEvent))}}],[{key:"supportTransform",value:function(t){var e=!1,i=t?"perspective":"transform",n=i.charAt(0).toUpperCase()+i.slice(1),s=["Webkit","Moz","O","ms"],o=document.createElement("support").style;return(i+" "+s.join(n+" ")+n).split(" ").forEach(function(t,i){if(void 0!==o[t])return e=t,!1}),e}},{key:"eventTrigger",value:function(t,e,i){try{var n=new CustomEvent(e,{detail:i})}catch(t){(n=document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,i)}t.dispatchEvent(n)}},{key:"extend",value:function(t,e){var i={};for(var n in t)void 0!==e[n]?i[n]=e[n]:i[n]=t[n];return i}},{key:"offsetRelative",value:function(t){var e={left:0,top:0};do{var i=t.offsetTop,n=t.offsetLeft;isNaN(i)||(e.top+=i),isNaN(n)||(e.left+=n),t="BODY"===t.tagName?t.parentElement:t.offsetParent}while(t);return e}},{key:"addClass",value:function(t,e){s.hasClass(t,e)||(t.classList?t.classList.add(e):t.className+=" "+e)}},{key:"removeClass",value:function(t,e){s.hasClass(t,e)&&(t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," "))}},{key:"hasClass",value:function(t,e){return t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)}}]),s}()}();return window.StickySidebar=i,i});;
"use strict";(function(a,b){b.behaviors.socialShareVertical={attach:function c(){var a=document.querySelector(".news-content__left__social"),b=new StickySidebar(a,{containerSelector:".column-left__content",innerWrapperSelector:".social-share-vert",topSpacing:100,bottomSpacing:20,minWidth:750});setTimeout(function(){window.dispatchEvent(new Event("resize"))},400)}}})(jQuery,Drupal);

;
"use strict";(function(a){a.behaviors.swift_breadcrumb={/**
     * {@inheritDoc}
     */attach:function c(){/* Toggle breadcrumbs mobile version */var a=document.querySelector(".js-toggle-breadcrumb .breadcrumb-arrow"),b=document.querySelector(".breadcrumb");"undefined"!=typeof a&&null!=a&&(a.addEventListener("click",function(a){a.preventDefault(),b.classList.toggle("is-expanded")}),b.addEventListener("click",function(a){a.stopPropagation()}),document.addEventListener("click",function(a){var c=b.contains(a.target);c||b.classList.remove("is-expanded")}))}}})(Drupal);

;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, once) {
  var deprecatedMessageSuffix = "is deprecated in Drupal 9.3.0 and will be removed in Drupal 10.0.0. Use the core/once library instead. See https://www.drupal.org/node/3158256";
  var originalJQOnce = $.fn.once;
  var originalJQRemoveOnce = $.fn.removeOnce;
  $.fn.once = function jQueryOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.once() ".concat(deprecatedMessageSuffix)
    });
    return originalJQOnce.apply(this, [id]);
  };
  $.fn.removeOnce = function jQueryRemoveOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.removeOnce() ".concat(deprecatedMessageSuffix)
    });
    return originalJQRemoveOnce.apply(this, [id]);
  };
  var drupalOnce = once;
  function augmentedOnce(id, selector, context) {
    originalJQOnce.apply($(selector, context), [id]);
    return drupalOnce(id, selector, context);
  }
  function remove(id, selector, context) {
    originalJQRemoveOnce.apply($(selector, context), [id]);
    return drupalOnce.remove(id, selector, context);
  }
  window.once = Object.assign(augmentedOnce, drupalOnce, {
    remove: remove
  });
})(jQuery, once);;
"use strict";(function(a,b,c,d){d.behaviors.main_nav={attach:function g(){var d=a("body"),f=a(".main-nav .main-menu > .main-menu__item.main-menu__item--with-sub");return!!("ontouchstart"in b||navigator.msMaxTouchPoints||navigator.userAgent.toLowerCase().match(/windows phone os 7/i))&&void(a(c).once().on("click",function(a){!f.is(a.target)&&0===f.has(a.target).length&&d.hasClass("dropdown-mobile-open")&&d.removeClass("dropdown-mobile-open")}),f.once().each(function(){var b=!1;a(this).on("click",function(c){var e=a(this);e[0]!==b[0]&&(c.preventDefault(),b=e,d.addClass("dropdown-mobile-open"))}),a(c).on("click touchstart MSPointerDown",function(c){for(var d=!0,e=a(c.target).parents(),f=0;f<e.length;f++)e[f]===b[0]&&(d=!1);d&&(b=!1)})}))}}})(jQuery,window,document,Drupal);

;
"use strict";(function(a,b){b.behaviors.siteHeader={attach:function H(b){function c(){a(".header-main").scrollTop(0),s.scrollTop(0)}function d(){z.addClass("lang-is-open"),u.attr("aria-expanded","true")}function f(){z.removeClass("lang-is-open"),u.attr("aria-expanded","false")}function g(){z.addClass("nav-is-open")}function h(){z.removeClass("nav-is-open"),x.removeClass("is-open"),c()}function i(a){z.addClass("sub-nav-is-open"),a.closest("li").addClass("sub-open")}function j(){z.hasClass("sub-sub-nav-is-open")?(z.removeClass("sub-sub-nav-is-open"),q.find(".dropdown-tab-content").removeClass("sub-sub-open")):(z.removeClass("sub-nav-is-open"),o.closest("li").removeClass("sub-open")),c()}function k(){z.addClass("search-is-open"),t.attr("aria-expanded","true"),setTimeout(function(){y.focus()},30),z.hasClass("lang-is-open")&&f()}function l(){z.removeClass("search-is-open"),t.attr("aria-expanded","false")}function m(){return"ontouchstart"in window||0<navigator.maxTouchPoints||0<navigator.msMaxTouchPoints}/* Toggle language btn */var n=a(".js-mobile-toggle"),o=a(".main-menu > .main-menu__item > a"),p=a(".main-menu__sub-block-tabs-nav > li"),q=a(".dropdown-tab-overview"),r=a(".js_btn_sub_back"),s=a(".main-menu__item_dropdown"),t=a(".js-search-toggle"),u=a(".js-language-toggle"),v=a(".js-language-toggle-mobile"),w=a(".language-toggle-mobile__content--closed"),x=a(".language-switch-mobile"),y=a(".header .search-input"),z=a("html"),A=a(".nav-overlay"),B=void 0,C=void 0,D=a(".main-menu__sub-block-tabs > .main-menu__sub-block-tabs-nav");D.each(function(){a(this).find(".main-menu__sub-block-tabs-nav__item:first-of-type > a").addClass("is-active")}),a(u,b).once().on("click",function(){z.hasClass("lang-is-open")?f():(d(),z.hasClass("search-is-open")&&l())});/* Construct mobile lang nav based on desktop lang nav */var E=a(".language-switch-box__mobile__list"),F=a(u,b).find("span").text(),G=a(".header-top__language .language-switch-box").children().once().clone();/* Toggle mobilelanguage btn */ /* Toggle mobile nav wrapper */ /* Toggle mobile nav wrapper */ /* Toggle mobile sub navs */ /* Toggle mobile sub sub navs */ /* Toggle mobile sub navs */ /* Toggle nav wrapper on overlay click */ /* If esc is pressed */ /* Close on resize */v.find(w).once().append(F),E.prepend(G),a(v,b).once().on("click",function(){a(v).closest(".language-switch-mobile").toggleClass("is-open")}),a(n,b).once().on("click",function(){z.hasClass("nav-is-open")?h():(g(),z.hasClass("search-is-open")&&l())}),a(t,b).once().on("click",function(){z.hasClass("search-is-open")?l():(k(),z.hasClass("nav-is-open")&&h())}),a(o,b).once().on("click",function(b){a(this).parent().hasClass("main-menu__item--with-sub")&&(n.is(":visible")?b.preventDefault():m()&&(window.location.href=a(this).attr("href")),c(),i(a(this)))}),a(p,b).once().on("click",function(b){b.preventDefault();var d=a(this).index();C=940>a(window).width()?"main-menu__sub-block-tabs-nav__item--has-children":"main-menu__sub-block-tabs-nav__item--with-sub",a(this).hasClass(C)&&(c(),a(this).closest(".main-menu__sub-block-tabs-nav").find("li a").removeClass("is-active"),a(this).find("a").addClass("is-active"),z.addClass("sub-sub-nav-is-open")),B=a(this).closest(".dropdown-tab-nav").next(q),940>a(window).width()?a(this).hasClass("main-menu__sub-block-tabs-nav__item--has-children")?(B.find(".dropdown-tab-content").removeClass("sub-sub-open"),B.find(".dropdown-tab-content:nth-child("+(d+1)+")").addClass("sub-sub-open")):window.location.href=a(this).find("a").attr("href"):(B.find(".dropdown-tab-content").removeClass("is-active"),B.find(".dropdown-tab-content:nth-child("+(d+1)+")").addClass("is-active"))}),a(r,b).once().on("click",function(){j()}),A.on("click",function(){z.hasClass("lang-is-open")?f():z.hasClass("nav-is-open")?h():z.hasClass("search-is-open")&&l()}),a(document).keyup(function(a){27===a.keyCode&&(z.hasClass("lang-is-open")?f():z.hasClass("nav-is-open")?h():z.hasClass("search-is-open")&&l())}),a(window).resize(function(){z.hasClass("lang-is-open")?f():z.hasClass("nav-is-open")&&939<a(window).width()&&h()})}}})(jQuery,Drupal);

;
(function($, Drupal) {
  Drupal.behaviors.swiftSearchAutocomplete = {
    attach: function (context) {
      var _this = this;

      $(".search-wrapper__field", context)
        .once(".search-wrapper__field")
        .each(function() {
          var $input = $(".search-input");
          $input.once().on("keyup", _.debounce(_this.initSearch, 500));
          $(".search-banner__wrapper .search-input").on("focusin",
            function(){
              $(this)
                .closest(".js-search-wrapper")
                .addClass("has-focus");
            })
            .on("focusout", function() {
              setTimeout(function() {
                $input.closest(".js-search-wrapper").removeClass("has-focus");
              }, 200);
            });
        });
    },

    initSearch: function(e) {
      var $input = $(e.currentTarget);
      var $queryValue = $input.val();
      var $endpoint = $input.data("auto-complete-route");
      var $searchResultsWrapper = $input.closest(".js-search-wrapper");
      var $searchResultsBox = $searchResultsWrapper.find(".search-results");
      var $searchResultsBoxList = $searchResultsBox.find(".search-results__list");
      $searchResultsBoxList.empty();

      function loadSearchData(data) {
        for (var i = 0; i < data.length; i++) {
          const searchSuggestion = data[i].label;
          $searchResultsBoxList.append(searchSuggestion);
        }
      }

      if ($queryValue.length > 2) {
        var $endpointQuery = $endpoint + "?q=" + $queryValue;
        $.get($endpointQuery).done(function(data) {
          if (data.length > 0) {
            loadSearchData(data);
            $searchResultsWrapper.addClass("results-visible");
            $searchResultsBox.addClass("is-visible");
          } else {
            $searchResultsWrapper.removeClass("results-visible");
            $searchResultsBox.removeClass("is-visible");
          }
        });
      } else {
        $searchResultsWrapper.removeClass("results-visible");
        $searchResultsBox.removeClass("is-visible");
      }
    }
  };
})(jQuery, Drupal);
;
