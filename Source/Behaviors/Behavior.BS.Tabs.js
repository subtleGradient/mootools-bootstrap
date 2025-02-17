/*
---

name: Behavior.BS.Tabs

description: Instantiates Bootstrap.Tabs based on HTML markup.

license: MIT-style license.

requires:
 - Behavior/Behavior
 - Clientcide/Behavior.Tabs

provides: [Behavior.BS.Tabs]

...
*/
(function(){

	var tabs = Object.clone(Behavior.getFilter('Tabs'));

	Behavior.addGlobalFilters({
		'BS.Tabs': tabs.config
	});

	Behavior.setFilterDefaults('BS.Tabs', {
		'tabs-selector': '>li',
		'sections-selector': '+.tab-content > div',
		'selectedClass': 'active',
		smooth: false,
		smoothSize: false
	});

})();