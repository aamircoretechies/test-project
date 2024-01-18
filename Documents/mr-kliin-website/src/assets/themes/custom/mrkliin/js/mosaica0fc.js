(function ($, Drupal) {
	Drupal.behaviors.mrkliinMosaic = {
		attach: function (context, settings) {
			$('body', context).once('mosaic').each(function () {

					// Initialize masonry
					$('.field--name-field-gallery-image').Mosaic();

					// Initialize Lightbox
					$('.field--name-field-gallery-image').find('img').each(function(){
						var imgSrc = $(this).attr('src');
						var imgWrapper = $('<a href="#" data-featherlight="' + imgSrc + '"></a>');
	
						$(this).wrap(imgWrapper);
					});
			});
		}
	};
})(jQuery, Drupal);

