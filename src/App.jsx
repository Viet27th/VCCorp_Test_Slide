import React from "react";
import "./app.scss";
import {utils} from "./utils";

class VCCorpSwiper {
  selector = null;
  options = null;

  slide = null;
  slideWrapper = null;
  slideItems = null;
  prevEl = null;
  nextEl = null;

  slideWidth = 0;
  cursorXStart = 0;
  cursorXEnd = 0;
  cursorXMoveRange = 0;

  constructor(selector, options) {
    this.selector = selector;
    if (options.active === undefined || options.active === null) {
      options.active = 0;
    }
    this.options = options;

    this.initSlide();
    this.generateNavigation();
  }

  initSlide() {
    this.slide = document.querySelector(this.selector);
    this.slideWrapper = document.querySelector(`${this.selector} .swiper-wrapper`);
    this.slideItems = Array.from(document.querySelectorAll(`${this.selector} .swiper-slide`));
    if (!this.slide || !this.slideWrapper || !this.slideItems.length) {
      return;
    }

    const setSlideItemsDimensions = (width) => {
      this.slideItems.forEach(el => el.style.width = `${width}px`);
    };
    const whenMouseDown = (e) => {
      this.isPressed = true;
      this.cursorXStart = utils.getPositionX(e);
      this.cursorXEnd = this.cursorXStart;
    };
    const whenMouseMove = (index) => {
      return (e) => {
        if (!this.isPressed) return;
        this.cursorXEnd = utils.getPositionX(e);
        this.cursorXMoveRange = this.cursorXEnd - (this.cursorXStart + (index * this.slideWidth));
        utils.animationX(this.slideWrapper, this.cursorXMoveRange, 0);

        if (this.cursorXMoveRange < 0) {
          this.prevEl.classList.remove("disabled");
        }
        if (this.cursorXMoveRange > -(this.slideItems.length - 1) * this.slideWidth) {
          this.nextEl.classList.remove("disabled");
        }
      }
    };
    const whenMouseUp = () => {
      this.isPressed = false;
      const moved = this.cursorXStart - this.cursorXEnd;

      // RTL
      if (moved > this.slideWidth * 50 / 100 && this.options.active < this.slideItems.length - 1) {
        this.options.active += 1;
      }

      // LTR
      if (moved < -(this.slideWidth * 50 / 100) && this.options.active > 0) {
        this.options.active -= 1;
      }

      this._setSlidePosition();
      this._updateNavigation();
    };

    // Start the main function
    this.slideWidth = utils.getElementInnerWidth(this.slide);
    setSlideItemsDimensions(this.slideWidth);
    utils.animationX(this.slideWrapper, -(this.options.active * this.slideWidth), 0);

    window.addEventListener("resize", () => {
      this.slideWidth = utils.getElementInnerWidth(this.slide);
      setSlideItemsDimensions(this.slideWidth);
      utils.animationX(this.slideWrapper, -(this.options.active * this.slideWidth), 0);
    });

    this.slideItems.forEach((el, index) => {
      el.addEventListener("mousedown", whenMouseDown);
      el.addEventListener("mousemove", whenMouseMove(index));
      el.addEventListener("mouseup", whenMouseUp);

      el.addEventListener("touchstart", whenMouseDown);
      el.addEventListener("touchmove", whenMouseMove(index));
      el.addEventListener("touchend", whenMouseUp);
    })
  }

  generateNavigation() {
    this.prevEl = document.querySelector(`${this.selector} ${this.options?.navigation?.prevEl}`);
    this.nextEl = document.querySelector(`${this.selector} ${this.options?.navigation?.nextEl}`);
    if (!this.prevEl && !this.nextEl) {
      return;
    }

    this._updateNavigation();
    if (this.prevEl) {
      this.prevEl.addEventListener("click", () => {
        this.options.active -= 1;
        this._setSlidePosition();
        this._updateNavigation();
      })
    }

    if (this.nextEl) {
      this.nextEl.addEventListener("click", () => {
        this.options.active += 1;
        this._setSlidePosition();
        this._updateNavigation();
      })
    }
  }

  _setSlidePosition() {
    const position = -this.options.active * this.slideWidth;
    utils.animationX(this.slideWrapper, position);
  }
  
  _updateNavigation() {
    if (this.prevEl) {
      if (this.options.active === 0) {
        this.prevEl.classList.add("disabled");
      } else {
        this.prevEl.classList.remove("disabled");
      }
    }

    if (this.nextEl) {
      if (this.options.active === this.slideItems.length - 1) {
        this.nextEl.classList.add("disabled");
      } else {
        this.nextEl.classList.remove("disabled");
      }
    }
  }
}

function App() {
  React.useEffect(() => {
    new VCCorpSwiper(".mySwiper", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, []);

  return (
    <div className="app">
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          <div className="swiper-slide">Slide 1</div>
          <div className="swiper-slide">Slide 2</div>
          <div className="swiper-slide">Slide 3</div>
          {/* <div className="swiper-slide">Slide 4</div>
          <div className="swiper-slide">Slide 5</div>
          <div className="swiper-slide">Slide 6</div>
          <div className="swiper-slide">Slide 7</div>
          <div className="swiper-slide">Slide 8</div>
          <div className="swiper-slide">Slide 9</div> */}
        </div>
        
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  )
}

export default App
