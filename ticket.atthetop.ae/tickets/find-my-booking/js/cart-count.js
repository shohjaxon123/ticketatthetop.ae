//Update cart
function cartCount() {

    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "cart_items_count",
            lang: language_site
        },
        success: function (response) {
            if (response.success == true) {
                if(response.data != 0) {
                    jQuery('.cart_count').text(response.data).addClass('show').removeAttr("style");
                }else{
                    jQuery('.cart_count').hide().removeClass('show');
                }                
            } else {
                jQuery('.cart_count').hide().removeClass('show');
            }
        },
        error: function (request, status, error) {
            jQuery('.cart_count').hide().removeClass('show');
        }
    });
}

if (window.location.href.indexOf("/cart") > -1){
} else {
    cartCount();
}