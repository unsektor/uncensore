/*!
 *  uncensore.js - Tiny library to reveal uncensored thoughts.
 *
 *	@version    1.0.0
 *  @author     Михаил Драгункин <contact@unsektor.com>
 *	@url        https://проекты.unsektor.com/uncensore.js
 *  @license    ISC
 *  @since      June 25, 2017
 */

;(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('uncensore', factory)
    } else if (typeof exports === 'object') {
        exports = module.exports = factory()
    } else {
        root.uncensore = factory()
    }
})(this, function () {
    return function (applicationContainer, configuration) {
        applicationContainer = applicationContainer || document.body;

        var defaultConfiguration = {
            'domain': (window.location.host) ? window.location.host : null,
            'uri': null,
            'storageKey': 'com.unsektor.library.uncensore.state'
        };

        if ('object' === typeof(configuration)) {
            // Copy default values to custom configuration, if they were not defined.
            Object.keys(defaultConfiguration).forEach(function (configurationKey) {
                if (!(configurationKey in configuration)) {
                    configuration[configurationKey] = defaultConfiguration[configurationKey];
                }
            });
        } else {
            configuration = defaultConfiguration
        }

        /**
         * Small cookie utility.
         */
        var cookie = new function () {
            /**
             * Set cookie.
             *
             * @param key
             * @param value
             */
            this.set = function (key, value) {
                document.cookie = key + '=' + value;
            };

            /**
             * Get cookie.
             *
             * @param key
             * @returns {*}
             */
            this.get = function (key) {
                if ('' === document.cookie) {
                    // Cookie is not set
                    return null;
                }

                var cookieList = document.cookie.split('; ');

                for (var i = 0; i < cookieList.length; i++) {
                    if (cookieList[i].indexOf('=') === -1) {
                        continue;
                    }

                    pair = cookieList[i].split('=');

                    cookieKey = decodeURIComponent(pair[0]);
                    cookieValue = decodeURIComponent(pair[1]);

                    if (key === cookieKey) {
                        return cookieValue;
                    }
                }

                return null;
            }
        };

        /**
         * Application object reference.
         */
        var self = this;

        /**
         * Application state.
         *
         * true - uncensored
         * false - censored (default)
         *
         * @private
         * @type {boolean}
         */
        var state = false; // must not be edited, because the value state as same as document.

        /**
         * Handles script toggle action event.
         *
         * @private
         * @method toggleElementCensure
         * @param censoredElement
         */
        var toggleElementCensure = function (censoredElement) {
            var censureValueAfter = censoredElement.getAttribute('data-censore');
            var censureValueBefore = censoredElement.innerText;

            censoredElement.setAttribute('data-censore', censureValueBefore);
            censoredElement.innerText = censureValueAfter;

            applicationContainer.dispatchEvent(new CustomEvent('censureToggled', {
                'detail': {
                    'state': state,
                    'censoredElement': censoredElement,
                    'censureValueAfter': censureValueAfter,
                    'censureValueBefore': censureValueBefore
                }
            }));
        };

        /**
         * Render.
         *
         * @method render
         * @public
         */
        this.render = function () {
            if (state) {
                applicationContainer.setAttribute('data-uncensore', '');
            } else {
                applicationContainer.removeAttribute('data-uncensore');
            }

            var censoredElementList = applicationContainer.querySelectorAll('[data-censore]');
            censoredElementList.forEach(toggleElementCensure);
        };

        /**
         * Save state to storage.
         *
         * @param state
         */
        var saveState = function (state) {
            cookie.set(
                configuration['storageKey'],
                state
                    + (';max-age=' + 60 * 60 * 24 * 3)
                    + (configuration['domain'] ? ';domain=' + configuration['domain'] : '')
            );
        };

        /**
         * Get saved state from storage.
         */
        var getState = function () {
            savedState = cookie.get(configuration['storageKey']);
            return (null === savedState) ? null : ('true' === savedState);
        };

        /**
         * @method toggle - toggle uncensore state.
         * @returns {Boolean} - returns toggled state.
         */
        this.toggle = function () {
            // Updates current application state & saves it to user storage.
            saveState(state = !state);

            // Renders updated state.
            this.render();
            return state;
        };

        /**
         * Init
         *
         * Read application saved state, and render if it is exists and it is true.
         * Initially render function should not called, because default document state is false.
         */
        if (state = getState()) { // set & check
            this.render();
        };

        /**
         * `⌥D` (`Alt + D`) shortuct bind for easier access
         */
        window.addEventListener('keydown', function (e) {
            if (68 === e.keyCode && true === e.altKey) {
                e.preventDefault();

                // Redirect to info page, if that has been specified and if user uses it for first time
                if (null === getState() && configuration['uri'] !== window.location.href) {
                    window.location.href = configuration['uri'];
                    return;
                }

                self.toggle();
            }
        });
    }
});
