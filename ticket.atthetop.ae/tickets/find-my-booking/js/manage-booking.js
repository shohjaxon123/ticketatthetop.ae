var bilingual = JSON.parse(details.bilingual);
var invalid_icon = '<img src ="'+details.invalid_icon+'" alt="invalid icon">';
var countdown;
$(document).on('click', '.open-lightbox', function (e) {
    var id = this.id.substring(4);
    $('#gallery-' + id).trigger('click');
    $('body').addClass('body-scroll-lock');
})

$(document).on('click', '.view-gallery-btn', function (e) {
    $('.gallery-loop').first().trigger('click');
    $('body').addClass('body-scroll-lock');
});
$(document).ready(function () {
    $("#lightbox, .lb-close").click(function () {
        $('body').removeClass('body-scroll-lock');
    });
});

$(document).ready(function () {
    $('.otp-enter').on('input', function (e) {
        var maxLength = 1;
        var inputValue = $(this).val();

        if (inputValue.length === maxLength) {
            $(this).closest('.form-group').next().find('.otp-enter').focus();
        }
    });
});

$(document).on('click', '.get-otp', function (e) {
    e.preventDefault();
    var api_contact_no = jQuery('input[type="tel"]').val();
    var country_code = jQuery('.iti__selected-dial-code').text();
    var api_code = country_code.replace('+', '');
    var api_phoneNumber = api_code + api_contact_no;
    $('.otp-enter').val('');
    jQuery('#a_senton').text(country_code + ' - ' + api_contact_no);
    if (jQuery('.wpforms-error').is(':visible')) {
    } else if (api_contact_no == '') {
        // $('.wpforms-field-phone').html(details.empty_submit_error);
        $('.wpforms-field-phone').append('<em class="wpforms-error static-error" role="alert" aria-label="Error message" for="">'+details.empty_submit_error+'</em>');
    } else {
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: Aurl.ajaxurl,
            data: {
                nonce: Aurl.api_nonce,
                phoneNumber: api_phoneNumber,
                action: "emaar_send_booking_otp",
            },
            success: function (response) {
                clearInterval(countdown);
                if (response.success == true) {
                    otpTimer();
                    $('#otpModal').modal('show');
                    $('.otp-enter:first').focus();

                } else if (response.success == false) {
                    if (response.data != null) {
                        if (response.data.message == 'otp_already_sent') {
                            otpTimer();
                            $('#otpModal').modal('show');
                            $('.otp-enter:first').focus();
                        } else {
                            $('.wpforms-field-phone').append('<em class="wpforms-error static-error" role="alert" aria-label="Error message" for="">'+response.data+'</em>');
                        }
                    }
                } else {

                }
            },
            error: function (request, status, error) {
            }
        });
    }
});

function otpTimer() {
    var minutes = 2;
    var seconds = 0;
    var timerDisplay = $('.timer');

    countdown = setInterval(function () {
        seconds--;

        if (seconds < 0) {
            if (minutes === 0) {
                clearInterval(countdown);
                $('.verify-otp').attr("disabled", "disabled");
                $('.otp-enter').val('');
                $('#resend-otp').removeClass('disable');
                return;
            }
            minutes--;
            seconds = 59;
        }

        var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        var formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.text(formattedMinutes + ':' + formattedSeconds);
    }, 1000);
}

$(document).on('keyup', '.wpforms-smart-phone-field', function(){
    $('.wpforms-field-phone').find('.static-error').remove();
})

$(document).on('submit', '#verifyOTP', function (e) {
    e.preventDefault();
    verifyOTP();
});

$(document).on('keydown', '.otp-enter', function (e) {
    const key = event.key || event.keyCode || event.which;
    if (key === 'Enter' || key === 13) {
        event.preventDefault(); // Prevent form submission on Enter key press
        $('#verifyOTP').submit(); // Trigger form submission
    }
});

$(document).on('keydown', '.wpforms-smart-phone-field', function (e) {
    var api_contact_no = jQuery('input[type="tel"]').val();
    var form_id = $(this).closest('form').attr('id');
    const key = event.key || event.keyCode || event.which;
    if (key === 'Enter' || key === 13) {
        event.preventDefault(); // Prevent form submission on Enter key press
        if (jQuery('.wpforms-error').is(':visible')) {
        } else {
            if(validateInput(api_contact_no)) {
                $('.get-otp').trigger('click');
            } else {
                $('.wpforms-field-phone').append('<em class="wpforms-error static-error" role="alert" aria-label="Error message" for="">'+details.empty_submit_error+'</em>');
            }
        }
    }
});

function verifyOTP() {

    var api_contact_no = jQuery('input[type="tel"]').val();
    var country_code = jQuery('.iti__selected-dial-code').text();
    var api_code = country_code.replace('+', '');
    var api_phoneNumber = api_code + api_contact_no;

    var otpValues = [];
    $('.otp-enter').each(function () {
        if ($(this).val() != '') {
            otpValues.push($(this).val());
        }
    });
    var joinedValues = otpValues.join('');
    if (otpValues.length != 4) {
        $('.otp_error').html(invalid_icon+' '+details.invalid_otp);
    } else {

        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: Aurl.ajaxurl,
            data: {
                nonce: Aurl.api_nonce,
                phoneNumber: api_phoneNumber,
                otp: joinedValues,
                action: "emaar_valid_and_getdet",
            },
            success: function (response) {
                if (response.success == true) {
                    clearInterval(countdown);
                    $('.otp-enter').val('');
                    $('#otpModal').modal('hide');
                    $('.otp-screen').hide();
                    $('.success-response').show();
                    $.each(response.data, function (index, item) {
                        if(item.status == 0) {
                            $('.payment-alert').removeClass('d-none');
                            $('#alertMsg').text(details.payment_alert);
                        }
                        ticketContent(index, item);
                    });
                } else if (response.success == false) {
                    if (response.data.message == "invalid_customer") {
                        clearInterval(countdown);
                        invalid_customer();
                    } else if (response.data.message == "invalid_request") {
                        invalid_request();
                    } else if (response.data.message == "invalid_otp") {
                        invalid_otp();
                    } else {
                        if(response.data) {
                            exceeded_limit(response.data);
                        }
                    }
                } else {
                    $('.otp_error').html(invalid_icon+' '+details.empty_otp);
                    $('.otp-enter').addClass('error shake');
                    $('.otp-enter').val('');
                }
            },
            error: function (request, status, error) {

            }
        });
    }
}

$(document).on('click', '.verify-otp', function () {
    verifyOTP();
});

function invalid_customer() {
    $('.otp-enter').val('');
    $('.verify-otp').attr("disabled", "disabled");
    $('#otpModal').modal('hide');
    $('#errorModal').modal('show');

}
function invalid_request() {
    $('.otp-enter').val('');
    $('.otp_error').html(invalid_icon+' '+details.invalid_request);
    $('.otp-enter').addClass('error shake');
    $('.verify-otp').attr("disabled", "disabled");
}
function invalid_otp() {
    $('.otp-enter').val('');
    $('.otp_error').html(invalid_icon+' '+details.invalid_otp);
    $('.otp-enter').addClass('error shake');
    $('.verify-otp').attr("disabled", "disabled");
}
function exceeded_limit(msg) {
    $('.otp-enter').val('');
    $('.otp_error').html(invalid_icon+' '+msg);
    $('.otp-enter').addClass('error shake');
    $('.verify-otp').attr("disabled", "disabled");
}

function validateInput(input) {

    if (/^\d+$/.test(input)) {
        return true;
    } else {
        return false;
    }
}

function validateOTP(input,event) {

    $('.otp-enter').removeClass('error shake');
    $('.otp_error').empty();
    // Handle backspace
    if (event.keyCode === 8) {
        var $currentInput = $(input);
        var currentIndex = $('.otp-enter').index($currentInput);

        if (currentIndex > 0) {
            $('.otp-enter').eq(currentIndex - 1).focus();
            $('.verify-otp').attr("disabled", "disabled");
        }
        return;
    }
    var inputValue = input.value;
    var numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(inputValue)) {
        $('.verify-otp').attr("disabled", "disabled");
        return;
    }
    var otpValues = [];
    $('.otp-enter').each(function () {
        if ($(this).val() != '') {
            otpValues.push($(this).val());
        }
    });
    if (otpValues.length != 4) {
        $('.verify-otp').attr("disabled", "disabled");
        return;
    }
    $('.verify-otp').removeAttr("disabled");
}
function ticketContent(mainIndex, data) {

    var $ticketElement = '<div class="col-md-12 col-lg-12 find-booking">\
    <div class="row">\
        <div class="col-md-12 col-lg-12">\
            <div class="card h-100">\
                <div class="card-header">\
                    <h3>'+ details.title + '</h3>\
                </div>\
                <div class="card-body">\
                    <div class="body-section">\
                        <div class="col-sec-1">\
                            <h4>'+ details.name_field + '</h4>\
                            <h4 class="text-dark">'+ data.userDetails.name + '</h4>\
                        </div>\
                        <div class="col-sec-1">\
                        <h4>'+ details.phone_field + '</h4>\
                        <h4 class="text-dark">'+ data.userDetails.phone + '</h4>\
                    </div>\
                    <div class="col-sec-1">\
                           <h4>'+ details.email_field + '</h4>\
                            <h4 class="text-dark">'+ data.userDetails.email + '</h4>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="col-md-12 col-lg-12">\
            <div class="ticket-list">\
                <div class="container-fluid">\
                    <div class="row tickets tickets-data">';
    $.each(data.products, function (index, item) {
        $ticketElement += ticketProducts(index, item, data, mainIndex);
    });
    $ticketElement += '</div>\
                </div>\
            </div>\
        </div>\
    </div>\
</div>';

    $('.tickets-list').append($ticketElement);

    $.each(data.products, function (index, item) {
        $('#pdfData' + index).val(JSON.stringify(data.products[index]));
        $('#userDetails' + index).val(JSON.stringify(data));
    });


}

function ticketProducts(index, item, data, mainIndex) {

    // 
    var mainReferenceId = item.referenceId != '' ? item.referenceId : '-';
    var quantity = 0;
    var totalPrice = item.totalPrice.toFixed(2);
    if (item.visitors.hasOwnProperty('common')) {
        var quantity = item.visitors.common.quantity;
        var visitorText = quantity;
        var totalQuantity = visitorText;
    } else if (item.visitors.hasOwnProperty('adult') && item.visitors.hasOwnProperty('child')) {
        var adult_quantity = item.visitors.adult.quantity;
        var child_quantity = item.visitors.child.quantity;
        var visitorText = adult_quantity + (adult_quantity > 1 ? ' ' + bilingual.adults_lang : ' ' + bilingual.adult_lang) + ', ' + child_quantity + (child_quantity > 1 ? ' ' + bilingual.children_lang : ' ' + bilingual.child_lang);
        var totalQuantity = parseInt(adult_quantity) + parseInt(child_quantity);
    } else if (item.visitors.hasOwnProperty('adult') && item.visitors.hasOwnProperty('child') == 0) {
        var adult_quantity = item.visitors.adult.quantity;
        var visitorText = adult_quantity + ' ' + (adult_quantity > 1 ? ' ' + bilingual.adults_lang : ' ' + bilingual.adult_lang);
        var totalQuantity = adult_quantity;
    } else if (item.visitors.hasOwnProperty('adult') == 0 && item.visitors.hasOwnProperty('child')) {
        var child_quantity = item.visitors.child.quantity;
        var visitorText = child_quantity + (child_quantity > 1 ? ' ' + bilingual.children_lang : ' ' + bilingual.child_lang);
        var totalQuantity = child_quantity;
    }
    // 
    var hasAddons = item.totalAddons.length;
    var addonquantityGtm = 0;
    var addonpriceGtm = 0;
    if (hasAddons > 0) {
        var addonElement = '<div class="ticket-ref-col-inner-row">\
                            <h4>'+ bilingual.addons_lang + '</h4>\
                            <div>';

        $.each(item.totalAddons, function (i, addon) {
            addonquantityGtm += addon.quantity;
            addonpriceGtm += addon.totalPrice;
            addonElement += '<h3>' + addon.quantity + ' X ' + addon.name + '</h3>';
        });

        addonElement += '</div>\
                            </div>';

    } else {
        var addonElement = '<div class="ticket-ref-col-inner-row">\
        <h4>'+ bilingual.addons_lang + '</h4>\
        <div><h3>N/A</h3></div>\
        </div>';
    }
    if (item.ticket_tag != 'normal') {
        if (item.ticket_tag != '') {
            var ticket_tag = '<img src="' + details.theme_uri + '/assets/images/experiences/main/' + item.ticket_tag + '-' + details.language + '.svg" class="ml-3" alt="img">';
        } else {
            var ticket_tag = '';
        }
    } else {
        var ticket_tag = '';
    }

    var card_class = item.isPackage ? (item.ticket_tag != '' ? item.ticket_tag + '-package' : 'normal') : (item.ticket_tag != '' ? item.ticket_tag : 'normal');

    if (item.isPackage) {
        var packageTag = '<img src="' + details.theme_uri + '/assets/images/default/package-' + details.language + '.svg" class="ml-3" alt="img">';
    } else {
        var packageTag = '';
    }

    if (item.image_2 != '') {
        var imageShow = '<div class="image-holder">\
                        <img src="'+ item.image1 + '" class="img1 mr-1 w-50" alt="img">\
                        <img src="'+ item.image_2 + '" class="img1 w-50" alt="img"></div>';
    } else {
        var imageShow = '<div class="image-holder single_img">\
                        <img src="'+ item.image1 + '" class="img1 img-radius-2" alt="img">\
                        </div>';
    }

    if (item.totalTickets > 2) {
        var shadowElement = '<div class="ticket_card_shadow">\
                            <div class="shadow-element"></div>\
                            <div class="shadow-element"></div>\
                            </div>';
    } else if (item.totalTickets == 2) {
        var shadowElement = '<div class="ticket_card_shadow">\
                            <div class="shadow-element"></div>\
                            </div>';
    } else {
        var shadowElement = '';
    }

    if (item.primary_information) {

        var accordionElement = '<div class="accordion faq-booking" id="faq' + index + '-' + mainIndex + '">';
        $.each(item.primary_information, function (i, accordion) {
            var collapse = i == 0 ? 'true' : 'false';
            var collapseShow = i == 0 ? 'show' : '';
            var collapseAnchor = i == 0 ? 'collapsed' : '';
            accordionElement += '<div class="card">\
            <div class="card-header">\
                <a href="javascript:void(0);" id="faqhead-'+ index + '-' + i + '-' + mainIndex + '" data-toggle="collapse" data-target="#faq-' + index + '-' + i + '-' + mainIndex + '" aria-expanded="' + collapse + '" aria-controls="faq-' + index + '-' + i + '-' + mainIndex + '" class="btn btn-header-link ' + collapseAnchor + '">' + accordion.heading + '</a>\
            </div>\
            <div id="faq-'+ index + '-' + i + '-' + mainIndex + '" class="collapse ' + collapseShow + '" aria-labelledby="faqhead-' + index + '-' + i + '-' + mainIndex + '" data-parent="#faq' + index + '-' + mainIndex + '">\
                <div class="card-body">\
                '+ accordion.description + '\
                </div>\
            </div>\
        </div>';
        });
        accordionElement += '</div>';
    } else {
        var accordionElement = '';
    }

    var site_url_lang = item.lang;
    if(site_url_lang == 'en') {
        var redirect_to = details.site_url;
    } else {
        var redirect_to = details.site_url +'/'+site_url_lang;
    }

    var $ticketElement = '<div class="col-md-12 col-lg-12 col-12">\
    <div class="card mb-32">\
        <div class="card-header pdtb-24">\
            <h3>'+ item.name + '</h3>\
            <div class="button-group">\
                <a class="btn" href="'+ redirect_to + '/view-tickets/?id=' + data.sessionId + '&pid=' + item.mainProductId + '&i=' + index + '" target="_blank">' + bilingual.view_all_tickets_lang + '</a>\
                <a class="btn downloadTicket" id="form-'+ index + '">' + bilingual.download_tickets_lang + '</a>\
            </div>\
        </div>\
        <form method="POST" action="'+ redirect_to + '/download-ticket/" class="mt-5 pt-5" target="_blank" id="formdata-' + index + '" style="display:none;">\
            <input type="hidden" name="ticketPdfDownload" value="submitted">\
            <input type="hidden" name="referenceId" id="referenceId'+ index + '" value="' + item.referenceId + '">\
            <input type="hidden" name="pdfData" id="pdfData'+ index + '" value="">\
            <input type="hidden" name="userDetails" id="userDetails'+ index + '" value="">\
            <input type="hidden" name="logo" id="logo" value="'+ details.logo + '">\
            <input type="hidden" name="image_url" id="image_url" value="'+ details.theme_uri + '">\
        </form>\
        <div class="card-body">\
            <div class="row">\
                <div class="col-md-4">\
                    <div class="ticket-info-col">\
                        <div class="ticket-info-header">\
                            <h3>'+ bilingual.primary_informtion_lang + '</h3>\
                        </div>\
                        <div class="ticket-info-header-border"></div>\
                        <div class="ticket-ref-col">\
                            <div class="ticket-ref-col-inner">\
                                <div class="ticket-ref-col-inner-row">\
                                    <h4>'+ bilingual.reference_id_lang + '</h4>\
                                    <h3>'+ mainReferenceId + '</h3>\
                                </div>\
                                <div class="ticket-ref-col-inner-row">\
                                    <h4>'+ bilingual.total_tickets_lang + '</h4>\
                                    <h3>'+ item.totalTickets + '</h3>\
                                </div>\
                                <div class="ticket-ref-col-inner-row">\
                                    <h4>'+ bilingual.visitors_lang + '</h4>\
                                    <h3>'+ visitorText + '</h3>\
                                </div>\
                                '+ addonElement + '\
                                <div class="ticket-ref-col-inner-row">\
                                    <h4>'+ bilingual.total_price_lang + '</h4>\
                                    <h3> '+details.currency+' '+ totalPrice + '</h3>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-8">\
                    <div class="card '+ card_class + ' tickets-card">\
                        <div class="card-header mob-d-none">\
                            <div class="d-flex">\
                                <h4>'+ item.tickets[0].detailedName + '</h4>\
                                '+ ticket_tag + '\
                            </div>\
                            '+ packageTag + '\
                        </div>\
                        <div class="card-body p-0 d-flex aligns">\
                            '+ imageShow + '\
                            <div class="card-header mob-d-block w-100 pt-0 pl-0 pr-0 mob-ml-0">\
                                <div class="d-flex gap-2 mb-3">\
                                    '+ ticket_tag + '\
                                    '+ packageTag + '\
                                </div>\
                                <div class="d-flex">\
                                    <h4>'+ item.tickets[0].detailedName + '</h4>\
                                </div>\
                            </div>\
                            <div class="ticket-text">\
                                <div class="tickets-wrap">\
                                    <div class="flex-col-1">'
    if (item.dateOfVisiting != '') {
        $ticketElement += '<div class="flex-col-wrap">\
                                            <h6>'+ bilingual.date_lang + '</h6>\
                                            <h4>'+ moment(item.dateOfVisiting,'DD/MM/YYYY').format('MMMM DD, YYYY') + '</h4>\
                                        </div>';
    }
        if (item.timeOfVisiting != '') {
            $ticketElement += '<div class="flex-col-wrap">\
                                            <h6>'+ bilingual.time_lang + '</h6>\
                                            <h4>'+ item.timeOfVisiting + '</h4>\
                                        </div>'
        }
        $ticketElement += '<div class="flex-col-wrap">\
                                            <h6>'+ bilingual.quantity_lang + '</h6>\
                                            <h4>'+ item.tickets[0].qty + '</h4>\
                                        </div>\
                                        <div class="flex-col-wrap">\
                                            <h6>'+ bilingual.reference_id_lang + '</h6>\
                                            <h4>'+ item.tickets[0].detailreferenceId + '</h4>\
                                        </div>\
                                    </div>\
                                    <div class="flex-col-2">';
                                         if (item.status == 1) {
                                                        $ticketElement += '<div class="flex-col-wrap-2">'
                                                            if (item.tickets[0].qrCodeUrl != '') {
                                                                $ticketElement += '<img src="' + item.tickets[0].qrCodeUrl + '" class="" alt="img">'
                                                            }
                                                            if(item.dateOfVisiting != ''){
                                                            $ticketElement += '<h4>' + moment(item.dateOfVisiting,'DD/MM/YYYY').format('DD/MM/YYYY') + '</h4>';
                                                            }
                                                $ticketElement += '</div>';
                                                    } else {
                                                    $ticketElement += '<div class="flex-col-wrap-2 align-items-center failed-icon"><i class="fa warning fa-exclamation-triangle"></i></div>';
                                                    }
                                    $ticketElement += '</div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    '+ shadowElement + '\
                </div>\
            </div>\
        </div>\
        <div class="horizontal-line"></div>\
        <div class="card-body">\
            '+ accordionElement + '\
        </div>\
    </div>\
</div>';

    return $ticketElement;
}
//downlaod tikcet
$(document).on('click', '.downloadTicket', function () {

    var id = this.id.substring(5);
    $('#formdata-' + id).submit();
});

//resend-otp
$(document).on('click', '#resend-otp', function (e) {
    e.preventDefault();
    $('.otp_error').empty();
    $('#resend-otp').addClass('disable');
    var api_contact_no = jQuery('input[type="tel"]').val();
    var country_code = jQuery('.iti__selected-dial-code').text();
    var api_code = country_code.replace('+', '');
    var api_phoneNumber = api_code + api_contact_no;
    jQuery('#a_senton').text(country_code + ' - ' + api_contact_no);
    if (jQuery('.wpforms-error').is(':visible')) {
    } else {
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: Aurl.ajaxurl,
            data: {
                nonce: Aurl.api_nonce,
                phoneNumber: api_phoneNumber,
                action: "emaar_send_booking_otp",
            },
            success: function (response) {
                if (response.success == true) {
                    $('.otp-enter').val('');
                    $('.otp-enter:first').focus();
                    $('.otp-enter').removeClass('error shake');
                    otpTimer();

                } else {
                    $('.otp-enter').val('');
                }
            },
            error: function (request, status, error) {

            }
        });
    }
});
// Function to check if there are pending AJAX requests
function areTherePendingRequests() {
    return $.active > 0;
}
setInterval(() => {
    if (areTherePendingRequests()) {
        $('#main-loader').show();
    } else {
        $('#main-loader').hide();
    }
}, 100);
