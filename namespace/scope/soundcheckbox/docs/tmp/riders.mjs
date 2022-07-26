import axios from './modules/axios/index.mjs'

let riders = {};
riders.copy = function(rider_id) {
    // axios.post({
    //     type: "POST",
    //     url: "rider.php",
    //     data: {
    //         action: "copy",
    //         id: rider_id
    //     },
    //     success: function(res) {
    //         if (res.status === "error") {
    //             asengine.displayErrorMessage($("#errormsg"), res.error);
    //         } else {
    //             location.reload();
    //         }
    //     }
    // })
    // $.ajax({
    //     type: "POST",
    //     url: "rider.php",
    //     data: {
    //         action: "copy",
    //         id: rider_id
    //     },
    //     success: function(res) {
    //         if (res.status === "error") {
    //             asengine.displayErrorMessage($("#errormsg"), res.error);
    //         } else {
    //             location.reload();
    //         }
    //     }
    // });
};
riders.delete = function(element, rider_id) {
    var row = $(element).parents(".rider-row");
    var c = confirm($_lang.are_you_sure);
    if (c) {
        $.ajax({
            type: "POST",
            url: "rider.php",
            data: {
                action: "deleterider",
                id: rider_id
            },
            success: function(res) {
                if (res.status === "error") {
                    asengine.displayErrorMessage($("#errormsg"), res.error);
                } else {
                    row.fadeOut(600, function() {
                        $(this).remove();
                    });
                }
            }
        });
    }
};

riders.publish = function(element) {
    var title = element.form.elements.namedItem("publish_title").value;
    var contact_name = element.form.elements.namedItem("publish_name").value;
    var phone = element.form.elements.namedItem("publish_phone").value;
    var email = element.form.elements.namedItem("publish_email").value;
    var rider_id = element.form.elements.namedItem("rider_id").value;
    var rider_name = element.form.elements.namedItem("rider_name").value;
    var modal_url = $("#modal-url"),
        ajaxLoading = $("#ajax-loading"),
        detailsBody = $("#details-body"),
        modal_name = $("#modal-name"),
        modal = $("#modal-publish-link");
    modal_form = $("#modal-publish-rider");
    modal_form.modal('hide');
    modal.modal('show');
    modal_name.text(name);
    ajaxLoading.show();
    detailsBody.hide();
    $.ajax({
        url: "rider.php",
        type: "POST",
        data: {
            action: "save",
            id: rider_id,
            name: rider_name,
            title: title,
            contact: contact_name,
            phone: phone,
            email: email
        },
        success: function(res) {
            if (res.status === "error") {
                asengine.displayErrorMessage($("#details-body"), res.error);
                ajaxLoading.hide();
            } else {
                $.ajax({
                    url: "rider.php",
                    type: "POST",
                    data: {
                        action: "publish",
                        id: rider_id
                    },
                    success: function(res) {
                        if (res.status === "error") {
                            asengine.displayErrorMessage($("#details-body"), res.error);
                            ajaxLoading.hide();
                        } else {
                            modal_url.text("http://soundcheckbox.com/build/pub.php?id=" + rider_id);
                            ajaxLoading.hide();
                            detailsBody.show();
                            detailsBody.text(res.response);
                        }
                    }
                });
            }
        }
    });
};
riders.publish_form = function(element, rider_id, rider_name, rider_title, rider_contact, rider_phone, rider_email) {
    var detailsBody = $("#details-body"),
        rider_id_input = document.getElementById("publish_rider_id"),
        rider_name_input = document.getElementById("publish_rider_name"),
        title_input = document.getElementById("publish_title"),
        name_input = document.getElementById("publish_name"),
        phone_input = document.getElementById("publish_phone"),
        email_input = document.getElementById("publish_email"),
        modal = $("#modal-publish-rider");
    modal.modal('show');
    rider_id_input.value = rider_id;
    rider_name_input.value = rider_name;
    title_input.value = rider_title;
    name_input.value = rider_contact;
    phone_input.value = rider_phone;
    email_input.value = rider_email;
};
riders.unpublish = function(element, rider_id) {
    var name = $(element).parents(".rider-row").find(".rider_name");
    var modal_url = $("#modal-url"),
        ajaxLoading = $("#ajax-loading"),
        detailsBody = $("#details-body"),
        modal_name = $("#modal-name"),
        modal = $("#modal-publish-link");
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
        success: function(res) {
            if (res.status === "error") {
                asengine.displayErrorMessage($("#details-body"), res.error);
                ajaxLoading.hide();
            } else {
                modal_url.text("Rider " + rider_id + "has been unpublished");
                ajaxLoading.hide();
                detailsBody.show();
                detailsBody.text(res.response);
            }
        }
    });
};

riders.new = function() {
    var modal = $("#modal-new-rider");
    modal.modal('show');
};

export default riders
