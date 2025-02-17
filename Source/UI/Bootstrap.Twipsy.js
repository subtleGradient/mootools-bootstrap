/*
---

name: Bootstrap.Twipsy

description: A simple tooltip implementation (twipsy) that works with the Twitter Bootstrap css framework.

license: MIT-style license.

requires:
 - /Bootstrap
 - /CSSEvents
 - More/Element.Position
 - Behavior/Behavior

provides: Bootstrap.Twipsy

...
*/

Bootstrap.Twipsy = new Class({

	Implements: [Options, Events],

	options: {
		location: 'above', //below, left, right
		animate: true,
		delayIn: 200,
		delayOut: 0,
		fallback: '',
		offset: 0,
		title: 'title', //element property
		trigger: 'hover', //focus, manual
		getContent: function(el){
			return el.get(this.options.title);
		}
	},

	initialize: function(el, options){
		this.element = document.id(el);
		this.setOptions(options);
		this._attach();
	},

	getTip: function(){
		if (!this.tip){
			this.tip = new Element('div.twipsy').addClass(this.options.location)
				 .adopt(new Element('div.twipsy-arrow'))
				 .adopt(
				   new Element('div.twipsy-inner', {
				     html: this.options.getContent.apply(this, [this.element]) || this.options.fallback
				   })
				 );
			if (this.options.animate) this.tip.addClass('fade');
			if (Browser.Features.cssTransition && this.tip.addEventListener){
				this.tip.addEventListener(Browser.Features.transitionEnd, this.bound.complete);
			}
			this.element.set('alt', '').set('title', '');
		}
		return this.tip;
	},

	show: function(){
		this._clear();
		this.getTip();
		var pos, edge, offset = {x: 0, y: 0};
		switch(this.options.location){
			case 'below':
				pos = 'centerBottom';
				edge = 'centerTop';
				offset.y = this.options.offset;
				break;
			case 'left':
				pos = 'centerLeft';
				edge = 'centerRight';
				offset.x = this.options.offset;
				break;
			case 'right':
				pos = 'centerRight';
				edge = 'centerLeft';
				offset.x = this.options.offset;
				break;
			default: //top
				pos = 'centerTop';
				edge = 'centerBottom';
				offset.y = this.options.offset;
		}
		if (typeOf(this.options.offset) == "object") offset = this.options.offset;
		this.tip.inject(document.body).show().position({
			relativeTo: this.element,
			position: pos,
			edge: edge,
			offset: offset
		}).removeClass('out').addClass('in');
		this.visible = true;
		if (!Browser.Features.cssTransition || !this.options.animate) this._complete();
	},

	hide: function(){
		this.getTip();
		this.tip.removeClass('in').addClass('out');
		this.visible = false;
		if (!Browser.Features.cssTransition || !this.options.animate) this._complete();
	},

	destroy: function(){
		this._detach();
		if (this.tip) this.tip.destroy();
		this.destroyed = true;
	},

	// PRIVATE METHODS

	_attach: function(method){
		method = method || 'addEvents';
		this.bound = {
			enter: this._enter.bind(this),
			leave: this._leave.bind(this),
			complete: this._complete.bind(this)
		};

		if (this.options.trigger == 'hover') {
			this.element[method]({
				mouseenter: this.bound.enter,
				mouseleave: this.bound.leave
			});
		} else if (this.options.trigger == 'focus'){
			this.element[method]({
				focus: this.bound.enter,
				blur: this.bound.leave
			});
		}
	},

	_detach: function(){
		this._attach('removeEvents');
	},

	_clear: function(){
		clearTimeout(this._inDelay);
		clearTimeout(this._outDelay);
	},

	_enter: function(){
		this._clear();
		if (this.options.delayIn){
			this._inDelay = this.show.delay(this.options.delayIn, this);
		} else {
			this.show();
		}
	},

	_leave: function(){
		this._clear();
		if (this.options.delayOut){
			this._outDelay = this.hide.delay(this.options.delayOut, this);
		} else {
			this.hide();
		}
	},

	_complete: function(){
		if (!this.visible){
			this.tip.dispose();
		}
		this.fireEvent('complete', this.visible);
	}

});