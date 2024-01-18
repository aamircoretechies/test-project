(function (Drupal) {
  'use strict';

  Drupal.behaviors.PhoneInternational = {
    attach: function (context, settings) {
      // Do something like jquery.once. Be sure that this attach only runs once.
      var fields = document.querySelectorAll('.phone_international-number');
      if (fields.length) {
        if (!document.querySelector(".jsIntPhone")) {
          document.querySelector('.phone_international-number').classList.add('jsIntPhone');

          // Loop each one and load the library.
          fields.forEach(function (field) {
            // As we are using attach form, check first if its already loaded.
            var parent = field.parentElement;
            if (!parent.classList.contains('intl-tel-input')) {
              // Find the field that writes the code.
              var field_code = document.querySelector('[name="' + field.name + '"]');
              var country = field.getAttribute('data-country');
              var geolocation = field.getAttribute('data-geo');
              // Initialize the phone library.
              var iti = window.intlTelInput(field, {
                initialCountry: (geolocation > 0) ? 'auto' : country,
                geoIpLookup: function (callback) {
                  if (typeof aja === 'function') {
                    aja().url('https://extreme-ip-lookup.com/json/').data({}).on('success', function (resp) {
                      var countryCode = (resp && resp.countryCode) ? resp.countryCode : country;
                      callback(countryCode);
                    }).go();
                  }
                },
                nationalMode: false,
                autoPlaceholder: 'aggressive',
                formatOnDisplay: true,
                utilsScript: '/' + drupalSettings.phone_international.path + '/js/utilsTellInput.js',
              });

              // Check indicative number
              field.addEventListener('change', function (e) {
                var regex = new RegExp('^[+]');
                if (!regex.test(field.value)) {
                  field_code.value = '+' + iti.getSelectedCountryData().dialCode + '' + field.value;
                }
              });

            }
          });

        }
      }
    }
  };

})(Drupal);
