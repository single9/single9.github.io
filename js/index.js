(function () {
    window.addEventListener("DOMContentLoaded", function (ev) {
        let locs = document.getElementsByClassName("s9-loc");
        let pfx = ["webkit", "moz", "MS", "o", ""];
        let index = {};

        document.querySelectorAll(".s9-menu-item").forEach((val) => {
            val.addEventListener("click", locationSwitcher);
        });
        
        for (let i=0, len=locs.length; i<len; i++) {
            let data = locs[i];

            if (data.hasAttribute("s9-data-loc") !== true) {
                return;
            }

            index[data.getAttribute("s9-data-loc")] = data;
        }

        locationSwitcher();

        function locationSwitcher () {
            let target = location.hash.slice(1);

            if ( target in index === false) {
                return location.hash = "#about";
            }

            for (let i in index) {
                if ( i === target || index[i].classList.contains('uk-hidden')) continue;
                index[i].classList.add('out');

                PrefixedEventAniEnd(index[i], function () {
                    index[target].classList.remove('out');
                    index[target].classList.remove('uk-hidden');
                });
            }

            UIkit.offcanvas("#offcanvas-slide").hide();
        }

        function PrefixedEventAniEnd(element, callback) {
            let fn = function () {
                element.classList.add("uk-hidden");
                for (let i=0; i<pfx.length; i++) {
                    element.removeEventListener(pfx[i]+"animationend", fn);
                }
                callback();
            };

            for (let i=0; i<pfx.length; i++) {
                element.addEventListener(pfx[i]+"animationend", fn, false);
            }
        }

        window.onhashchange = locationSwitcher;
    });
})();