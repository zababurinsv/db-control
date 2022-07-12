/** RIDERS NAMESPACE
 ======================================== */

var riders = {};

riders.copy = function (rider_id){
		$.ajax({
				type: "POST",
				url: "rider.php",
				data: {
					action: "copy",
					id: rider_id
				},
				success: function (res) {
					if(res.status === "error") {
						//error
						asengine.displayErrorMessage($("#errormsg"), res.error);
					}
					else {
					   location.reload();
					}
				}
			});
	};
riders.delete =	function (element, rider_id) { 
		var row = $(element).parents(".rider-row");
		var c = confirm($_lang.are_you_sure);
		if(c) {
			$.ajax({
				type: "POST",
				url: "rider.php",
				data: {
					action: "deleterider",
					id: rider_id
				},
				success: function (res) {
					if(res.status === "error") {
						//error
						asengine.displayErrorMessage($("#errormsg"), res.error);
					}
					else {
						row.fadeOut(600, function () {
						 $(this).remove();
						});
					}
				}
			});
		}
	};

riders.publish = function (element, rider_id) {
	var name = $(element).parents(".rider-row").find(".rider_name");
	var modal_url    = $("#modal-url"),
	ajaxLoading = $("#ajax-loading"),
	detailsBody = $("#details-body"),
	modal_name = $("#modal-name"),
	modal       = $("#modal-publish-link");
	
	modal.modal('show');
	modal_name.text(name.innerHTML);
	
	ajaxLoading.show();
	
	detailsBody.hide();
	
	$.ajax({
       url: "rider.php",
       type: "POST",
       data: {
           action: "publish",
           id: rider_id
       },
       success: function (res) {
		   
		   if(res.status === "error") {
						//error
				asengine.displayErrorMessage($("#details-body"), res.error);
				ajaxLoading.hide();
			}
			else {
				modal_url.text("http://soundcheckbox.com/build/pub.php?id="+rider_id);
				ajaxLoading.hide();
				detailsBody.show();
				detailsBody.text(res.response);
			}
           
       }
   });
		
};

riders.publish_form = function (element, rider_id, rider_title, types) {
	var name = $(element).parents(".rider-row").find(".rider_name");
	var detailsBody = $("#details-body"),
	rider_id_input = $("#rider_id"),
	title_input = $("#title"),
	modal       = $("#modal-publish-rider");
	
	modal.modal('show');
	rider_id_input.value = rider_id;
	title_input.value = rider_title;	
		
};
	
riders.unpublish =	function (element, rider_id) {
	var name = $(element).parents(".rider-row").find(".rider_name");
	var modal_url    = $("#modal-url"),
	ajaxLoading = $("#ajax-loading"),
	detailsBody = $("#details-body"),
	modal_name = $("#modal-name"),
	modal       = $("#modal-publish-link");
	
	modal.modal('show');
	modal_name.text(name.innerHTML);
	
	ajaxLoading.show();
	
	detailsBody.hide();
	
	$.ajax({
       url: "rider.php",
       type: "POST",
       data: {
           action: "unpublish",
           id: rider_id
       },
       success: function (res) {
		   
		   if(res.status === "error") {
						//error
				asengine.displayErrorMessage($("#details-body"), res.error);
				ajaxLoading.hide();
			}
			else {
				modal_url.text("Rider " + rider_id + "has been unpublished");
				ajaxLoading.hide();
				detailsBody.show();
				detailsBody.text(res.response);
			}
           
       }
   });
		
};

riders.new = function () {
	var modal  = $("#modal-new-rider");
	modal.modal('show');
		
};