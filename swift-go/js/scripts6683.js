init = () => {
  let isMobile = false;
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   isMobile = true;
  }
  return {
    body: document.body,
    fadeInOnLoad() {
      // wait for page to fully load
      window.addEventListener("load", () => {
        // fade in body
        this.body.classList.add("is-loaded");
      });
    },
    initMomentum() {
      // wait for page to fully load
      if (isMobile) {
        document.getElementById("momentum-content").style.position="relative";
        body.setAttribute( 'style', 'padding: 0 !important;' );
        if (this.body.clientWidth > 768) {
          document.getElementById("momentum-content").style.marginLeft="-50px";	
        }
        return;
      }
      document.getElementById("momentum-content").style.position="fixed";
      document.getElementById("momentum-content").style.top="0";
      document.getElementById("momentum-content").style.left="0";

      window.addEventListener("load", () => {
        this.resetMomentum();
      });
    },
    resetMomentum() {
      if (isMobile) {
        return;
      }
      window.removeEventListener("scroll", easeScroll);
      const momentumContent = document.getElementById("momentum-content");
      const nonMomentumContent = document.getElementById(
        "non-momentum-content"
      );

      let sx = 0, // For scroll positions
        sy = 0;
      let dx = sx, // For container positions
        dy = sy;

      this.body.style.height = momentumContent.clientHeight + "px";

      // Bind a scroll function
      window.addEventListener("scroll", easeScroll);

      function easeScroll() {
        sx = window.pageXOffset;
        sy = window.pageYOffset;
      }

      window.requestAnimationFrame(render);

      function render() {
        //We calculate our container position by linear interpolation method
        dx = li(dx, sx, 0.07);
        dy = li(dy, sy, 0.07);

        dx = Math.floor(dx * 100) / 100;
        dy = Math.floor(dy * 100) / 100;

        momentumContent.style.transform = `translate3d(-${dx}px, -${dy}px, 0px)`;

        window.requestAnimationFrame(render);
      }

      function li(a, b, n) {
        return (1 - n) * a + n * b;
      }
    },
    resetBody() {
      // delay this by 100ms to allow for the page to load
      setTimeout(() => {
        const momentumContent = document.getElementById("momentum-content");
        this.body.style.height = momentumContent.clientHeight + "px";
      }, 100);
    },
    scrollLinks() {
      // wait for page to fully load
      window.addEventListener("load", () => {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.addEventListener("click", function (e) {
            e.preventDefault();
            var href = this.getAttribute("href");
            var elem =
              document.querySelector(href) ||
              document.querySelector(
                "a[name=" + href.substring(1, href.length) + "]"
              );
            //gets Element with an id of the link's href
            //or an anchor tag with a name attribute of the href of the link without the #
            window.scroll({
              top: elem.offsetTop,
              left: 0,
              behavior: "smooth",
            });
            //if you want to add the hash to window.location.hash
            //you will need to use setTimeout to prevent losing the smooth scrolling behavior
            //the following code will work for that purpose
            /*setTimeout(function(){
                window.location.hash = this.hash;
            }, 2000); */
          });
        });

        // Scroll to element on window load if hash is present
        if(window.location.hash) {
          const elem = document.getElementById(window.location.hash.substring(1, window.location.hash.length));
          if(elem) {
            window.scroll({
              top: elem.offsetTop,
              left: 0,
              behavior: "smooth",
            });
          }
        }
      });
    },
    innerScroll(target, link, offset) {
      var target = document.querySelector(target);
      var link = target.querySelector(link);
      offset = offset || 0;
      target.scroll({
        top: link.offsetTop - offset,
        left: 0,
        behavior: "smooth",
      });
    },
    selectedIndex: 0,
    initEmbla() {
      const wrap = document.querySelector(".embla__content");
      const viewPort = wrap.querySelector(".embla__viewport");
      const prevBtn = wrap.querySelector(".embla__button--prev");
      const nextBtn = wrap.querySelector(".embla__button--next");
      const dots = document.querySelector(".embla__dots");
      const embla = EmblaCarousel(viewPort, {
        loop: false,
        skipSnaps: false,
      });

      const setupDotBtns = (dotsArray, embla) => {
        dotsArray.forEach((dotNode, i) => {
          dotNode.addEventListener("click", () => embla.scrollTo(i), false);
        });
      };

      const generateDotBtns = (dots, embla) => {
        const template =
          document.getElementById("embla-dot-template").innerHTML;
        dots.innerHTML = embla
          .scrollSnapList()
          .reduce((acc) => acc + template, "");
        return [].slice.call(dots.querySelectorAll(".embla__dot"));
      };

      const selectDotBtn = (dotsArray, embla) => () => {
        const previous = embla.previousScrollSnap();
        const selected = embla.selectedScrollSnap();
        dotsArray[previous].classList.remove("is-selected");
        dotsArray[selected].classList.add("is-selected");
      };

      const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
        prevBtn.addEventListener("click", embla.scrollPrev, false);
        nextBtn.addEventListener("click", embla.scrollNext, false);
      };

      const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
        return () => {
          if (embla.canScrollPrev()) prevBtn.removeAttribute("disabled");
          else prevBtn.setAttribute("disabled", "disabled");

          if (embla.canScrollNext()) nextBtn.removeAttribute("disabled");
          else nextBtn.setAttribute("disabled", "disabled");
        };
      };

      const dotsArray = generateDotBtns(dots, embla);
      const setSelectedDotBtn = selectDotBtn(dotsArray, embla);
      const disablePrevAndNextBtns = disablePrevNextBtns(
        prevBtn,
        nextBtn,
        embla
      );

      setupPrevNextBtns(prevBtn, nextBtn, embla);
      setupDotBtns(dotsArray, embla);

      embla.on("select", setSelectedDotBtn);
      embla.on("select", disablePrevAndNextBtns);
      embla.on("init", setSelectedDotBtn);
      embla.on("init", disablePrevAndNextBtns);

      const onSelect = () => {
        this.selectedIndex = embla.selectedScrollSnap();
      };

      embla.on("select", onSelect);
    },
    video() {
      const iframe = document.querySelector("iframe");
      const player = new Vimeo.Player(iframe);
      const title = "This title should get replaced";
      const status = false;
      const videoId = "";
      const progress = null;

      return {
        title: title,
        status: status,
        progress: progress,
        getTitle() {
          player.getVideoTitle().then((t) => {
            this.title = t;
          });
        },
        loadVideo(id) {
          player.pause().then(
            player.loadVideo(id).then((v) => {
              this.videoId = v;
              this.getTitle();
              player.play();
            })
          );
        },
        timeupdate() {
          player.on("timeupdate", (time) => {
            this.progress = (time.percent * 100).toFixed(1);
          });
        },
        play() {
          player.play();
        },
        stop() {
          player.pause();
        },
        init() {
          //console.log("init video");
          this.getTitle();
          this.timeupdate();
          player.on("play", (s) => {
            this.status = true;
          });

          player.on("pause", (s) => {
            this.status = false;
          });
        },
      };
    },
    getScrollWidth() {
      // create a div with the scroll
      let div = document.createElement("div");

      div.style.overflowY = "scroll";
      div.style.width = "50px";
      div.style.height = "50px";

      // must put it in the document, otherwise sizes will be 0
      document.body.append(div);
      let scrollWidth = div.offsetWidth - div.clientWidth;

      div.remove();

      //console.log(scrollWidth);
      document.documentElement.style.setProperty('--scrollbar-width', scrollWidth + 'px');
    },
  };
};
