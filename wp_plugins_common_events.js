/* 
 * Js for wp_acharya,wp_spiritual,wp_magazine,wp_location,wp_itinerary plugins 
 * Author: Girish Vas
 * Plugin Version:1.1
 * Last Edit: 8-10-2016
 * Edited By: Br Saket 
 * Edit comments: $ replaced by jQuery by BrSaket 8-10-2016 
*/
	
	jQuery.noConflict();
	
	
	jQuery(document).ready(function () {

		jQuery("#addevent").click(function(){

			jQuery("#l-event").show();
		});

	
	});

	jQuery(function() {
		jQuery( ".dater" ).datetimepicker(
		{ dateFormat: 'yy-mm-dd' });
	});

	jQuery(function() {
		jQuery( ".dateto" ).datetimepicker(
		{ dateFormat: 'yy-mm-dd' });
	});

	function gstate(abc) {
		print_state('state',abc);
	}
