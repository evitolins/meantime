var ls = window.localStorage;

// The timer object collects a list of "spans" which represent
// a period of time the related item was active.
var Timer = function (name) {
    this.name = name || "A New Timer";
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
timers.push(new Timer('My timer A'));
timers.push(new Timer('My timer B'));
timers.push(new Timer('My timer C'));
timers.push(new Timer('My timer D'));

var v = new Vue({
    el: '#app',
    data: {
        name: 'Vue.js',
        timers: timers
    },
    computed: {
        current_time: function () {
          for(i=0;i<this.timers.length-1;i++) {
              if (this.timers[i].is_running) {
                  return moment.duration(this.timers[i].elapsed()).humanize();
              }
          }
        }
    },
    // define methods under the `methods` object
    methods: {
        add_timer: function () {
            var input = prompt("Please enter your task name...", "My New Task");
            if (input != null) {
                this.timers.push(new Timer(input));
            }
        },
        toggle_timer: function (timer) {
            timer.toggle()
        }
    }
});

