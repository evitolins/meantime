var ls = window.localStorage;
var counter = 0;

// The timer object collects a list of "spans" which represent
// a period of time the related item was active.
var Timer = function (name, link) {
    this.name = name || "A New Timer";
    this.link = link || "";
    this.created = Date.now();
    this.spans = [];
    this.is_running = false;
};
Timer.prototype.start = function () {
    if (this.is_running) return;
    else this.is_running = true;
    var new_span = [Date.now(), undefined];
    this.spans.push(new_span);
};
Timer.prototype.stop = function () {
    if (!this.is_running) return;
    else this.is_running = false;
    this.spans[this.spans.length-1][1] = Date.now();
};
Timer.prototype.toggle = function () {
    if (this.is_running) {
        this.stop();
    } else {
        this.start();
    }
};
Timer.prototype.elapsed = function () {
    var total = 0;
    var a,b;
    this.spans.forEach(function (val, idx, arr) {
        if (idx === arr.length-1 && !val[1]) {
            total += Date.now() - val[0];
            return;
        }
        if (!val[0] || !val[1]) return;
        total += val[1] - val[0];        
    } );
      
    return total;
};


var timers = [];
timers.push(new Timer('Frontend Dev'));
timers.push(new Timer('API Documentation'));
timers.push(new Timer('Working on marketing stratagy'));
timers.push(new Timer('Github Issue #28', 'https://github.com/rgblabs/rgbnotes_api_django/issues/28'));



var v = new Vue({
    el: '#app',
    data: {
        name: 'Vue.js',
        timers: timers,
        timers_ui: []
    },
    // define methods under the `methods` object
    methods: {
        add_timer: function () {
            var input = prompt("Please enter your task name...", "My New Task");
            if (input != null) {
                this.timers.push(new Timer(input));
                this.timers_ui.push(0);
            }
        },
        toggle_timer: function (timer) {
            timer.toggle()
            if (timer.is_running) {
                for (var i = this.timers.length - 1; i >= 0; i--) {
                    if (this.timers[i] !== timer) {
                        this.timers[i].stop();
                    }
                }
            }
        }
    },

    ready: function () {
        var ui_refresher = Refresher(function(){}, 1, true);
        var that = this;
        var val, duration, humanized;

        // Loop for realtime timers
        ui_refresher.setCallback( function () {
            for (var i = that.timers.length - 1; i >= 0; i--) {
                elapsed = that.timers[i].elapsed();
                duration = moment.duration(elapsed);
                humanized = duration.humanize();
                days = duration.days();
                hours = duration.hours();
                minutes = duration.minutes();
                seconds = duration.seconds();
                Vue.set(that.timers_ui, i, {'elapsed': elapsed, 'display': days+':'+hours+':'+minutes+':'+seconds});
            }
        });
        ui_refresher.start();
    }
});

