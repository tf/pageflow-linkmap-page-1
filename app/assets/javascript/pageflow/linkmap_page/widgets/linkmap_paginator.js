/*global IScroll*/

(function($) {
  $.widget('pageflow.linkmapPaginator', {
    _create: function() {
      this.scrollerInner = this.element.children().first();
      this.container = this.element.find('.pager-pages');

      this.cloneFirstAndLastPageForCarousel();

      this.pages = this.element.find('.pager-page');

      this.scroller = new IScroll(this.element[0], {
        scrollY: false,
        scrollX: true,
        snap: '.pager-page',
        momentum: false,
        bounce: false,
        probeType: 3,
        eventListenerTarget: this.options.scrollerEventListenerTarget[0]
      });

      this.translatePagesVerticallyWhileScrolling();
      this.setupCarousel();
      this.setupChangeCallbackTrigger();
    },

    refresh: function() {
      this.updatePageWidths();
      this.cachePageHeights();

      this.scroller.refresh();
    },

    updatePageWidths: function() {
      var pageWidth = this.element.width();

      this.pages.css({width: pageWidth + 'px'});
      this.scrollerInner.css({width: (this.pages.length * pageWidth) + 'px'});
    },

    cachePageHeights: function() {
      this.pageHeights = this.pages.map(function() {
        return $(this).outerHeight();
      }).get();
    },

    translatePagesVerticallyWhileScrolling: function() {
      var widget = this;
      var scroller = this.scroller;

      scroller.on('scroll', function() {
        var direction = scroller.x > scroller.currentPage.x ? -1 : 1;

        var currentPageIndex = scroller.currentPage.pageX;
        var destinationPageIndex = currentPageIndex + direction;

        var currentPageHeight = widget.pageHeights[currentPageIndex];
        var destinationPageHeight = widget.pageHeights[destinationPageIndex];

        var pageWidth = scroller.pages[0][0].width;
        var progress = Math.min(1, Math.abs(scroller.currentPage.x - scroller.x) / pageWidth);

        translateY(widget.container,
                   currentPageHeight * (1 - progress) + destinationPageHeight * progress);
      });

      scroller.on('scrollEnd', function() {
        update();
      });

      scroller.on('refresh', function() {
        update();
      });

      function update() {
        var currentPageIndex = scroller.currentPage.pageX;
        translateY(widget.container, widget.pageHeights[currentPageIndex]);
      }
    },

    cloneFirstAndLastPageForCarousel: function() {
      var pages = this.element.find('.pager-page');
      var container = this.element.find('.pager-pages');

      pages.first().clone().appendTo(container);
      pages.last().clone().prependTo(container);
    },

    setupCarousel: function() {
      var scroller = this.scroller;
      var pages = this.pages;

      scroller.on('scrollEnd', function() {
        var currentPageIndex = scroller.currentPage.pageX;

        if (currentPageIndex === 0) {
          scroller.goToPage(pages.length - 2, 0, 0);
        }
        else if (currentPageIndex == pages.length - 1) {
          scroller.goToPage(1, 0, 0);
        }
      });
    },

    setupChangeCallbackTrigger: function() {
      var changeCallback = this.options.change;
      var pages = this.pages;
      var scroller = this.scroller;

      if (changeCallback) {
        scroller.on('scrollEnd', function() {
          var currentPageIndex = scroller.currentPage.pageX;
          var currentPageIndexIgnoringClonedPages = (currentPageIndex - 1) % (pages.length - 2);

          changeCallback(currentPageIndexIgnoringClonedPages);
        });
      }
    }
  });

  function translateY(element, y) {
    element.css('transform', 'translate3d(0, -' + y + 'px, 0)');
  }
}(jQuery));