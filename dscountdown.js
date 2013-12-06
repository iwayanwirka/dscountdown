/*!
	dsCountDown v1.1
	jQuery count down plugin
	(c) 2013 I Wayan Wirka - http://iwayanwirka.duststone.com/dscountdown/
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function($){

	$.fn.dsCountDown = function(givenOptions){
		
		var ds = this;
		ds.data = {
			refreshed : 1000,
			thread : null,
			running : false,
			left : 0,
			decreament : 1,
			interval : 0,
			
			seconds : 0,
			minutes : 0,
			hours : 0,
			days : 0,
			
			elemDays: null,
			elemHours: null,
			elemMinutes: null,
			elemSeconds: null
		};
			
		
		var defaults = {
			startDate: new Date(),		// Date Object of starting time of count down, usualy now (whether client time or given php time)
			endDate: null,				// Date Object of ends of count down
			
			elemSelDays: '',			// Leave blank to use default value or provide a string selector if the lement already exist, Example: .ds-ds.data.days
			elemSelHours: '', 			// Leave blank to use default value or provide a string selector if the lement already exist, Example: .ds-ds.data.hours
			elemSelMinutes: '',			// Leave blank to use default value or provide a string selector if the lement already exist, Example: .ds-ds.data.minutes
			elemSelSeconds: '',			// Leave blank to use default value or provide a string selector if the lement already exist, Example: .ds-ds.data.seconds
			
			theme: 'white',				// Set the theme 'white', 'black', 'red', 'flat', 'custome'
			
			titleDays: 'Days',			// Set the title of ds.data.days
			titleHours: 'Hours',		// Set the title of ds.data.hours
			titleMinutes: 'Minutes',	// Set the title of ds.data.minutes
			titleSeconds: 'Seconds',	// Set the title of ds.data.seconds
			
			onBevoreStart: null,		// callback before the count down starts
			onClocking: null,			// callback after the timer just clocked
			onFinish: null				// callback if the count down is finish or 0 timer defined
		};
		
		ds.options = $.extend( {}, defaults, givenOptions );
		
		if (this.length > 1){
			this.each(function() { $(this).dsCountDown(givenOptions) });
			return this;
		}
		
		ds.init = function(){
			
			// Init element
			if(! ds.options.elemSelSeconds){			
				ds.prepend('<div class="ds-element ds-element-seconds">\
							<div class="ds-element-title">'+ ds.options.titleSeconds +'</div>\
							<div class="ds-element-value ds-seconds">00</div>\
						</div>');
				ds.data.elemSeconds = ds.find('.ds-seconds');
			}else{
				ds.data.elemSeconds = ds.find(ds.options.elemSelSeconds);
			}
			
			if(! ds.options.elemSelMinutes){
				ds.prepend('<div class="ds-element ds-element-minutes">\
							<div class="ds-element-title">'+ ds.options.titleMinutes +'</div>\
							<div class="ds-element-value ds-minutes">00</div>\
						</div>');
				ds.data.elemMinutes = ds.find('.ds-minutes');
			}else{
				ds.data.elemMinutes = ds.find(ds.options.elemSelMinutes);
			}		
			
			if(! ds.options.elemSelHours){
				ds.prepend('<div class="ds-element ds-element-hours">\
							<div class="ds-element-title">'+ ds.options.titleHours +'</div>\
							<div class="ds-element-value ds-hours">00</div>\
						</div>');
				ds.data.elemHours = ds.find('.ds-hours');			
			}else{
				ds.data.elemHours = ds.find(ds.options.elemSelHours);
			}
			
			if(! ds.options.elemSelDays){
				ds.prepend('<div class="ds-element ds-element-days">\
							<div class="ds-element-title">'+ ds.options.titleDays +'</div>\
							<div class="ds-element-value ds-days">00</div>\
						</div>');
				ds.data.elemDays = ds.find('.ds-days');
			}else{
				ds.data.elemDays = ds.find(ds.options.elemSelDays);
			}
			
			ds.addClass('dsCountDown');
			ds.addClass('ds-' + ds.options.theme);
			
			// Init start and end
			if(ds.options.startDate && ds.options.endDate){
				ds.data.interval = ds.options.endDate.getTime() - ds.options.startDate.getTime();
				if(ds.data.interval > 0){
					var allSeconds = (ds.data.interval / 1000);
					var hoursMod = (allSeconds % 86400);
					var minutesMod = (hoursMod % 3600);
					
					ds.data.left = allSeconds;
					ds.data.days = Math.floor(allSeconds / 86400);
					ds.data.hours = Math.floor(hoursMod / 3600);
					ds.data.minutes = Math.floor(minutesMod / 60);
					ds.data.seconds = Math.floor(minutesMod % 60);
				}
			}
			
			ds.start();
		}
		
		ds.stop = function(callback){
			if(ds.data.running){
				clearInterval(ds.data.thread);
				ds.data.running = false;
			}
			if(callback){
				callback(ds);
			}
		}
		
		ds.start = function(){
			$('#logger').append('<br/>Start');
			if(! ds.data.running){
				$('#logger').append('<br/>Clock');
				if(ds.data.left > 0){
					
					if(ds.options.onBevoreStart){
						ds.options.onBevoreStart(ds);
					}
				
					ds.data.thread = setInterval(
						function(){
							
							if(ds.data.left > 0){
								
								ds.data.left -= ds.data.decreament;
							
								ds.data.seconds -= ds.data.decreament;
								
								if(ds.data.seconds <= 0 && (ds.data.minutes > 0 || ds.data.hours > 0 || ds.data.days > 0)){	
									ds.data.minutes --;
									ds.data.seconds = 60;
								}
								
								if(ds.data.minutes <= 0 && (ds.data.hours > 0 || ds.data.days > 0)){
									ds.data.hours --;
									ds.data.minutes = 60;
								}
								
								if(ds.data.hours <= 0 && ds.data.days > 0){
									ds.data.days --;
									ds.data.hours = 24;
								}
								
								if(ds.data.elemDays)
									ds.data.elemDays.html((ds.data.days < 10 ? '0' + ds.data.days : ds.data.days));
								if(ds.data.elemHours)
									ds.data.elemHours.html((ds.data.hours < 10 ? '0' + ds.data.hours : ds.data.hours));
								if(ds.data.elemMinutes)
									ds.data.elemMinutes.html((ds.data.minutes < 10 ? '0' + ds.data.minutes : ds.data.minutes));
								if(ds.data.elemSeconds)
									ds.data.elemSeconds.html((ds.data.seconds < 10 ? '0' + ds.data.seconds : ds.data.seconds));
								
								if(ds.options.onClocking){
									ds.options.onClocking(ds);
								}
								
							}else{
								ds.stop(ds.options.onFinish);
							}
						},
						ds.data.refreshed);
					ds.data.running = true;
				}else{
					if(ds.options.onFinish){
						ds.options.onFinish(ds);
					}
				}
			}
		}
		
		ds.init();
		
		// var restart = function(){
			// stop();
			// start();
		// }
		
	}
})(jQuery);
