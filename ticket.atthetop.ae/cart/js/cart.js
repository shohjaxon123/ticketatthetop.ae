var site_url = details.site_url;
var theme_url = details.theme_url;
var converter = {};
var grandTotal = 0;
var cartDetail = {};
var gtmData = [];
var singleGtm = {};
var bilingual = JSON.parse(details.bilingual);
$(document).ready(function () {

    moment.locale(details.api_language);
    if (details.api_language == 'en') {
        var localLang = 'en';
    } else if (details.api_language == 'ar') {
        moment.defineLocale(details.api_language + '-sa-mine', {
            parentLocale: details.api_language + '-sa',
            preparse: function (string) {
                return string;
            },
            postformat: function (string) {
                return string;
            }
        });
    }

    //call cart function
    get_fetch_cart_items();

});

function get_cart_redirect_url() {
    $('.cart-success').hide();
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "emaar_set_main_cart",
            lang: details.api_language
        },
        success: function (response) {
            if (response.success == true) {
                cartDetail['remote_cart_id'] = response.data.remote_cart_id;
                grandTotal += parseFloat(response.data.price_breakdown.tax.totalTax.toFixed(2));
                $('#s_tax').text(details.currency + ' ' + response.data.price_breakdown.tax.totalTax.toFixed(2));
                get_fetch_cart_items();
            } else {
                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').hide();
                $('.error-cart').show();

            }
        },
        error: function (request, status, error) {
            if (request.status == 404) {
                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').show();
            } else {
                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').hide();
                $('.error-cart').show();
            }
        }
    });
}

function get_fetch_cart_items() {

    $('#main-loader').show();
    jQuery.ajax({
        url: Aurl.ajaxurl,
        dataType: "json",
        data: {
            action: "fetch_cart_items",
            nonce: Aurl.api_nonce,
            lang: details.api_language
        },
        method: 'POST',
        success: function (response) {
            cartCount();
            if (response.success == true) {
                
                cartDetail['remote_cart_id'] = response.data.remote_cart_id;
                $('#main-loader').hide();
                $('.no-data').hide();
                $('.cart-success').fadeIn('slow');
                $('#cart_Elements').empty();
                $('#cartsummary').empty();
                $('#s_tax').text(details.currency + ' ' + response.data.totals.totalTax.toFixed(2));
                $('#b_grand_total').text(details.currency + ' ' + response.data.totals.totalWithTax.toFixed(2));
                cartDetail['grand_total'] = response.data.totals.totalWithTax.toFixed(2);
                $.each(response.data.items, function (index, item) {
                    cartContent(index, item);
                    bookingContent(index, item);
                });
            } else {
                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').hide();
                $('.error-cart').show();
                $('#cart_Elements').empty();
                $('#cartsummary').empty();
                $('.empty-summary').empty();
                $('.cart-div').empty();
            }
        },
        error: function (request, status, error) {
            cartCount();
            if (request.status == 404) {

                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').show();
                $('#cart_Elements').empty();
                $('#cartsummary').empty();
                $('.empty-summary').empty();
                $('.cart-div').empty();
            } else {
                $('#main-loader').hide();
                $('.cart-success').hide();
                $('.no-data').hide();
                $('.error-cart').show();
                $('#cart_Elements').empty();
                $('#cartsummary').empty();
                $('.empty-summary').empty();
                $('.cart-div').empty();
            }
        }
    });
}

//show cart elements
function cartContent(index, item) {

    var c_cart_id = item.id;
    var c_product_id = item.product_post_id;
    var c_package_post_id = item.package_post_id;
    var c_image = item.product_details[0].fields.image;
    var c_name = item.product_details[0].product.post_title;
    var c_date = item.product_details[0].fields.show_dates ? moment(item.date).format('MMMM DD, YYYY') : '';
    var c_startTime = item.startTimestamp;
    var c_endTime = item.endTimestamp;
    var c_time_range = item.timeslot !='' ? (formatDateTime(c_startTime)+'-'+formatDateTime(c_endTime)) : '';
    var c_time = item.product_details[0].fields.show_timeslots ? c_time_range : '';
    var c_adults = item.adult_quantity;
    var c_childs = item.child_quantity;
    var c_addons = item.addons;
    var c_product_type = item.product_post_type;
    var b_type_of_visitors = item.product_details[0].fields.type_of_visitors;
    var show_variable_n = item.product_details[0].fields.show_variable_name;

    if(b_type_of_visitors.adult == true) {
        var adult_lang = show_variable_n == true ? item.product_details[0].fields.adult.label : bilingual.adult_lang;
        var adults_lang = show_variable_n == true ? item.product_details[0].fields.adult.label : bilingual.adults_lang;
    }

    if(b_type_of_visitors.child == true) {
        var child_lang = show_variable_n == true ? item.product_details[0].fields.child.label : bilingual.child_lang;
        var children_lang = show_variable_n == true ? item.product_details[0].fields.child.label : bilingual.children_lang;
    }

    if (b_type_of_visitors.only_visitor == true) {
        var $visitorText = c_adults;
    } else if (b_type_of_visitors.adult == true && b_type_of_visitors.child == false) {
        var $visitorText = c_adults + (c_adults > 1 ? ' ' + adults_lang : ' ' + adult_lang);
    } else if (b_type_of_visitors.adult && b_type_of_visitors.child) {
        var $visitorText = (c_adults > 0) 
    ? c_adults + (c_adults > 1 ? ' ' + adults_lang : ' ' + adult_lang) 
    : '';
    $visitorText += (c_childs > 0) 
    ? (c_adults > 0 ? ', ' : '') + c_childs + ' ' + (c_childs > 1 ? children_lang : child_lang) 
    : '';
    } else if (b_type_of_visitors.adult == false && b_type_of_visitors.child == true) {
        var $visitorText = c_childs + (c_childs > 1 ? ' ' + children_lang : ' ' + child_lang);
    }

    if (c_addons != '' && c_addons != 'null') {
        var c_addons_details = item.addons_details;
        var addonsData = addonContent(c_addons_details, c_addons);
    } else {
        var addonsData = '<div class="cart_info">\
        <div class="cart_p">\
            <div class="text-label-cart">\
            '+ bilingual.addons_lang + '\
            </div>\
            <h6 class="na">N/A</h6>\
        </div>\
    </div>';
    }
    if (index != 0) {
        var classadd = 'mt-4';
    } else {
        var classadd = '';
    }

    if (c_product_type == 'package') {
        if (item.package_meta != '') {
            var packageTime = $.parseJSON(item.package_meta);
            var c_time = packageTime.timeslot;
        }

        var pkgImg = '<img src="' + theme_url + '/assets/images/default/package-' + details.api_language + '.svg" class="ml-2">';
        var idForModify = c_package_post_id;
        var package_id = '&package_id=' + idForModify;
        var typeofticket = c_package_post_id != c_product_id ? 'ticket' : 'package';
        if (item.product_details[0].fields.image_2 != '') {
            var imgBlock = '<div class="imgbox">\
                            <figure>\
                                <img src="'+ item.product_details[0].fields.image + '" />\
                            </figure>\
                            <figure>\
                                <img src="'+ item.product_details[0].fields.image_2 + '" />\
                            </figure>\
                        </div>'
        } else {
            var imgBlock = '<figure>\
                                <img src="'+ item.product_details[0].fields.image + '" />\
                            </figure>';
        }
    } else {
        var pkgImg = '';
        var idForModify = c_product_id;
        var package_id = '';
        var typeofticket = 'ticket';
        if (details.is_mobile) {
            var m_image = item.product_details[0].fields.image_mobile != false ? item.product_details[0].fields.image_mobile : item.product_details[0].fields.image;
            var imgBlock = '<figure>\
                                <img src="'+ m_image + '" />\
                            </figure>';
        } else {
            var imgBlock = '<figure>\
            <img src="'+ item.product_details[0].fields.image + '" />\
        </figure>';
        }
    }

    var $element = '<li class="p_l" id="data-' + c_cart_id + '">\
	'+ imgBlock + '\
	<div class="cart_box">\
		<h3 class="cart_title d-flex align-items-center">'+ c_name + ' ' + pkgImg + '</h3>\
		<div class="cart_wrapper">\
			<div class="cart_details">\
				<div class="cart_info">'
    if (c_date != '') {
        $element += '<div class="cart_p">\
						<div class="text-label-cart">'+ bilingual.date_lang + '</div>\
						<div class="text-title-cart">'+ c_date + '</div>\
					</div>';
    }
    $element += '<div class="cart_p">\
						<div class="text-label-cart">'+ bilingual.time_lang + '</div>\
						<div class="text-title-cart">'+ c_time + '</div>\
					</div>\
					<div class="cart_p">\
						<div class="text-label-cart">'+ bilingual.visitors_lang + '</div>\
						<div class="text-title-cart">'+ $visitorText + '</div>\
					</div>\
				</div>\
				'+ addonsData + '\
			</div>\
			<div class="mob-res d-flex align-items-center mt-3">\
				<div class="text-cart mr-2">'+ bilingual.cart_text_lang + '?</div> <div class="mob-show"><a href="' + details.modifyLink + '/?id=' + c_product_id + '&cart=' + c_cart_id + '&type=' + typeofticket + '&modify=true' + package_id + '" class="modify-action ml-2">\
					<div class="d-flex align-items-center text-color-primary btn-mod"> <img src="'+ theme_url + '/assets/images/svg/edit.svg"> <span class="ml-2 editbtn">' + bilingual.modify_lang + '</span> </div>\
				</a> <a href="javascript:void(0)" class="modify-action ml-2 removeItem" id="item-'+ c_cart_id + '">\
					<div class="d-flex align-items-center text-color-primary btn-mod"> <img src="'+ theme_url + '/assets/images/svg/delete.svg"> <span class="ml-2 editbtn">' + bilingual.remove_lang + '</span> </div>\
				</a></div>\
			</div>\
		</div>\
	</div>\
</li>';

    $('#cart_Elements').append($element);
}

function formatDate(originalDate, monthType) {

    var parts = originalDate.split('-');
    // Months array to convert numeric month to its name
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // Get the month name
    var monthName = months[parseInt(parts[1]) - 1];
    var monthName = monthType == 'half' ? monthName.substring(0, 3) : monthName;
    // Create the formatted date string
    var formattedDate = monthName + ' ' + parts[2] + ', ' + parts[0];
    return formattedDate;
}

function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
}

//show Addon html
function addonContent(addonsFields, addonsData) {

    var jsonObject = $.parseJSON(addonsData);
    var index = 0;
    var elementData = '';
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var addon = jsonObject[key];
            var addonPostId = addon.post_id;
            var addonquantity = addon.quantity;
            var addontimeslotid = addon.timeslotid;
            var addontimeslot = addon.timeslot;
            var addOnName = addonsFields[index][key].addon.post_title;

            elementData += '<div class="d-flex align-items-center text-title-cart mb-2">\
			                    <div> '+ addonquantity + ' X ' + addOnName + '</div>\
		                    </div>';
            index++; // Increment the index
        }
    }

    // return '<div class="col-xl-8 col-lg-8 col-md-6 col-12"><div class="text-label-cart mt-2">Add-ons</div>'+elementData+'</div>';

    return '<div class="cart_info">\
	            <div class="cart_p">\
		            <div class="text-label-cart">\
                        '+ bilingual.addons_lang + '\
                    </div>\
                    '+ elementData + '\
                </div>\
            </div>';
}


//show booking summary
function bookingContent(index, item) {

    var b_index = index + parseInt(1);
    var b_name = item.product_details[0].product.post_title;
    var b_date = item.product_details[0].fields.show_dates ? moment(item.date).format('MMM DD, YYYY') : '';
    var b_time = item.product_details[0].fields.show_timeslots ? item.timeslot : '';
    var b_startTime = item.startTimestamp;
    var b_endTime = item.endTimestamp;
    var b_time_range = item.timeslot !='' ? (formatDateTime(b_startTime)+'-'+formatDateTime(b_endTime)) : '';
    var b_time = item.product_details[0].fields.show_timeslots ? b_time_range : '';
    var b_adults = item.adult_quantity;
    var b_childs = item.child_quantity;
    var b_addons = item.addons;
    var b_product_type = item.product_post_type;
    var b_ticketTotal = item.itemTotal.toFixed(2);

    var b_type_of_visitors = item.product_details[0].fields.type_of_visitors;
    var b_show_variable_n = item.product_details[0].fields.show_variable_name;
    
    if (b_type_of_visitors.only_visitor == true) {
        var $adultHide = '';
        var $childHide = 'display:none;';
        var $visitorText = b_adults > 1 ? bilingual.visitors_lang : bilingual.visitor_lang;
        var $childText = '';
    } else if (b_type_of_visitors.adult == true && b_type_of_visitors.child == false) {
        var $adultHide = '';
        var $childHide = 'display:none;';
        var $visitorText = b_show_variable_n == true ? item.product_details[0].fields.adult.label : (b_adults > 1 ? bilingual.adults_lang : bilingual.adult_lang);
        var $childText = '';
    } else if (b_type_of_visitors.adult && b_type_of_visitors.child) {
        var $adultHide = b_adults > 0 ? '' : 'display:none';
        var $childHide = b_childs > 0 ?  'display:flex' : 'display:none';

        var $visitorText = b_show_variable_n == true ? item.product_details[0].fields.adult.label : (b_adults > 1 ? bilingual.adults_lang : bilingual.adult_lang);
        var $childText = b_show_variable_n == true ? item.product_details[0].fields.child.label : (b_childs > 1 ? ' '+bilingual.children_lang : ' '+bilingual.child_lang);
    } else if (b_type_of_visitors.adult == false && b_type_of_visitors.child == true) {
        var $adultHide = 'display:none;';
        var $visitorText = b_show_variable_n == true ? item.product_details[0].fields.adult.label : (b_adults > 1 ? bilingual.adults_lang : bilingual.adult_lang);
        var $childText = b_show_variable_n == true ? item.product_details[0].fields.child.label : (b_childs > 1 ? ' '+bilingual.children_lang : ' '+bilingual.child_lang);
        var $childHide = b_childs > 0 ?  'display:flex' : 'display:none';
    }
    if (b_type_of_visitors.only_visitor == true) {
        var gtmVisitors = b_adults;
    } else if (b_type_of_visitors.adult == true && b_type_of_visitors.child == false) {
        var gtmVisitors = b_adults + ' ' + $visitorText;
    } else if (b_type_of_visitors.adult && b_type_of_visitors.child) {
        var gtmVisitors = b_adults + ' ' + $visitorText;
        gtmVisitors += b_childs > 0 ? ', ' + b_childs + ' ' + $childText : '';
    } else if (b_type_of_visitors.adult == false && b_type_of_visitors.child == true) {
        var gtmVisitors = b_childs + ' '+ $childText;
    }

    var childText = $childText;

    if (b_product_type == 'package') {

        if (item.package_meta != '') {
            var packageTime = $.parseJSON(item.package_meta);
            var b_time = packageTime.timeslot;
        }

        var pkgTag = '<img src="' + theme_url + '/assets/images/default/package-' + details.api_language + '.svg" class="w-25">';

        var b_adult_price1 = item.product_details[0].fields.product_type == 'variable' ? parseFloat(item.product_details[0].fields.adult.totalPrice) : parseFloat(item.product_details[0].fields.single_item.totalPrice);

        var b_child_price2 = item.product_details[0].fields.child && item.product_details[0].fields.child.totalPrice ? item.product_details[0].fields.child.totalPrice : 0;

        var b_freechild = item.product_details[0].fields.child.free;
        var b_adult_price = b_adult_price1;
        var b_child_price = b_child_price2;
        // if (b_freechild > 0) {

        //     var freechild = parseInt(b_childs) - parseInt(b_freechild);
        //     if (freechild > 0) {
        //         var free_child = freechild;
        //     } else {
        //         var free_child = 0;
        //     }
        // } else {
        //     var free_child = b_childs;
        // }
    } else {
        // var free_child = b_childs;
        var pkgTag = '';
        var b_adult_price = item.product_details[0].fields.product_type == 'variable' ? parseFloat(item.product_details[0].fields.adult.totalPrice) : parseFloat(item.product_details[0].fields.single_item.totalPrice);

        var b_child_price = item.product_details[0].fields.child && item.product_details[0].fields.child.totalPrice ? item.product_details[0].fields.child.totalPrice : 0;
    }

    var adultPrice = b_adult_price.toFixed(2);
    var childPrice = b_child_price.toFixed(2);

    var addonRow = '';
    var addonTotalSum = 0;
    var addonquantityGtm = 0;
    if (b_addons != '' && b_addons != 'null') {
        var b_addons_details = item.addons_details;
        var jsonObject = $.parseJSON(b_addons);
        var indexKey = 0;
        for (var key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                var addon = jsonObject[key];
                var addonquantity = addon.quantity;
                addonquantityGtm += addonquantity;
                var addOnName = b_addons_details[indexKey][key].addon.post_title;
                var addOnName = b_addons_details[indexKey][key].addon.post_title;
                var addOnPrice = b_addons_details[indexKey][key].fields.totalPrice;
                var addOnCurrency = b_addons_details[indexKey][key].fields.currency;
                var addonTotal = parseFloat(addOnPrice.toFixed(2));
                addonTotalSum += addonTotal;
                if (indexKey == 0) addonRow += '<hr class="borderc py-1 my-0" />'
                addonRow += '<div class="row s_visitor_summary align-items-center">\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 mb-2"><span class="amt">'+ addonquantity + '</span><span>X</span><span>' + addOnName + '</span>\
					</div>\
				</div>\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 justify-content-end mb-2">'+ addOnCurrency + ' ' + addonTotal + '</div>\
				</div>\
			</div>';

                indexKey++;
            }
        }

    } else {
        var addonsData = '';
    }

    //seo datalayer code
    var gtmArray = {
        'item_id': item.product_details[0].fields.id,
        'item_name': item.product_details[0].product.post_title,
        'price': b_ticketTotal,
        'quantity': 1,
        'item_brand': item.product_details[0].product.post_title,
        'item_category': item.product_details[0].fields.ticket_tag,
        'booking_date': b_date,
        'booking_time': b_time,
        'visitors': gtmVisitors,
        'add_on_quantity': addonquantityGtm,
        'add_on_price': addonTotalSum,
    }
    gtmData.push(gtmArray);

    var $element = '<div class="cart_card">\
	<div class="cart-header" id="carthead'+ b_index + '">\
		<a href="#" class="btn btn-header-link collapsed" data-toggle="collapse" data-target="#cartsum'+ b_index + '"\
			aria-expanded="false" aria-controls="cartsum'+ b_index + '">\
			<div>\
				<div class="cart_head_title d-flex flex-column">\
                '+ pkgTag + '\
                <h6 class="sub-title-top">'+ bilingual.site_title_lang + '</h6>\
                    <h2 class=""><span class="mx-w-80 ellipse ticket-info">'+ b_name + '</span> </h2>\
				</div>\
				<div class="cart_head_para">\
					'+ b_date + ' | ' + b_time + '\
				</div>\
			</div>\
		</a>\
	</div>\
	<div id="cartsum'+ b_index + '" class="collapse" aria-labelledby="carthead' + b_index + '">\
		<div class="ticketsloop">\
			<div class="row s_visitor_summary align-items-center" style="'+ $adultHide + '">\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 mb-2"><span class="amt">'+ b_adults + '</span><span>X</span><span>' + $visitorText + '</span>\
					</div>\
				</div>\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 justify-content-end mb-2">'+ details.currency + ' ' + adultPrice + '</div>\
				</div>\
			</div>\
			<div class="row s_visitor_summary align-items-center" style="'+ $childHide + '">\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 mb-2"><span class="amt">'+ b_childs + '</span><span>X</span><span>' + childText + '</span>\
					</div>\
				</div>\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 justify-content-end mb-2">'+ details.currency + ' ' + childPrice + '</div>\
				</div>\
			</div>\
			'+ addonRow + '\
			<hr class="borderc py-1 my-0" />\
		</div>\
	</div>\
    <div class="row s_visitor_summary align-items-center">\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 mb-2">'+ bilingual.total_lang + '</div>\
				</div>\
				<div class="col-xl-6 col-lg-6 col-md-6 col-6">\
					<div class="visitor_amt fw-400 justify-content-end mb-2">'+ details.currency + ' ' + b_ticketTotal + '</div>\
				</div>\
			</div>\
</div><hr class="borderb" />';

    $('#cartsummary').append($element);
}

//remove item from cart
$(document).on('click', '.removeItem', function () {
    var cartId = this.id.substring(5);


    var modalPromise = new Promise(function (resolve, reject) {
        $('#confirmmodal').on('hidden.bs.modal', function () {
            reject('Modal closed without confirmation');
        });

        $('#confirmButton').click(function () {
            resolve('Modal confirmed');
        });
    });

    // Show the modal
    $('#confirmmodal').modal('show');

    modalPromise.then(function (result) {
        $('#main-loader').show();
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: Aurl.ajaxurl,
            data: {
                action: "delete_cart_item",
                cart_id: cartId,
                nonce: Aurl.api_nonce
            },
            success: function (response) {
                if (response.success == true) {
                    $('#data-' + cartId).remove();
                    grandTotal = 0;
                    // get_fetch_cart_items();
                    location.reload();
                } else {
                    $('#main-loader').hide();
                    Swal.fire({
                        title: bilingual.error_swal_text,
                        text: bilingual.error_swal_detail,
                        icon: 'error',
                        showConfirmButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#CFA76D',
                    }
                    )
                }
            },
            error: function (request, status, error) {
                $('#main-loader').hide();
                Swal.fire({
                    title: bilingual.error_swal_text,
                    text: bilingual.error_swal_detail,
                    icon: 'error',
                    showConfirmButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#CFA76D',
                }
                )
                // return false;
            }
        });

    }).catch(function (error) {

    });
});

//checkout
$(document).on('click', '.cart-checkout', function () {
    checkout();
    dataLayerCall();
});

function dataLayerCall() {
    dataLayer.push({
        'event': 'begin_checkout',
        'ecommerce': {
            'value': cartDetail['grand_total'],
            'currency': details.currency,
            'items': gtmData
        }
    })
}

function checkout() {
    $('#main-loader').show();
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "emaar_get_redirect_token",
            remote_cart_id: cartDetail['remote_cart_id'],
            lang: details.api_language
        },
        success: function (response) {
            if (response.success == true) {
                // $('#main-loader').hide();
                window.location.href = response.data;
                // window.location.href = decodeURIComponent(response.data);
                // console.log(decodeURIComponent(response.data));
                // console.log(response.data);
                // window.location.href = '/success-booking/?id=9a4905f7-81df-4f49-bbd9-dd2ccedf0965';
            } else {
                $('#main-loader').hide();
                Swal.fire({
                    title: bilingual.error_swal_text,
                    text: bilingual.error_swal_detail,
                    icon: 'error',
                    showConfirmButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#CFA76D',
                }
                )
            }
        },
        error: function (request, status, error) {
            $('#main-loader').hide();
            Swal.fire({
                title: bilingual.error_swal_text,
                text: bilingual.error_swal_detail,
                icon: 'error',
                allowOutsideClick: true,
                showConfirmButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#CFA76D',
            }
            )
        }
    });
}