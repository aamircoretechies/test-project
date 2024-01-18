(function($, Drupal) {
  Drupal.behaviors.mrkliinBehavior = {
    attach: function(context, settings) {
      $("body", context)
        .once("mrkliin")
        .each(function() {
          // Toggle open on FAQ questions
          $(".paragraph--type--question").each(function(index) {
            $(this).attr("id", "question-" + index);
          });

          $(".paragraph--type--question").click(function(e) {
            if ($("#" + e.currentTarget.id).hasClass("is-open")) {
              $("#" + e.currentTarget.id).removeClass("is-open");
            } else {
              $("#" + e.currentTarget.id).addClass("is-open");
            }
          });

          // Keep fixed menu under admin menu
          $(".header-menu").css(
            "top",
            $("#toolbar-bar").height() + $(".toolbar-tray").height()
          );

          // Menu shrinks if user scrolls down more than 100px
          $(window).scroll(function() {
            if ($(document).scrollTop() > 100 && $(window).width() > 992) {
              $(".header-menu").addClass("shrink");
              $(".home-link")
                .closest("li")
                .css("display", "none");
              $(".header-menu").css("box-shadow", "0px 0px 20px #1a272714");
            } else {
              $(".header-menu").removeClass("shrink");
              $(".home-link")
                .closest("li")
                .css("display", "block");
              $(".header-menu").css("box-shadow", "none");
            }
          });

          // Open menu on click
          /*$(".region-menu").click(function() {
            if ($(window).width() < 992) {
              if ($(".region-menu").hasClass("hamburger-open")) {
                $(".region-menu").removeClass("hamburger-open");
              } else {
                $(".region-menu").addClass("hamburger-open");
              }
            } else {
              $(".region-menu").removeClass("hamburger-open");
            }
          });*/

          // Counter for key figures
          // $(window).on("scroll", doScroll); // Create a new scroll function, so we can later unbind it without affecting all other scroll events

          //   function doScroll() {
          //     var windowOffset = $(window).scrollTop() + window.innerHeight;
          //     var elementOffset = $('.paragraph--type--key-figure').offset().top;

          //     if (windowOffset >= elementOffset) {
          //       $('.paragraph--type--key-figure').find('.field--name-field-number').each(function () {
          //         $(this).prop('Counter',0).animate({
          //             Counter: $(this).text()
          //         }, {
          //             duration: 2000,
          //             easing: 'swing',
          //             step: function (now) {
          //                 $(this).text(Math.ceil(now));
          //             }
          //         });
          //       });
          //       $(window).off('scroll', doScroll); // We unbind scroll event
          //     }
          //   };

          // Change default number picker on inputs

          $(".view-id-products")
            .find(".views-row:nth-of-type(3)")
            .addClass("product-dry-cleaning");
          $('<div class="button-down"></div>').insertAfter(
            $(".product-dry-cleaning").find(".product-info")
          );
          //
          // $('.button-down').click(function(){
          //   $('.product-dry-cleaning').toggleClass('is-open');
          // });
          //
          // $(".field--name-variations").find("input[type='number']").each(function() {
          //   var fullId = $(this)[0].id;
          //   var idNumber = fullId.match(/(\d+)(?!.*\d)/g);
          //   var id = parseInt(idNumber);
          //
          // $('<div class="quantity-icon-' + id + ' quantity-down" id="quantity-down-id-' + id + '"></div>').insertAfter($(this));
          // $('<div class="quantity-icon-' + id + ' quantity-up" id="quantity-up-id-' + id + '"></div>').insertAfter($(this));
          // $( ".quantity-icon-" + id ).wrapAll( "<div class='quantity-wrapper' />"); // Wrap both quantity icons together
          // });
          //
          // $('.quantity-up').click(function(e){
          //   var fullId = e.target.id;
          //   var idNumber = fullId.match(/(\d+)(?!.*\d)/g);
          //   var id = parseInt(idNumber);
          //
          //   var currentValue = $('#edit-quantity-0-value--' + id).val();
          //   currentValue++;
          //
          //   $('#edit-quantity-0-value--' + id).val(currentValue);
          // })
          //
          // $('.quantity-down').click(function(e){
          //   var min = 0;
          //   var fullId = e.target.id;
          //   var idNumber = fullId.match(/(\d+)(?!.*\d)/g);
          //   var id = parseInt(idNumber);
          //
          //   var currentValue = $('#edit-quantity-0-value--' + id).val();
          //   if (currentValue > 0 ) {
          //     currentValue--;
          //     $('#edit-quantity-0-value--' + id).val(currentValue);
          //   } else {
          //     $('#edit-quantity-0-value--' + id).val(min);
          //   }
          // })

          //   $(window).scroll(function() {
          //     var top_of_element = $(".paragraph--type--timeline").offset().top;
          //     var bottom_of_element = $(".paragraph--type--timeline").offset().top + $(".paragraph--type--timeline").outerHeight();
          //     var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
          //     var top_of_screen = $(window).scrollTop();

          //     console.log(top_of_element + 'top-of-element');
          //     console.log(bottom_of_element + 'bottom_of_element');
          //     console.log(bottom_of_screen + 'bottom_of_screen');
          //     console.log(top_of_screen + 'top_of_screen');

          //     if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){

          //     } else {
          //         // the element is not visible, do something else
          //     }

          // });

          if ($(window).width() > 992) {
            var $el = $(".paragraph--type--timeline").find("img");
            var lastScrollTop = $(window).scrollTop();
            var $w = $(window);
            var _x = 0;
            var _y = 0;

            $w.scroll(function(event) {
              var windowOffset = $(window).scrollTop() + window.innerHeight;
              var elementOffset = $(".paragraph--type--timeline").offset().top;
              var result = (windowOffset - elementOffset) * 1.5;
              var st = result;

              _x = st;
              _y = st;

              lastScrollTop = st;
              if (inViewport($el)) {
                $el.css("left", _x);
              }
            });

            //check if el is visible in viewport
            function inViewport($ele) {
              var lBound = $(window).scrollTop(),
                uBound = lBound + $(window).height(),
                top = $ele.offset().top,
                bottom = top + $ele.outerHeight(true);

              return (
                (top > lBound && top < uBound) ||
                (bottom > lBound && bottom < uBound) ||
                (lBound >= top && lBound <= bottom) ||
                (uBound >= top && uBound <= bottom)
              );
            }
          }

          // make padding smaller, if two text paragraphs are following each other
          $(".paragraph--type--text").each(function(index) {
            if (
              $(this)
                .parent()
                .next()
                .find(".paragraph--type--text").length > 0
            ) {
              $(this).css("padding-bottom", "0", "padding-top", "2em");
            } else if (
              $(this)
                .parent()
                .prev()
                .find(".paragraph--type--text").length > 0
            ) {
              $(this).css("padding-bottom", "2em", "padding-top", "2em");
            }
          });

          // make padding smaller, if two FAQ paragraphs are following each other
          $(".paragraph--type--faq").each(function(index) {
            if (
              $(this)
                .parent()
                .next()
                .find(".paragraph--type--faq").length > 0
            ) {
              $(this).css("padding-bottom", "0", "padding-top", "2em");
            } else if (
              $(this)
                .parent()
                .prev()
                .find(".paragraph--type--faq").length > 0
            ) {
              $(this).css("padding-bottom", "2em", "padding-top", "2em");
            }
          });
        });
    }
  };
})(jQuery, Drupal);
