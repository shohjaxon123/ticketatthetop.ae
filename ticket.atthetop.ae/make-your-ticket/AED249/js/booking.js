var totalSummry = {};
totalSummry['package'] = {}
totalSummry['addon'] = 0;
totalSummry['adult'] = 0;
totalSummry['child'] = 0;
totalSummry['addon_object'] = {};
var bilingual = JSON.parse(details.bilingual);
var grandTotal = 0;
var defaultDate = null;
var cartData;
// details.api_child_price = 0;
// Update Date
var timeSlotArray = [];
var summaryObject = [];
summaryObject['date'] = bilingual.not_selected_lang;
var currentImage = $('#s_ticket_image').attr('src');
var currentTicketName = details.apt_ticket_name;
var oldElement = '';
var addonsFetch = '';
var tabIndex = ['date', 'visitors']; // Initial values
var textForadult1 = '';
var textforVisitor = '';
var child_lang,children_lang ;
var packageTandC = {};

$(document).ready(function () {

    //set the Go back url
    var backUrl = localStorage.getItem('previousPage');
    var redirectTo = backUrl !='' ? backUrl : details.site_url;
    $('#redirect-link').attr('href',redirectTo);


    if (typeof details == 'undefined') {

        errorAlert();
    }

    moment.locale(details.api_language);
    if(details.api_language == 'en') {
        var localLang = 'en';
    } else if(details.api_language == 'ar') {
        moment.defineLocale(details.api_language+'-sa-mine', {
            parentLocale: details.api_language+'-sa',
            preparse: function (string) {
              return string;
            },
            postformat: function (string) {
              return string;
            }
          });
    }

    var modify = details.api_modify;

    var packagesShow = details.packagesShow
    var addonShow = details.addonShow
    var timeSlotsShow = details.timeSlotsShow;
    textForadult1 = details.api_show_vairbale_name == '1' ? details.api_adult_name : bilingual.adult_lang;
    child_lang = details.api_show_vairbale_name == '1' ? details.api_child_name : bilingual.child_lang;
    children_lang = details.api_show_vairbale_name == '1' ? details.api_child_name : bilingual.children_lang;
    if (details.api_type_visitor == '1') {
        textForadult1 = bilingual.visitor_lang;
        textforVisitor = bilingual.visitors_lang
    } else if (details.api_type_visitor == '0' && details.api_type_adult == '1') {
        textForadult1 = details.api_show_vairbale_name == '1' ? details.api_adult_name : bilingual.adult_lang;
        textforVisitor = details.api_show_vairbale_name == '1' ? details.api_adult_name : bilingual.adults_lang;
    }
    //if cart iyem is modifying
    if (modify == 'true') {

        var api_cartId = details.api_cartId

        //fetch the cart item details
        get_fetch_cart_items(api_cartId);
        jQuery('.cart-submit').removeAttr('disabled');
        jQuery('.confirm-btn').removeAttr('disabled');
        //Loading
        if(details.dateShow == 1 || details.timeSlotsShow == 1) {
        } else {
            // $('#main-loader').hide();
            $('#calendar-loader').hide();
        }
        if (details.api_booking_type == 'package') {
            $('#ticket-image').hide();
            $('#package-image').show();
            $('.package-tag').show();
        }

    } else {
        //if item going to add in cart

        //hide the visitor section html
        $(".s_visitor_summary").hide();
        $(".ticket_recommendation").hide();

        if (details.api_booking_type == 'package') {
            $('#ticket-image').hide();
            $('#package-image').show();
            $('.package-tag').show();
        }

        $('.quantity__minus').addClass('disabled-decrement');
        $('.kid-free').hide();

        //Loading
        if(details.dateShow == 1 || details.timeSlotsShow == 1) {
            // $('#main-loader').show();
        } else {
            // $('#main-loader').hide();
            $('#calendar-loader').hide();
        }
        
        //disbaled tabs
        $(".calendar_card:not(:first-child)").css({ 'pointer-events': 'none', 'opacity': '0.4' });
    }
    function get_fetch_cart_items(api_cartId) {

        // $('#main-loader').show();
        jQuery.ajax({
            url: Aurl.ajaxurl,
            dataType: "json",
            data: {
                action: "emaar_cart_item",
                nonce: Aurl.api_nonce,
                cart_id: api_cartId
            },
            method: 'POST',
            success: function (response) {
                if (response.success == true) {

                    if(details.packagesShow == 0 && details.addonShow == 0) {

                        // $('#main-loader').hide();
                    }
                    cartData = response.data;
                    // $('#loading').hide();
                    details.api_selected_date = cartData.date;
                    if(details.timeSlotsShow == 1) {

                        timeSlots(details.api_selected_date);
                    }
                    if(details.packagesShow == 1) {
                        get_packages(details.api_post_id);
                    }
                    // var adultPricing = details.api_adult_price;
                    // var childPricing = details.api_child_price;
                    details.temp_selected_date = details.dateShow ? formatDateTemp(cartData.date, 'full') : ''
                    defaultDate = details.temp_selected_date;
                    defaultDate = moment(cartData.date).format('YYYY-MM-DD')
                    if(details.dateShow == 1) {

                        fetch_calendar();
                    }
                    $('.s_date').text(moment(cartData.date).format('LL')).css({ "font-weight": "bolder", "color": "#000" });
                    $('.dateslots td').removeClass('notselected');

                    details.api_adult_number = cartData.adult_quantity;
                    $('.adult_input').val(details.api_adult_number)
                    details.api_child_number = cartData.child_quantity;
                    if (details.api_child_number == '0') $('[data-target="quantity-input-2"].del_visitor').addClass("disabled-decrement");
                    $('.child_input').val(details.api_child_number)
                    addonsFetch = cartData.addons;
                    
                    details.api_selected_slot = cartData.timeSlotId;
                    details.api_selected_slot_timing = cartData.timeslot;
                    details.button_click = 1;

                    //Booking Summary Visitor details
                    var visitorsText = "";
                    if (details.api_adult_number > 0) {
                        visitorsText += details.api_adult_number + " " + (details.api_adult_number > 1 ? textforVisitor : textForadult1);
                    }
                    if (details.api_child_number > 0 && details.api_type_child == '1') {
                        if (details.api_adult_number > 0) {
                            visitorsText += " | " + details.api_child_number + (details.api_child_number > 1 ? " "+children_lang : " "+child_lang);
                        } else {
                            visitorsText += details.api_child_number + (details.api_child_number > 1 ? " "+children_lang : " "+child_lang);
                        }
                    }
                    $(".s_visitors").text(visitorsText);
                    $(".s_visitor_count").text(visitorsText.replace(/\|/g, ','));
                    var adultTotalTxt = details.api_adult_number > 0 ? details.api_adult_number + "&nbsp; X &nbsp;" + textForadult1 : "";

                    var childTotalTxt = details.api_child_number > 0 ? details.api_child_number + "&nbsp; X &nbsp;"+(details.api_child_number > 1 ? children_lang : child_lang) : "";
                    $("#s_adult_total").html(adultTotalTxt);
                    $("#s_child_total").html(childTotalTxt);

                    //if timeslot not available
                    if(details.timeSlotsShow == 0) {
                        var adultTotalAmt = details.api_adult_number > 0 ? details.api_adult_price * details.api_adult_number : 0;
                        var childTotalAmt = details.api_child_number > 0 ? details.api_child_price * details.api_child_number : 0;
                        totalSummry['adult'] = parseFloat(adultTotalAmt).toFixed(2);
                        totalSummry['child'] = parseFloat(childTotalAmt).toFixed(2);
        
                        $("#s_adult_total_amt").text(details.api_adult_number > 0 ? details.currency+" " + totalSummry['adult'] : "");
                        $("#s_child_total_amt").text(details.api_child_number > 0 ? details.currency+" " + totalSummry['child'] : "");
                        sumOfGrand(1,totalSummry['adult'], totalSummry['child'], 0, 0);
                    }

                    //Booking Time Slot
                    var modifiedString = details.api_selected_slot_timing;
                    $('.s_slot').text(modifiedString);

                    //if addons selected
                    if (cartData.product_post_type == 'package') {
                        details.api_selected_package_id = cartData.package_post_id;
                        var productIdPkg = details.api_selected_package_id;

                    } else {
                        details.api_selected_package_id = 0;
                        var productIdPkg = details.api_post_id;
                    }
                    if (addonsFetch != '' && addonsFetch != 'null') {
                        addonsOnModify(productIdPkg, cartData.addons_details, addonsFetch);
                    } else {
                        get_addons(productIdPkg);
                        $('#loading').show();
                    }

                    // Update Date
                    var summaryObject = [];
                    summaryObject['date'] = details.dateShow ? formatDateTemp(details.api_selected_date, 'full') : '';
                    packageCalc();

                } else {
                    errorAlert();
                }
            },
            error: function (response) {
                errorAlert();
            }
        });
    }

    if (timeSlotsShow !== 0) {
        var timeSlotsIndex = tabIndex.indexOf('date') + 1;
        tabIndex.splice(timeSlotsIndex, 0, 'time');
    }

    //check if ticket post id exist
    var api_ticket_id = details.api_ticket_id;
    if (api_ticket_id != '' && api_ticket_id != 0 && modify == 'false') {
        if(details.dateShow == 1) {
            fetch_calendar();
        }
    } else {

    }
})
function fetch_calendar() {
    //Calendar API
    $('#calendar-loader').show();
    $('#calendar').hide();

    if(details.api_dummy_dates) {
        normalDatePicker();
    } else {
        apiDatePicker();
    }
}

function updateArrowButtons(year, month,maxDate) {
    const currentMonth = new Date(year, month, 1);
    if (currentMonth >= maxDate) {
        var css = '.page_ticketbooking .ui-datepicker-next::after { filter: brightness(1); }';
                    $('<style>').prop('type', 'text/css').html(css).appendTo('head');
    } else {
        var css = '.page_ticketbooking .ui-datepicker-next::after { filter: brightness(0.1); }';
        $('<style>').prop('type', 'text/css').html(css).appendTo('head');
    }
  }

//api wise datepicker
function apiDatePicker() {

    jQuery.ajax({
        url: Aurl.ajaxurl,
        dataType: "json",
        data: {
            nonce: Aurl.api_nonce,
            action: "get_product_dates",
            product_id: details.api_ticket_id // Send the product id.
        },
        method: 'POST',
        success: function (response) {
            if (response['success'] == true) {
                var dateClasses = response['data'];
                var firstKeyValuePair = Object.entries(dateClasses)[0];
                if (firstKeyValuePair) {
                    var firstKey = firstKeyValuePair[0];
                    var dateToday = new Date(firstKey);
                    var firstDayOfMonth = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1);
                } else {
                    var dateToday = new Date();
                    var firstDayOfMonth = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1);
                }
                var minDateTimezone = (details.timezone != '' ? details.timezone : 0);
                var minDateFormat = moment(firstDayOfMonth).format('YYYY-MM-DD') +' '+minDateTimezone;
                $('#calendar-loader').hide();
                //Calendar Loads
                var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var lang = details.api_language;
                if (lang == "ar") {
                    dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
                    monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونية', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
                }
                if (lang == "ru") {
                    dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                    monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
                }
                if (lang == "zh-hans") {
                    dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                    monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                }

                const availableDates = Object.keys(response['data']);
                const maxDate = Object.keys(dateClasses).length > 0 ? new Date(availableDates[availableDates.length - 1]) : new Date();

                //console.log(defaultDate);
                $('#calendar').datepicker({
                    dateFormat: 'yy-mm-dd',
                    defaultDate: defaultDate,
                    inline: true,
                    firstDay: 0,
                    minDate: minDateFormat,
                    maxDate: maxDate,
                    showOtherMonths: false,
                    dayNamesMin: dayNames,
                    monthNames: monthNames,
                    beforeShowDay: function (date) {
                        var dateString = $.datepicker.formatDate('yy-mm-dd', date);
                        var classes = [];
                        if (dateClasses[dateString]) {
                            classes.push(dateClasses[dateString]);
                            if (dateString === $.datepicker.formatDate('yy-mm-dd', dateToday) && Object.keys(dateClasses).length > 0) {
                                classes.push('ui-state-highlight'); // Highlight the specific date
                                classes.push('ui-datepicker-today'); // Highlight the specific date
                            }
                        } else {
                            classes.push("special-date");
                        }
                        return [true, classes.join(" ")];
                    },
                    onChangeMonthYear: function(year, month, inst) {
                        updateArrowButtons(year, month,maxDate);
                      },
                    onSelect: function (dateText, el) {
                        var day = el.selectedDay,
                            mon = el.selectedMonth,
                            year = el.selectedYear;
                        //console.log(dateText);
                        var currentDate = jQuery("#calendar").datepicker('getDate');
                        var formatedDate = formatDate(currentDate);
                        var el = $(el.dpDiv).find('[data-year="' + year + '"][data-month="' + mon + '"]').filter(function () {
                            if ($(this).find('a').text() == day) {
                                ////console.log(day);
                                ////console.log("click");
                            }
                            return $(this).find('a').text().trim() == day;
                        });

                        if (el.hasClass('available-date')) {
                            
                            if (formatedDate === details.dsp_date && details.api_modify == 'false' && details.dsp_enable == '1') {
                                // Show the dspModal
                                $('#dspModal').modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                            
                                // Wait for dspModal to close
                                var dspModalPromise = new Promise(function (resolve) {
                                    $('#dspModal').on('hidden.bs.modal', function () {
                                        resolve(); // Proceed once dspModal is closed
                                    });
                                });
                            
                                dspModalPromise.then(function () {
                                    // Proceed to execute the rest of the code only after dspModal is closed
                                    executeFurtherLogic();
                                });
                            } else {
                                // Execute the logic directly if dspModal is not shown
                                executeFurtherLogic();
                            }
                            
                            function executeFurtherLogic(){
                                if (details.packagesShow != 0 && packageExist() == 1) {
    
                                    if ((formatDate(currentDate) != details.api_selected_date)) {
    
                                        var modalPromise = new Promise(function (resolve, reject) {
                                            $('#confirmmodal').on('hidden.bs.modal', function () {
                                                reject('Modal closed without confirmation');
                                            });
    
                                            $('#confirmButton').click(function () {
                                                resolve('Modal confirmed');
                                            });
                                        });
                                        // Show the modal
                                        $('#confirmmodal').modal({
                                            backdrop: 'static',
                                            keyboard: false
                                        });
                                        $('#confirmmodal').modal('show');
                                        $('#reset_value').text(bilingual.date_lang);
    
                                        modalPromise.then(function (result) {
                                            $('#confirmmodal').modal('hide');
                                            // details.temp_selected_date = dateText;
                                            details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                            runCode();
                                            updateforPackage();
                                            var activeListItem = $('.calendar_card.active');
                                            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
                                            $('#ticket-image').show();
                                            $('#package-image').hide();
                                            // Perform your actions after confirmation here
                                        }).catch(function (error) {
                                            var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
    
                                            if (elementString) {
                                                var element = $(elementString); // Parse back into a jQuery object
                                                var ele_text = element.children().text();
    
                                                //new code added for change in calendar
                                                var currentSelectedMonth = mon + parseInt(1);
                                                var dateParts = details.api_selected_date.split('-');
                                                var selectedMonthNumber = parseInt(dateParts[1], 10);
                                                var selectedYear = parseInt(dateParts[0], 10);
                                                if (currentSelectedMonth < selectedMonthNumber) {
                                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                    //console.log("here1", jumpTO);
                                                } else if (currentSelectedMonth > selectedMonthNumber) {
                                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                    //console.log("here2", jumpTO);
                                                }
                                                //new code added for change in calendar
    
                                                var el = $(".available-date");
                                                for (var i = 0; i < el.length; i++) {
                                                    if ($(el[i]).children('a').text() == ele_text) {
                                                        $(el[i]).trigger('click');
                                                    }
                                                }
                                                // localStorage.removeItem("lastDate");
                                            } else {
                                                ////console.log("Element not found in localStorage");
                                            }
                                            // Handle rejection (e.g., user canceled the modal)
                                        });
                                    }
    
                                } else if (totalSummry['addon'] != 0) {
    
                                    if ((formatDate(currentDate) != details.api_selected_date)) {
    
                                        var modalPromise = new Promise(function (resolve, reject) {
                                            $('#confirmmodal').on('hidden.bs.modal', function () {
                                                reject('Modal closed without confirmation');
                                            });
    
                                            $('#confirmButton').click(function () {
                                                resolve('Modal confirmed');
                                            });
                                        });
                                        // Show the modal
                                        $('#confirmmodal').modal({
                                            backdrop: 'static',
                                            keyboard: false
                                        });
                                        $('#confirmmodal').modal('show');
                                        $('#reset_value').text(bilingual.date_lang);
    
                                        modalPromise.then(function (result) {
                                            $('#confirmmodal').modal('hide');
                                            details.temp_selected_date = dateText;
                                            details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                            runCode();
                                            updateforPackage();
                                            var activeListItem = $('.calendar_card.active');
                                            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
    
                                            // Perform your actions after confirmation here
                                        }).catch(function (error) {
                                            var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
    
                                            if (elementString) {
                                                var element = $(elementString); // Parse back into a jQuery object
                                                var ele_text = element.children().text();
    
                                                //new code added for change in calendar
                                                var currentSelectedMonth = mon + parseInt(1);
                                                var dateParts = details.api_selected_date.split('-');
                                                var selectedMonthNumber = parseInt(dateParts[1], 10);
                                                var selectedYear = parseInt(dateParts[0], 10);
                                                if (currentSelectedMonth < selectedMonthNumber) {
                                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                    //console.log("here1", jumpTO);
                                                } else if (currentSelectedMonth > selectedMonthNumber) {
                                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                    //console.log("here2", jumpTO);
                                                }
                                                //new code added for change in calendar
    
                                                var el = $(".available-date");
                                                for (var i = 0; i < el.length; i++) {
                                                    if ($(el[i]).children('a').text() == ele_text) {
                                                        $(el[i]).trigger('click');
                                                    }
                                                }
                                                // localStorage.removeItem("lastDate");
                                            } else {
                                                ////console.log("Element not found in localStorage");
                                            }
                                            // Handle rejection (e.g., user canceled the modal)
                                        });
                                    }
    
                                } else if ((formatDate(currentDate) != details.api_selected_date) && details.api_selected_date != '' && details.api_selected_slot != '') {
    
                                    var modalPromise = new Promise(function (resolve, reject) {
                                        $('#confirmmodal').on('hidden.bs.modal', function () {
                                            reject('Modal closed without confirmation');
                                        });
    
                                        $('#confirmButton').click(function () {
                                            resolve('Modal confirmed');
                                        });
                                    });
                                    // Show the modal
                                    $('#confirmmodal').modal({
                                        backdrop: 'static',
                                        keyboard: false
                                    });
                                    $('#confirmmodal').modal('show');
                                    $('#reset_value').text(bilingual.date_lang);
    
                                    modalPromise.then(function (result) {
                                        //console.log("hide modal");
                                        $('#confirmmodal').modal('hide');
                                        // details.temp_selected_date = dateText;
                                        details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                        runCode();
                                        updateforPackage();
                                        var activeListItem = $('.calendar_card.active');
                                        jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
    
                                        // Perform your actions after confirmation here
                                    }).catch(function (error) {
                                        //console.log("not hide modal");
                                        var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
                                        ////console.log(elementString)
                                        if (elementString) {
                                            var element = $(elementString); // Parse back into a jQuery object
                                            var ele_text = element.children().text();
                                            //new code added for change in calendar
                                            var currentSelectedMonth = mon + parseInt(1);
                                            var dateParts = details.api_selected_date.split('-');
                                            var selectedMonthNumber = parseInt(dateParts[1], 10);
                                            var selectedYear = parseInt(dateParts[0], 10);
                                            if (currentSelectedMonth < selectedMonthNumber) {
                                                var jumpTO = selectedMonthNumber - parseInt(1);
                                                $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                //console.log("here1", jumpTO);
                                            } else if (currentSelectedMonth > selectedMonthNumber) {
                                                var jumpTO = selectedMonthNumber - parseInt(1);
                                                $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                                //console.log("here2", jumpTO);
                                            }
                                            //new code added for change in calendar
    
    
                                            var el = $(".available-date");
                                            for (var i = 0; i < el.length; i++) {
                                                if ($(el[i]).children('a').text() == ele_text) {
                                                    //console.log($(el[i]).children('a').text(), ele_text)
                                                    $(el[i]).trigger('click');
                                                }
                                            }
                                            // localStorage.removeItem("lastDate");
                                        } else {
                                            ////console.log("Element not found in localStorage");
                                        }
                                        // Handle rejection (e.g., user canceled the modal)
                                    });
                                }
                                else {
                                    details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                    if ((formatDate(currentDate) != details.api_selected_date)) {
                                        runCode();
                                    } else {
                                        $('.s_date').text(moment(currentDate).format('LL')).css({ "font-weight": "bolder", "color": "#000" });
                                    }
    
                                }
                            }
    
                                function runCode() {
                                    details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                    var oldElement = $(el);
                                    localStorage.setItem("lastDate", oldElement[0].outerHTML);
    
                                    resetFields('date');
                                    $('.s_date').text(moment(currentDate).format('LL'));
                                    $('.s_date').removeClass('notselected');
                                    summaryObject['date'] = formatDateTemp(formatedDate, 'full');
                                    details.button_click = 1;
                                    activeStrips();
                                    //console.log(currentDate,moment(currentDate).format('LL'))
                                }
                        }
                    }
                });
                //check if next month data is fetched
                var resp_currentMonth = new Date().getMonth();
                var isAvailable = Object.keys(response['data']).some(date => new Date(date).getMonth() > resp_currentMonth);
                if(isAvailable) {
                    var css = '.page_ticketbooking .ui-corner-all::after { filter: brightness(0.1); }';
                    $('<style>').prop('type', 'text/css').html(css).appendTo('head');
                }
                $('#calendar').fadeIn('slow');

                if (details.api_modify == 'true') {
                    var selectedDateElement = $('#calendar').find('.ui-datepicker-current-day');
                    localStorage.setItem("lastDate", selectedDateElement[0].outerHTML)
                }

                if (details.api_modify == 'false') {
                    $("#calendar").find(".ui-state-active").removeClass("ui-state-active");
                    $("#calendar").find("td.ui-state-highlight a").addClass("ui-state-highlight");
                    $("#calendar").find("td.ui-state-highlight").prev().removeClass('ui-datepicker-today');
                }

            } else {

                errorAlert();
            }
        },
        error: function (response) {
            errorAlert();
        }
    });
}

//normal datepicker with static 3 months date
function normalDatePicker() {

    $('#calendar-loader').hide();
    //Calendar Loads
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var lang = details.api_language;
    if (lang == "ar") {
        dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
        monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونية', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    }
    if (lang == "ru") {
        dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    }
    if (lang == "zh-hans") {
        dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    }

    var css = '.page_ticketbooking .ui-corner-all::after { filter: brightness(0.1); }';
                    $('<style>').prop('type', 'text/css').html(css).appendTo('head');

    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 4, today.getDate());
    var minDateTimezone = (details.dateTimezone != '' ? details.dateTimezone : 0);
    
    $('#calendar').datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: defaultDate,
        inline: true,
        firstDay: 0,
        minDate: minDateTimezone,
        maxDate: "+4M",
        showOtherMonths: false,
        dayNamesMin: dayNames,
        monthNames: monthNames,
        beforeShowDay: function (date) {
            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            var futureDate = new Date();
            futureDate.setMonth(currentDate.getMonth() + 4);
            var classes = [];
            if (date >= currentDate && date <= futureDate) {
                classes.push("available-date");
            } else {
                classes.push("special-date");
            }
            return [true, classes.join(" ")];
        },
        onChangeMonthYear: function(year, month, inst) {
            updateArrowButtons(year, month,maxDate);
          },
        onSelect: function (dateText, el) {
            var day = el.selectedDay,
                mon = el.selectedMonth,
                year = el.selectedYear;
            //console.log(dateText);
            var currentDate = jQuery("#calendar").datepicker('getDate');
            var formatedDate = formatDate(currentDate);
            var el = $(el.dpDiv).find('[data-year="' + year + '"][data-month="' + mon + '"]').filter(function () {
                if ($(this).find('a').text() == day) {
                    ////console.log(day);
                    ////console.log("click");
                }
                return $(this).find('a').text().trim() == day;
            });

            if (el.hasClass('available-date')) {
                
                if (formatedDate === details.dsp_date && details.api_modify == 'false' && details.dsp_enable == '1') {
                    // Show the dspModal
                    $('#dspModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                
                    // Wait for dspModal to close
                    var dspModalPromise = new Promise(function (resolve) {
                        $('#dspModal').on('hidden.bs.modal', function () {
                            resolve(); // Proceed once dspModal is closed
                        });
                    });
                
                    dspModalPromise.then(function () {
                        // Proceed to execute the rest of the code only after dspModal is closed
                        executeFurtherLogic();
                    });
                } else {
                    // Execute the logic directly if dspModal is not shown
                    executeFurtherLogic();
                }
                
                function executeFurtherLogic(){
                    if (details.packagesShow != 0 && packageExist() == 1) {
    
                        if ((formatDate(currentDate) != details.api_selected_date)) {
    
                            var modalPromise = new Promise(function (resolve, reject) {
                                $('#confirmmodal').on('hidden.bs.modal', function () {
                                    reject('Modal closed without confirmation');
                                });
    
                                $('#confirmButton').click(function () {
                                    resolve('Modal confirmed');
                                });
                            });
                            // Show the modal
                            $('#confirmmodal').modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            $('#confirmmodal').modal('show');
                            $('#reset_value').text(bilingual.date_lang);
    
                            modalPromise.then(function (result) {
                                $('#confirmmodal').modal('hide');
                                // details.temp_selected_date = dateText;
                                details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                runCode();
                                updateforPackage();
                                var activeListItem = $('.calendar_card.active');
                                jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
                                $('#ticket-image').show();
                                $('#package-image').hide();
                                // Perform your actions after confirmation here
                            }).catch(function (error) {
                                var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
    
                                if (elementString) {
                                    var element = $(elementString); // Parse back into a jQuery object
                                    var ele_text = element.children().text();
    
                                    //new code added for change in calendar
                                    var currentSelectedMonth = mon + parseInt(1);
                                    var dateParts = details.api_selected_date.split('-');
                                    var selectedMonthNumber = parseInt(dateParts[1], 10);
                                    var selectedYear = parseInt(dateParts[0], 10);
                                    if (currentSelectedMonth < selectedMonthNumber) {
                                        var jumpTO = selectedMonthNumber - parseInt(1);
                                        $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                        //console.log("here1", jumpTO);
                                    } else if (currentSelectedMonth > selectedMonthNumber) {
                                        var jumpTO = selectedMonthNumber - parseInt(1);
                                        $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                        //console.log("here2", jumpTO);
                                    }
                                    //new code added for change in calendar
    
                                    var el = $(".available-date");
                                    for (var i = 0; i < el.length; i++) {
                                        if ($(el[i]).children('a').text() == ele_text) {
                                            $(el[i]).trigger('click');
                                        }
                                    }
                                    // localStorage.removeItem("lastDate");
                                } else {
                                    ////console.log("Element not found in localStorage");
                                }
                                // Handle rejection (e.g., user canceled the modal)
                            });
                        }
    
                    } else if (totalSummry['addon'] != 0) {
    
                        if ((formatDate(currentDate) != details.api_selected_date)) {
    
                            var modalPromise = new Promise(function (resolve, reject) {
                                $('#confirmmodal').on('hidden.bs.modal', function () {
                                    reject('Modal closed without confirmation');
                                });
    
                                $('#confirmButton').click(function () {
                                    resolve('Modal confirmed');
                                });
                            });
                            // Show the modal
                            $('#confirmmodal').modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            $('#confirmmodal').modal('show');
                            $('#reset_value').text(bilingual.date_lang);
    
                            modalPromise.then(function (result) {
                                $('#confirmmodal').modal('hide');
                                details.temp_selected_date = dateText;
                                details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                                runCode();
                                updateforPackage();
                                var activeListItem = $('.calendar_card.active');
                                jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
    
                                // Perform your actions after confirmation here
                            }).catch(function (error) {
                                var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
    
                                if (elementString) {
                                    var element = $(elementString); // Parse back into a jQuery object
                                    var ele_text = element.children().text();
    
                                    //new code added for change in calendar
                                    var currentSelectedMonth = mon + parseInt(1);
                                    var dateParts = details.api_selected_date.split('-');
                                    var selectedMonthNumber = parseInt(dateParts[1], 10);
                                    var selectedYear = parseInt(dateParts[0], 10);
                                    if (currentSelectedMonth < selectedMonthNumber) {
                                        var jumpTO = selectedMonthNumber - parseInt(1);
                                        $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                        //console.log("here1", jumpTO);
                                    } else if (currentSelectedMonth > selectedMonthNumber) {
                                        var jumpTO = selectedMonthNumber - parseInt(1);
                                        $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                        //console.log("here2", jumpTO);
                                    }
                                    //new code added for change in calendar
    
                                    var el = $(".available-date");
                                    for (var i = 0; i < el.length; i++) {
                                        if ($(el[i]).children('a').text() == ele_text) {
                                            $(el[i]).trigger('click');
                                        }
                                    }
                                    // localStorage.removeItem("lastDate");
                                } else {
                                    ////console.log("Element not found in localStorage");
                                }
                                // Handle rejection (e.g., user canceled the modal)
                            });
                        }
    
                    } else if ((formatDate(currentDate) != details.api_selected_date) && details.api_selected_date != '' && details.api_selected_slot != '') {
    
                        var modalPromise = new Promise(function (resolve, reject) {
                            $('#confirmmodal').on('hidden.bs.modal', function () {
                                reject('Modal closed without confirmation');
                            });
    
                            $('#confirmButton').click(function () {
                                resolve('Modal confirmed');
                            });
                        });
                        // Show the modal
                        $('#confirmmodal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $('#confirmmodal').modal('show');
                        $('#reset_value').text(bilingual.date_lang);
    
                        modalPromise.then(function (result) {
                            //console.log("hide modal");
                            $('#confirmmodal').modal('hide');
                            // details.temp_selected_date = dateText;
                            details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                            runCode();
                            updateforPackage();
                            var activeListItem = $('.calendar_card.active');
                            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
    
                            // Perform your actions after confirmation here
                        }).catch(function (error) {
                            //console.log("not hide modal");
                            var elementString = localStorage.getItem("lastDate"); // Retrieve as a string
                            ////console.log(elementString)
                            if (elementString) {
                                var element = $(elementString); // Parse back into a jQuery object
                                var ele_text = element.children().text();
                                //new code added for change in calendar
                                var currentSelectedMonth = mon + parseInt(1);
                                var dateParts = details.api_selected_date.split('-');
                                var selectedMonthNumber = parseInt(dateParts[1], 10);
                                var selectedYear = parseInt(dateParts[0], 10);
                                if (currentSelectedMonth < selectedMonthNumber) {
                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                    //console.log("here1", jumpTO);
                                } else if (currentSelectedMonth > selectedMonthNumber) {
                                    var jumpTO = selectedMonthNumber - parseInt(1);
                                    $("#calendar").datepicker('setDate', new Date(selectedYear, jumpTO, 1));
                                    //console.log("here2", jumpTO);
                                }
                                //new code added for change in calendar
    
    
                                var el = $(".available-date");
                                for (var i = 0; i < el.length; i++) {
                                    if ($(el[i]).children('a').text() == ele_text) {
                                        //console.log($(el[i]).children('a').text(), ele_text)
                                        $(el[i]).trigger('click');
                                    }
                                }
                                // localStorage.removeItem("lastDate");
                            } else {
                                ////console.log("Element not found in localStorage");
                            }
                            // Handle rejection (e.g., user canceled the modal)
                        });
                    }
                    else {
                        details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                        if ((formatDate(currentDate) != details.api_selected_date)) {
                            runCode();
                        } else {
                            $('.s_date').text(moment(currentDate).format('LL')).css({ "font-weight": "bolder", "color": "#000" });
                        }
    
                    }
                }

                function runCode() {
                    details.temp_selected_date = formatDateTemp(formatedDate, 'full');
                    var oldElement = $(el);
                    localStorage.setItem("lastDate", oldElement[0].outerHTML);

                    resetFields('date');
                    $('.s_date').text(moment(currentDate).format('LL'));
                    $('.s_date').removeClass('notselected');
                    summaryObject['date'] = formatDateTemp(formatedDate, 'full');
                    details.button_click = 1;
                    activeStrips();
                    //console.log(currentDate,moment(currentDate).format('LL'))
                    
                }
            }
        }
    });
    $('#calendar').fadeIn('slow');

    if (details.api_modify == 'true') {
        var selectedDateElement = $('#calendar').find('.ui-datepicker-current-day');
        localStorage.setItem("lastDate", selectedDateElement[0].outerHTML)
    }

    if (details.api_modify == 'false') {
        $("#calendar").find(".ui-state-active").removeClass("ui-state-active");
    }
}

//get timeslots
function timeSlots(date) {
    // $('#main-loader').show();
    $('.slot_list').hide();
    var selectedDate = formatDate(date);
    // var product_ids = [details.api_ticket_id,details.api_adult_id,details.api_child_id];
    if (details.api_type_visitor == '1') {
        var product_ids = [details.api_ticket_id];
    } else if (details.api_type_adult == '1' && details.api_type_child == '1') {
        var product_ids = [details.api_ticket_id, details.api_adult_id, details.api_child_id];
    } else if (details.api_type_adult == '1' && details.api_type_child == '0') {
        var product_ids = [details.api_ticket_id, details.api_adult_id];
    } else if (details.api_type_adult == '0' && details.api_type_child == '1') {
        var product_ids = [details.api_ticket_id, details.api_child_id];
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "get_product_timeslots",
            product_ids: product_ids,
            date: selectedDate,
            lang: details.api_language
        },
        success: function (response) {
            // $('#main-loader').hide();
            if (response.success == true) {

                timeSlotArray = response.data;
                // Arrays to hold categorized time slots
                var morningArray = [];
                var afternoonArray = [];
                var eveningArray = [];

                jQuery('.time-evening ul').empty();
                jQuery('.time-evening').hide();
                jQuery('.time-morning ul').empty();
                jQuery('.time-morning').hide();
                jQuery('.time-afternoon ul').empty();
                jQuery('.time-afternoon').hide();
                // Categorize the response data into time slots
                $.each(response.data[details.api_ticket_id], function (index, item) {

                    var timeString = item.time;
                    var time = parseTimeString(timeString);
                    if (time.getHours() < 12) {
                        morningArray.push(item);
                    } else if (time.getHours() >= 12 && time.getHours() < 18) {
                        afternoonArray.push(item);
                    } else {
                        eveningArray.push(item);
                    }
                });
                var timeSlotmorning = '';
                // Merge morningArray and add "morning" label
                for (var i = 0; i < morningArray.length; i++) {

                    var totalCapacity = morningArray[i].totalCapacity;
                    var available = morningArray[i].available;
                    var percentage = (totalCapacity * 0.8).toFixed(2);
                    var totalRemain = parseInt(totalCapacity) - parseInt(percentage);
                    var isPremium = morningArray[i].maxPrice;

                    var slotId = morningArray[i].timeSlotId;
                    if (details.api_selected_slot == slotId) {
                        var selectedClass = 'selected-slot';
                        updateDynamicPricing(slotId);
                        details.api_startTimestamp = morningArray[i].startTimestamp;
                        details.api_endTimestamp = morningArray[i].endTimestamp;
                    } else {
                        var selectedClass = '';
                    }
                    if (available == 0) {
                        var slotClass = '';
                        var anchor_slotClass = 'soldout';
                        var additionalElement = '<div class="soldtext">Sold Out</div>';
                    }  else if(isPremium){
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'premium_slot';
                        var additionalElement = '<div class="fillingtextpremium"><div class="premiumlabel"><img src="'+details.api_site_url+'/wp-content/uploads/sites/2/2024/08/crown.png" width="10" height="10"><div>Prime Hour</div></div></div>';
                    } else if (available <= totalRemain) {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'filling_fast';
                        var additionalElement = '<div class="fillingtext">Filling Fast</div>';
                    } else {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'available';
                        var additionalElement = '';
                    }
                    var showTime_m = details.api_language == 'ar' ? (morningArray[i].time).replace(/\s+/g, '') : morningArray[i].time;
                    timeSlotmorning += '<li class="' + slotClass + '" id="' + slotId + '" data-startTime="'+morningArray[i].startTimestamp+'" data-endTime="'+morningArray[i].endTimestamp+'"><div class="slotgroup"><a href="javascript:void(0)" class="' + selectedClass + ' ' + anchor_slotClass + '">' + showTime_m + ' | <span class="d-inline-block p-0">'+details.currency+' ' + morningArray[i].price + '</span></a></div>' + additionalElement + '</li>';
                }
                if (morningArray.length > 0) {
                    jQuery('.time-morning').show();
                    jQuery('.time-morning ul').append(timeSlotmorning);
                }

                // Merge afternoonArray and add "afternoon" label
                var timeSlotafternoon = '';
                for (var i = 0; i < afternoonArray.length; i++) {
                    var totalCapacity = afternoonArray[i].totalCapacity;
                    var available = afternoonArray[i].available;
                    var percentage = (totalCapacity * 0.8).toFixed(2);
                    var totalRemain = parseInt(totalCapacity) - parseInt(percentage);
                    var isPremium = afternoonArray[i].maxPrice;

                    var slotId = afternoonArray[i].timeSlotId;
                    if (details.api_selected_slot == slotId) {
                        var selectedClass = 'selected-slot';
                        updateDynamicPricing(slotId);
                        details.api_startTimestamp = afternoonArray[i].startTimestamp;
                        details.api_endTimestamp = afternoonArray[i].endTimestamp;
                    } else {
                        var selectedClass = '';
                    }
                    if (available == 0) {
                        var slotClass = '';
                        var anchor_slotClass = 'soldout';
                        var additionalElement = '<div class="soldtext">Sold Out</div>';
                    }  else if(isPremium){
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'premium_slot';
                        var additionalElement = '<div class="fillingtextpremium"><div class="premiumlabel"><img src="'+details.api_site_url+'/wp-content/uploads/sites/2/2024/08/crown.png" width="10" height="10"><div>Prime Hour</div></div></div>';
                    } else if (available <= totalRemain) {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'filling_fast';
                        var additionalElement = '<div class="fillingtext">Filling Fast</div>';
                    } else {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'available';
                        var additionalElement = '';
                    }

                    var showTime_a = details.api_language == 'ar' ? (afternoonArray[i].time).replace(/\s+/g, '') : afternoonArray[i].time;
                    timeSlotafternoon += '<li class="' + slotClass + ' ' + selectedClass + '" id="' + slotId + '" data-startTime="'+afternoonArray[i].startTimestamp+'" data-endTime="'+afternoonArray[i].endTimestamp+'"><a href="javascript:void(0)" class="' + selectedClass + ' ' + anchor_slotClass + '">' + showTime_a + ' | <span class="d-inline-block p-0">'+details.currency+' ' + afternoonArray[i].price + '</span></a>' + additionalElement + '</li>';
                }
                if (afternoonArray.length > 0) {
                    jQuery('.time-afternoon').show();
                    jQuery('.time-afternoon ul').append(timeSlotafternoon);
                }

                // Merge eveningArray and add "evening" label
                var timeSlotevening = '';
                for (var i = 0; i < eveningArray.length; i++) {

                    var totalCapacity = eveningArray[i].totalCapacity;
                    var available = eveningArray[i].available;
                    var percentage = (totalCapacity * 0.8).toFixed(2);
                    var totalRemain = parseInt(totalCapacity) - parseInt(percentage);
                    var isPremium = eveningArray[i].maxPrice;

                    var slotId = eveningArray[i].timeSlotId;
                    if (details.api_selected_slot == slotId) {
                        var selectedClass = 'selected-slot';
                        updateDynamicPricing(slotId);
                        details.api_startTimestamp = eveningArray[i].startTimestamp;
                        details.api_endTimestamp = eveningArray[i].endTimestamp;
                    } else {
                        var selectedClass = '';
                    }
                    if (available == 0) {
                        var slotClass = '';
                        var anchor_slotClass = 'soldout';
                        var additionalElement = '<div class="soldtext">Sold Out</div>';
                    }  else if(isPremium){
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'premium_slot';
                        var additionalElement = '<div class="fillingtextpremium"><div class="premiumlabel"><img src="'+details.api_site_url+'/wp-content/uploads/sites/2/2024/08/crown.png" width="10" height="10"><div>Prime Hour</div></div></div>';
                    } else if (available <= totalRemain) {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'filling_fast';
                        var additionalElement = '<div class="fillingtext">Filling Fast</div>';
                    } else {
                        var slotClass = 'select_slot slot-available';
                        var anchor_slotClass = 'available';
                        var additionalElement = '';
                    }

                    var showTime_e = details.api_language == 'ar' ? (eveningArray[i].time).replace(/\s+/g, '') : eveningArray[i].time;
                    timeSlotevening += '<li class="' + slotClass + ' ' + selectedClass + '" id="' + slotId + '" data-startTime="'+eveningArray[i].startTimestamp+'" data-endTime="'+eveningArray[i].endTimestamp+'"><a href="javascript:void(0)" class="' + selectedClass + ' ' + anchor_slotClass + '">' + showTime_e + ' | <span class="d-inline-block p-0">'+details.currency+' ' + eveningArray[i].price + '</span></a>' + additionalElement + '</li>';
                }
                if (eveningArray.length > 0) {
                    jQuery('.time-evening').show();
                    jQuery('.time-evening ul').append(timeSlotevening);
                }

                $('.slot_list').fadeIn('slow');
                return 1;
            } else {
                // errorAlert();
                $('#visitorerrorAlert').modal('show');
                $('#errorTitle').text(bilingual.timeslot_alert.message);
                $('#errorBtn').text(bilingual.timeslot_alert.button);
                $('.calendar_card').removeClass('active');
                $('.calendar_card').first().addClass('active');
                var activeListItem = $('.calendar_card.active');
                var nextListItem = activeListItem.next();
                jQuery(activeListItem).find('.collapse').collapse('show');
                jQuery(".calendar_card:eq(" + nextListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.5' });
            }
        }, error: function () {
            // $('#main-loader').show();
            errorAlert();
        }
    });
}

// // Update Slot
$(document).on('click', '.ui-datepicker-prev', function () {

    prevMonthArrow();
});

//show hide previous month arrow
function prevMonthArrow() {

    if (details.temp_selected_date == '') {
        $("#calendar").find(".ui-datepicker-current-day.ui-datepicker-today a.ui-state-active").removeClass("ui-state-active");
        $("#calendar").find(".ui-datepicker-current-day a.ui-state-active").removeClass("ui-state-active");
    }
}

$(document).on('click', '.select_slot', function () {
    if ($(this).hasClass('slot-available')) {
        var element = this;
        var currentSelected = element.id;
        var lastVal = details.api_selected_slot;
        if (details.packagesShow != 0 && packageExist() == 1) {

            if (currentSelected != lastVal) {

                var modalPromise = new Promise(function (resolve, reject) {
                    $('#confirmmodal').on('hidden.bs.modal', function () {
                        reject('Modal closed without confirmation');
                    });

                    $('#confirmButton').click(function () {
                        resolve('Modal confirmed');
                    });
                });

                // Show the modal
                $('#confirmmodal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#confirmmodal').modal('show');
                $('#reset_value').text(bilingual.time_lang);

                // Handle the Promise result
                modalPromise.then(function (result) {
                    runSlotCode();
                    updateforPackage();
                    $('#confirmmodal').modal('hide');
                    var activeListItem = $('.calendar_card.active');
                    jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
                    $('#ticket-image').show();
                    $('#package-image').hide();
                    // Perform your actions after confirmation here
                }).catch(function (error) {

                    // Handle rejection (e.g., user canceled the modal)
                });
            }

        } else if (totalSummry['addon'] != 0) {

            if (currentSelected != lastVal) {

                var modalPromise = new Promise(function (resolve, reject) {
                    $('#confirmmodal').on('hidden.bs.modal', function () {
                        reject('Modal closed without confirmation');
                    });

                    $('#confirmButton').click(function () {
                        resolve('Modal confirmed');
                    });
                });

                // Show the modal
                $('#confirmmodal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#confirmmodal').modal('show');
                $('#reset_value').text(bilingual.time_lang);

                // Handle the Promise result
                modalPromise.then(function (result) {
                    runSlotCode();
                    updateforPackage();
                    $('#confirmmodal').modal('hide');
                    var activeListItem = $('.calendar_card.active');
                    jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
                    // Perform your actions after confirmation here
                }).catch(function (error) {

                    // Handle rejection (e.g., user canceled the modal)
                });
            }
        } else if ((currentSelected != lastVal) && lastVal != '' && (details.api_adult_number != '0' || details.api_child_number != '0')) {

            var modalPromise = new Promise(function (resolve, reject) {
                $('#confirmmodal').on('hidden.bs.modal', function () {
                    reject('Modal closed without confirmation');
                });

                $('#confirmButton').click(function () {
                    resolve('Modal confirmed');
                });
            });

            // Show the modal
            $('#confirmmodal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#confirmmodal').modal('show');
            $('#reset_value').text(bilingual.time_lang);

            // Handle the Promise result
            modalPromise.then(function (result) {
                runSlotCode();
                updateforPackage();
                $('#confirmmodal').modal('hide');
                var activeListItem = $('.calendar_card.active');
                jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
                // Perform your actions after confirmation here
            }).catch(function (error) {

                // Handle rejection (e.g., user canceled the modal)
            });

        } else {
            if (currentSelected != lastVal) {
                runSlotCode();
            } else {
                activeStrips();
            }

        }

        function runSlotCode() {
            resetFields('slot');
            var api_selected_slot = element.id;
            details.api_selected_slot = api_selected_slot;
            details.api_startTimestamp = $(element).data('starttime');
            details.api_endTimestamp = $(element).data('endtime');
            $('.slot_list').find('.selected-slot').removeClass('selected-slot');
            $('.s_slot').removeClass('notselected');
            var originalString = $(element).text();
            var extractedTime = details.api_language == 'ar' ? originalString.match(/\d{2}:\d{2}?[APap][Mm]/) : originalString.match(/\d{2}:\d{2} [APap][Mm]/);
            var modifiedString = extractedTime[0];

            var parts = $(element).text().split('|');
            var slot_timing = parts[0];
            details.api_selected_slot_timing = slot_timing
            $('.s_slot').text(modifiedString);
            $(element).find('a').addClass('selected-slot');
            // $('#button_click').val(1);
            details.button_click = 1;
            //update pricing
            if (updateDynamicPricing(api_selected_slot)) {
                activeStrips();
            }
        }
    }
})
// Update Slot End

//search for adult and child amount in timeslot array
function updateDynamicPricing(slot_id) {

    // if (details.api_pricingType == 'ticket') {

        if (details.api_type_visitor == '1') {
            var adult_api_id = details.api_ticket_id;
            var child_api_id = '';
        } else if (details.api_type_adult == '1' && details.api_type_child == '1') {
            var adult_api_id = details.api_adult_id;
            var child_api_id = details.api_child_id;
        } else if (details.api_type_adult == '1' && details.api_type_child == '0') {
            var adult_api_id = details.api_adult_id;
            var child_api_id = '';
        } else if (details.api_type_adult == '0' && details.api_type_child == '1') {
            var adult_api_id = '';
            var child_api_id = details.api_child_id;
        }

        //update the pricing of adult and child amount
        var valueToFind = slot_id; // Replace with the value you want to find

        // Define your fallback API ID
        var fallback_api_id = details.api_ticket_id;

        // Check if adult_api_id exists in timeSlotArray
        var api_id_to_use = (adult_api_id && timeSlotArray[adult_api_id]) ? adult_api_id : fallback_api_id;
        // Check if child_api_id exists in timeSlotArray
        var child_api_id_to_use = (child_api_id && timeSlotArray[child_api_id]) ? child_api_id : fallback_api_id;

        // Find the index of the value in the array
        var adultIndex = jQuery.inArray(valueToFind, timeSlotArray[api_id_to_use].map(function (item) {
            return item.timeSlotId;
        }));
        // Check if the value was found
        if (adultIndex !== -1 && api_id_to_use != '') {
            details.api_adult_price = parseFloat(timeSlotArray[api_id_to_use][adultIndex].price);
            details.api_available_slot_adult = timeSlotArray[api_id_to_use][adultIndex].available;
            $('#time_pricing_adult').text(details.api_adult_price.toFixed(2));

            if (child_api_id_to_use != '' && details.api_type_child == '1') {

                // Find the index of the value in the array
                var childIndex = jQuery.inArray(valueToFind, timeSlotArray[child_api_id_to_use].map(function (item) {
                    return item.timeSlotId;
                }));

                if (childIndex !== -1) {
                    details.api_child_price = parseFloat(timeSlotArray[child_api_id_to_use][childIndex].price);
                    details.api_available_slot_child = timeSlotArray[child_api_id_to_use][childIndex].available;
                    $('#time_pricing_child').text(details.api_child_price.toFixed(2));
                }
            }


            //if cart is modifying
            if (details.api_modify == 'true') {

                var adultTotalAmt = details.api_adult_number > 0 ? details.api_adult_price * details.api_adult_number : 0;
                var childTotalAmt = details.api_child_number > 0 ? details.api_child_price * details.api_child_number : 0;
                totalSummry['adult'] = parseFloat(adultTotalAmt).toFixed(2);
                totalSummry['child'] = parseFloat(childTotalAmt).toFixed(2);

                $("#s_adult_total_amt").text(details.api_adult_number > 0 ? details.currency+" " + totalSummry['adult'] : "");
                $("#s_child_total_amt").text(details.api_child_number > 0 ? details.currency+" " + totalSummry['child'] : "");
                if (cartData.product_post_type != 'package') {
                    sumOfGrand(2,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
                }
            }

            return 1;
        } else {
            return 0;
        }

    // } else {
    //     return 1;
    // }

}


//Update Visitors
$(document).on('click', '.del_visitor', function (e) {

    var element = this;
    if (details.packagesShow != 0 && packageExist() == 1) {

        var modalPromise = new Promise(function (resolve, reject) {
            $('#confirmmodal').on('hidden.bs.modal', function () {
                reject('Modal closed without confirmation');
            });

            $('#confirmButton').click(function () {
                resolve('Modal confirmed');
            });
        });

        // Show the modal
        $('#confirmmodal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#confirmmodal').modal('show');

        // Handle the Promise result
        modalPromise.then(function (result) {
            runVisitordel(element);
            updateforPackage();
            $('#confirmmodal').modal('hide');
            var activeListItem = $('.calendar_card.active');
            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
            $('#ticket-image').show();
            $('#package-image').hide();
            // Perform your actions after confirmation here
        }).catch(function (error) {

            // Handle rejection (e.g., user canceled the modal)
        });

    } else if (totalSummry['addon'] != 0) {

        var modalPromise = new Promise(function (resolve, reject) {
            $('#confirmmodal').on('hidden.bs.modal', function () {
                reject('Modal closed without confirmation');
            });

            $('#confirmButton').click(function () {
                resolve('Modal confirmed');
            });
        });

        // Show the modal
        $('#confirmmodal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#confirmmodal').modal('show');

        // Handle the Promise result
        modalPromise.then(function (result) {
            runVisitordel(element);
            updateforPackage();
            $('#confirmmodal').modal('hide');
            var activeListItem = $('.calendar_card.active');
            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
            // Perform your actions after confirmation here
        }).catch(function (error) {

            // Handle rejection (e.g., user canceled the modal)
        });

    } else {
        runVisitordel(element);
    }

    function runVisitordel(element) {

        resetFields('visitor');
        e.preventDefault();
        var targetInput = $('#' + $(element).data('target'));
        var value = parseInt(targetInput.val());
        if (value > 0) {
            value--;
        }
        targetInput.val(value);
        var adults = $('.adult_input').val();
        var children = $('.child_input').val();
        var adultPricing = details.api_adult_price;
        var childPricing = details.api_child_price;
        //for free child in package case
        if (details.api_booking_type == 'package') {
            if (details.api_child_free > 0) {

                var freechild = parseInt(children) - parseInt(details.api_child_free);
                if (freechild > 0) {
                    var free_child = freechild;
                } else {
                    var free_child = 0;
                }
            } else {
                var free_child = children;
            }
        } else {
            var free_child = children;
        }
        // var visitorsText = adults + " Adult" + (adults > 1 ? "s" : "") + " | " + children + " Child" + (children > 1 ? "ren" : "");
        var visitorsText = "";
        if (adults > 0) {
            visitorsText += adults + " " + (adults > 1 ? textforVisitor : textForadult1);
        }
        if (children > 0 && details.api_type_child == '1') {
            if (adults > 0) {
                visitorsText += " | " + children + (children > 1 ? " "+children_lang : " "+child_lang);
            } else {
                visitorsText += children + (children > 1 ? " "+children_lang : " "+child_lang);
            }
        }
        $(".s_visitors").text(visitorsText);
        $(".s_visitor_count").text(visitorsText.replace(/\|/g, ','));
        var adultTotalTxt = adults > 0 ? adults + "&nbsp; X &nbsp;" + textForadult1 : "";
        var adultTotalAmt = adults > 0 ? adultPricing * adults : 0;
        var childTotalTxt = children > 0 ? children + "&nbsp; X &nbsp;"+(children > 1 ? children_lang : child_lang) : "";
        var childTotalAmt = children > 0 ? childPricing * free_child : 0;
        totalSummry['adult'] = adultTotalAmt;
        totalSummry['child'] = childTotalAmt;
        totalSummry['adult'] = parseFloat(adultTotalAmt).toFixed(2);
        totalSummry['child'] = parseFloat(childTotalAmt).toFixed(2);


        $("#s_adult_total").html(adultTotalTxt);
        $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + totalSummry['adult'] : "");
        $("#s_child_total").html(childTotalTxt);
        $("#s_child_total_amt").text(children > 0 ? details.currency+" " + totalSummry['child'] : "");
        //update data-attributes
        details.api_adult_number = adults
        details.api_child_number = children;
        details.button_click = 1;


        if (adults == 0 && (details.api_type_adult == '1' || details.api_type_visitor == '1')) {
            details.button_click = 0
            jQuery('.confirm-btn').attr("disabled", "disabled");
            jQuery('.cart-submit').attr("disabled", "disabled");
            if ($(element).data('target') == 'quantity-input-1') {
                $('[data-target="' + $(element).data('target') + '"].del_visitor').addClass("disabled-decrement");
            }
        }
        if (children == 0 && details.api_type_child == '1' && details.api_type_adult == '0') {
            jQuery('.confirm-btn').attr("disabled", "disabled");
            jQuery('.cart-submit').attr("disabled", "disabled");
            if ($(element).data('target') == 'quantity-input-2') {
                $('[data-target="' + $(element).data('target') + '"].del_visitor').addClass("disabled-decrement");
            }
            $('.kid-free').hide();
        } else {
            $('.kid-free').show();
        }
        ////console.log($(element).data('target'))
        resetFields('visitor-for-zero');
        sumOfGrand(3,totalSummry['adult'], totalSummry['child'], totalSummry['package'], totalSummry['addon']);
        packageCalc();
        // mainButtonText();
    }
});

$(document).on('click', '.add_visitor', function (e) {
    var element = this;
    if (details.packagesShow != 0 && packageExist() == 1) {

        var modalPromise = new Promise(function (resolve, reject) {
            $('#confirmmodal').on('hidden.bs.modal', function () {
                reject('Modal closed without confirmation');
            });

            $('#confirmButton').click(function () {
                resolve('Modal confirmed');
            });
        });

        // Show the modal
        $('#confirmmodal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#confirmmodal').modal('show');
        $('#reset_value').text(bilingual.visitors_lang);

        // Handle the Promise result
        modalPromise.then(function (result) {
            runVisitoradd(element);
            updateforPackage();
            $('#confirmmodal').modal('hide');
            var activeListItem = $('.calendar_card.active');
            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
            $('#ticket-image').show();
            $('#package-image').hide();
            // Perform your actions after confirmation here
        }).catch(function (error) {

            // Handle rejection (e.g., user canceled the modal)
        });

    } else if (totalSummry['addon'] != 0) {

        var modalPromise = new Promise(function (resolve, reject) {
            $('#confirmmodal').on('hidden.bs.modal', function () {
                reject('Modal closed without confirmation');
            });

            $('#confirmButton').click(function () {
                resolve('Modal confirmed');
            });
        });

        // Show the modal
        $('#confirmmodal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#confirmmodal').modal('show');
        $('#reset_value').text(bilingual.visitors_lang);

        // Handle the Promise result
        modalPromise.then(function (result) {
            runVisitoradd(element);
            updateforPackage();
            $('#confirmmodal').modal('hide');
            var activeListItem = $('.calendar_card.active');
            jQuery(".calendar_card:gt(" + activeListItem.index() + ")").css({ 'pointer-events': 'none', 'opacity': '0.4' });
            // Perform your actions after confirmation here
        }).catch(function (error) {

            // Handle rejection (e.g., user canceled the modal)
        });

    } else {
        runVisitoradd(element);
    }

    function runVisitoradd(element) {
        e.preventDefault();
        $(".s_visitor_summary").show();


        var targetInput = $('#' + $(element).data('target'));
        // $('#' + $(element).data('target'))
        $('[data-target="' + $(element).data('target') + '"].del_visitor').removeClass("disabled-decrement");
        var value = parseInt(targetInput.val());
        var checkLimit = limitVisitors(value, targetInput.attr("id"));
        if (checkLimit) {
            resetFields('visitor');
            value++;
            targetInput.val(value);
            var adults = $('.adult_input').val();
            var children = $('.child_input').val();
            var adultPricing = details.api_adult_price;
            var childPricing = details.api_child_price;
            // var visitorsText = adults + " Adult" + (adults > 1 ? "s" : "") + " | " + children + " Child" + (children > 1 ? "ren" : "");
            var visitorsText = "";
            if (adults > 0) {
                visitorsText += adults + " " + (adults > 1 ? textforVisitor : textForadult1);
            }
            if (children > 0 && details.api_type_child == '1') {
                if (adults > 0) {
                    visitorsText += " | " + children + (children > 1 ? " "+children_lang : " "+child_lang);
                } else {
                    visitorsText += children + (children > 1 ? " "+children_lang : " "+child_lang);
                }
            }
            $(".s_visitors").text(visitorsText);
            $(".s_visitors").removeClass('notselected');
            $(".s_visitor_count").text(visitorsText.replace(/\|/g, ','));

            //for free child in package case
            if (details.api_booking_type == 'package') {
                if (details.api_child_free > 0) {

                    var freechild = parseInt(children) - parseInt(details.api_child_free);
                    if (freechild > 0) {
                        var free_child = freechild;
                    } else {
                        var free_child = 0;
                    }
                } else {
                    var free_child = children;
                }
            } else {
                var free_child = children;
            }

            var adultTotalTxt = adults > 0 ? adults + "&nbsp; X &nbsp;" + textForadult1 : "";
            var adultTotalAmt = adults > 0 ? adultPricing * adults : 0;
            var childTotalTxt = children > 0 ? children + "&nbsp; X &nbsp;"+(children > 1 ? children_lang : child_lang) : "";
            var childTotalAmt = children > 0 ? childPricing * free_child : 0;
            totalSummry['adult'] = adultTotalAmt;
            totalSummry['child'] = childTotalAmt;
            totalSummry['adult'] = parseFloat(adultTotalAmt).toFixed(2);
            totalSummry['child'] = parseFloat(childTotalAmt).toFixed(2);

            $("#s_adult_total").html(adultTotalTxt);
            $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + totalSummry['adult'] : "");
            $("#s_child_total").html(childTotalTxt);
            $("#s_child_total_amt").text(children > 0 ? details.currency+" " + totalSummry['child'] : "");
            //update data-attributes
            details.api_adult_number = adults
            details.api_child_number = children;

            jQuery('.confirm-btn').removeAttr("disabled");
            sumOfGrand(4,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
            details.button_click = 1
            resetFields('visitor-for-zero');
            // packageCalc();
            if (children > 0) {
                $('.kid-free').show();
            }
        } else {
            $('#visitorerrorAlert').modal('show');
        }
    }
});
//Update Visitors End
//check adult and child limit for adding in visitors
function limitVisitors(current, targetInput) {

    var adultLimit = details.api_adult_limit;
    var chldLimit = details.api_child_limit;
    var visitoCheck = true;
    var adults = parseInt($('.adult_input').val()) + 1;
    var children = parseInt($('.child_input').val()) + 1;
    var adultAvailable = details.api_available_slot_adult;
    var childAvailable = details.api_available_slot_child;
    if (targetInput == 'quantity-input-1') {

        if (adults <= 10 && adults <= adultAvailable) {
            visitoCheck = true;
        } else {
            visitoCheck = false;
        }
    }

    if (targetInput == 'quantity-input-2') {
        if (children <= 10 && children <= childAvailable) {
            visitoCheck = true;
        } else {
            visitoCheck = false;
        }
    }

    return visitoCheck;
}

function packageCalc() {

}


//get addons and show recommedned sections on confirm click
$(document).on('click', '.confirm-btn', function () {

    if (details.addonShow == 1 && details.addon_loaded == 0) {

        var api_post_id = details.api_post_id;
        var api_selected_package_id = details.api_selected_package_id;

        if (api_selected_package_id != '' && api_selected_package_id != 0) {
            var adonproductid = api_selected_package_id;
        } else {
            var adonproductid = api_post_id;
        }

        //fetch addons by product id
        get_addons(adonproductid);
    }
    if (details.packagesShow == 1 && details.package_loaded == 0) {

        var api_post_id = details.api_post_id;
        get_packages(api_post_id);
    }
    if(details.addon_loaded == 1 || details.package_loaded == 1) {
        $(".ticket_recommendation").show();
    }
    jQuery('.cart-submit').removeAttr("disabled");
    // $(".ticket_recommendation").show();
    activeStrips();

})

//get packages of ticket included
function get_packages(post_id) {
    // $('#main-loader').show();
    jQuery.ajax({
        url: Aurl.ajaxurl,
        dataType: "json",
        data: {
            nonce: Aurl.api_nonce,
            action: "get_packages",
            product_id: post_id, // Send the product id.
            lang: details.api_language,
            date: details.api_selected_date,
            pack_timeslots:1
        },
        method: 'POST',
        success: function (response) {
            if(response.success) {
                details.package_loaded = 1;
                $('#append_package').empty();
                $.each(response.data, function (index, item) {
                    packageContent(index, item);
                    packageTandC[index] = item.fields.package_popup.terms_conditions;
                });
                $(".ticket_recommendation").show();
                if(details.addonShow == '1') {
                    jQuery('.cart-submit').hide();
                    jQuery('.next-btn').show().removeClass('d-none');
                    jQuery('#addonTab').css({ 'display': 'none'});
                }
            }
        },
        error: function (response) {
            if(details.addonShow == '0') {
                $(".ticket_recommendation").hide();
            }
        }
    });
}

//package content
function packageContent(index, data) {
    var p_post = data.post.ID;
    var p_post_title = data.fields.title;
    var p_post_type = data.post.post_type;
    var p_image1 = data.fields.image;
    var p_image2 = data.fields.image_2;
    var p_description = data.fields.description;
    var p_childFre = data.fields.child.free;
    var p_free_class = p_childFre > 0 ? 'kid-free' : '';
    var p_product_type = data.fields.product_type;
     // Update corresponding input field
     var before_pkg_price_adult = p_product_type == 'variable' ? parseFloat(data.fields.adult.price).toFixed(2) : parseFloat(data.fields.single_item.price).toFixed(2);
     var before_pkg_price_child = p_product_type == 'variable' ? parseFloat(data.fields.child.price).toFixed(2) : 0;
     var before__pkg_cl_f = p_childFre;
     var adult = parseInt($('.adult_input').val());
     var child = parseInt($('.child_input').val());
     var visitorsText = "";
     if (adult > 0) {
         visitorsText += adult + " " + (adult > 1 ? textforVisitor : textForadult1);
     }
     if (child > 0 && details.api_type_child == '1') {
         if (adult > 0) {
             visitorsText += " & " + child + (child > 1 ? " "+children_lang : " "+child_lang);
         } else {
             visitorsText += child + (child > 1 ? " "+children_lang : " "+child_lang);
         }
     }

     var before_adultPricePkg = adult > 0 ? parseFloat(before_pkg_price_adult) * parseFloat(adult) : 0;
     if (before__pkg_cl_f > 0) {

         var freechild = parseFloat(child) - parseFloat(before__pkg_cl_f);
         if (freechild > 0) {
             var before_childPricePkg = child > 0 ? parseFloat(before_pkg_price_child) * parseFloat(freechild) : 0;
         } else {
             var before_childPricePkg = 0;
         }
     } else {
         var before_childPricePkg = child > 0 ? parseFloat(before_pkg_price_child) * parseFloat(child) : 0;
     }

     //packagePrice 300
     var before_calcAMt1 = (parseFloat(before_adultPricePkg) + parseFloat(before_childPricePkg)); //900
     var featuresArray = data.fields.package_popup.features.features_list;
     var termsArray = data.fields.package_popup.terms_conditions;
     var other_detailArray = data.fields.package_popup.other_detail;

    var packageElements = '<li class="p_l ' + p_free_class + '" data-packageindex="'+index+'">\
    <input type="hidden" id="s_pkg_price_'+ p_post + '" name="s_pkg_price_' + p_post + '" value="' + before_calcAMt1 + '">\
    <input type="hidden" id="s_pkg_price_adult'+ p_post + '" name="s_pkg_price_adult' + p_post + '" value="' + before_pkg_price_adult + '">\
    <input type="hidden" id="s_pkg_price_child'+ p_post + '" name="s_pkg_price_child' + p_post + '" value="' + before_pkg_price_child + '">\
    <input type="hidden" id="s_pkg_post_id_'+ p_post + '" name="s_pkg_price_' + p_post + '" value="' + p_post + '">\
    <input type="hidden" id="s_pkg_ad_f_'+ p_post + '" name="s_pkg_ad_f_' + p_post + '" value="' + data.fields.adult.free + '">\
    <input type="hidden" id="s_pkg_cl_f_'+ p_post + '" name="s_pkg_cl_f_' + p_post + '" value="' + p_childFre + '">\
    <input type="hidden" name="s_pkg_price_all[]" value="'+ before_calcAMt1 + '" id="s_pkg_price_all_' + p_post + '">'

    if (p_image2 != '') {
        packageElements += '<div class="imgbox">\
                <figure class="fig-radius">\
            <img class="border-radius" src="'+ p_image1 + '" id="pkg_src_1' + p_post + '" />\
        </figure>\
        <figure class="mob-radius">\
            <img class="mob-radius" src="'+ p_image2 + '" id="pkg_src_2' + p_post + '" />\
        </figure>\
    </div>'
    } else {
        packageElements += '<figure>\
        <img src="'+ p_image1 + '" id="pkg_src_1' + p_post + '" />\
    </figure>'
    }
    packageElements += '<div class="package_info">\
        <div class="package_title">\
            <div class="package_detail">\
                <h4 title="Kids go Free" id="pkg_name_'+ p_post + '">' + p_post_title + '</h4>\
                <p class="package_para">'+ p_description + '</p>\
                '+ data.fields.instructions + '\
            </div>\
            <a href="javascript:void(0)" class="view_info view-package-detail-modal" data-toggle="modal" data-target="#pkgModal'+p_post+'">'+bilingual.view_details_lang+'</a>\
        </div>\
        <div class="package_save">\
            <div class="offer_box">\
                <h3>'+bilingual.start_from_lang+'</h3>\
                <h5 class="text-right" id="s_pkg_amt_calc_'+ p_post + '">'+details.currency+' '+before_calcAMt1+'</h5>\
                <h3>for '+visitorsText+'</h3>'

    if (data.fields.discount_label != '') {
        packageElements += '<div class="offer_badge">\
                    <span>'+ data.fields.discount_label + '</span>\
                </div>'
    }
    packageElements += '</div>'

    packageElements += packagesTimeSlots(data,index);

    packageElements += '</div>\
    </div>\
</li>';
 packageElements += '<div class="modal ticketDetailModal" id="pkgModal'+data.post.ID+'">\
 <div class="modal-dialog modal-lg modal-dialog-centered">\
     <div class="modal-content">\
     <div class="modal-header align-items-center">\
    <div class="d-flex align-items-center justify-content-start">\
        <h4 title="Ticket Info">'+data.fields.title+'</h4>\
    </div>\
    <button type="button" title="Close" class="close" data-dismiss="modal">&times;</button>\
</div>\
<div class="modal-body">\
    <h5>'+data.fields.package_popup.overview.heading+'</h5>\
    <p>'+p_description+'</p>';

    if(featuresArray.length > 0) {

        packageElements += '<h5 class="mt-4">'+data.fields.package_popup.features.heading+'</h5>\
        <div class="row">';

        for (let index = 0; index < featuresArray.length; index++) {
            packageElements += '<div class="col-6">\
                        <div class="single-inclusion">\
                            <figure>\
                                <img src="'+featuresArray[index].icon+'" alt="'+featuresArray[index].name+'" role="presentation" />\
                            </figure>\
                            <p>'+featuresArray[index].name+'</p>\
                        </div>\
                    </div>'
        }
        packageElements += ' </div>';
     }
    if(termsArray.description !='') {
        packageElements += '<h5 class="mt-4">'+termsArray.heading+'</h5>'+termsArray.description;
    }
    if(other_detailArray.description !='') {
        packageElements += '<h5 class="mt-4">'+other_detailArray.heading+'</h5>'+other_detailArray.description;
    }
    packageElements += '</div>\
                        </div>\
                    </div>\
                    </div>';

    $('#append_package').append(packageElements);
    // $('#main-loader').hide();

}

function packagesTimeSlots(data,packageindex) {

    var timeSlotArray_p = [];
    var p_show_timeslots = data.fields.show_timeslots;
    var p_childFre = data.fields.child.free;
    if (!p_show_timeslots) {

        if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {
            var removeIcon = 'd-flex';
            var select_class = 'selected_package';
            var btnTxt = bilingual.selected_button_lang;
            modifyPackageCalcSimple(details.api_adult_number,details.api_child_number,data)
        } else {
            var removeIcon = 'd-none';
            var select_class = '';
            var btnTxt = bilingual.select_button_lang;
        }
        return '<div><div class="'+removeIcon+' trash_sec deselect-package" data-package="'+data.post.ID+'" id="pkgremove' + data.post.ID + '">\
        <div class="img_sec">\
            <img src="'+ details.theme_url + '/assets/images/default/remove.png" />\
        </div>\
        <h6 class="rem">'+bilingual.remove_lang+'</h6>\
    </div>\
        <div class="">\
        <a class="btn s_select_package btn-select '+select_class+'" href="javascript:void(0)" id="s_pkg_id_'+ data.post.ID + '">'+btnTxt+'</a>\
    </div></div>'
    } else {
        if (data.fields.adult.hasOwnProperty('timeslots')) {

            if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {
                var removeIcon = 'd-flex';
                var btn1 = 'style="display:none"';
                var btn2 = 'style="display:flex"';
                var packageMeta = JSON.parse(cartData.package_meta);
                var timeselected = packageMeta.timeslot;

            } else {
                var removeIcon = 'd-none';
                var btn1 = 'style="display:flex"';
                var btn2 = 'style="display:none"';
                var timeselected;
            }

            var timeSlotArray_p = data.fields.adult.timeslots;
            var timeElement = '<div><div class="'+removeIcon+' trash_sec deselect-package-time" data-package="'+data.post.ID+'" id="pkgremove' + data.post.ID + '">\
            <div class="img_sec">\
                <img src="'+ details.theme_url + '/assets/images/default/remove.png" />\
            </div>\
            <h6 class="rem">'+bilingual.remove_lang+'</h6>\
        </div>\
        <div class="mt-2 dropdown">\
        <button id="p_select_btn'+ data.post.ID + '" class="default-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn1+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg" />\
        <span class="select_title">'+bilingual.select_time_lang+'</span>\
    </button>\
    <button id="p_selected_btn'+ data.post.ID + '" class="after-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100 btn-dark text-white" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn2+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg"/>\
        <div class="content">\
            <span class="select_label">'+bilingual.time_lang+'</span>\
            <span class="select_title" id="p_selected_time'+ data.post.ID + '">'+timeselected+'</span>\
        </div>\
    </button>'

            timeElement += '<div class="dropdown-menu multi-column columns-3">\
    <ul class="row multi-column-dropdown timeslot-intervals">'

            for (var i = 0; i < timeSlotArray_p.length; i++) {

                var p_totalCapacity = timeSlotArray_p[i].totalCapacity;
                var p_available = timeSlotArray_p[i].available;
                var p_percentage = (p_totalCapacity * 0.8).toFixed(2);
                var p_totalRemain = parseInt(p_totalCapacity) - parseInt(p_percentage);
                var adultTime = timeSlotArray_p[i].time;
                var p_adultPrice = timeSlotArray_p[i].price;
                var p_adult_timeslotid = timeSlotArray_p[i].timeSlotId;
                if (data.fields.hasOwnProperty('child')) {
                    if (data.fields.child.hasOwnProperty('timeslots')) {

                        var foundTimeSlot = data.fields.child.timeslots.find(slot => slot.time === adultTime);

                        if (foundTimeSlot) {
                            var p_childPrice = foundTimeSlot.price;
                        } else {
                            var p_childPrice = 0;
                        }
                    } else {
                        var p_childPrice = 0;
                    }
                } else {
                    var p_childPrice = 0;
                }
                // Update corresponding input field
                var s_pkg_price_adult = parseInt(p_adultPrice);
                var s_pkg_price_child = parseInt(p_childPrice);
                var s_pkg_cl_f = p_childFre;
                var adult = parseInt($('.adult_input').val());
                var child = parseInt($('.child_input').val());

                var adultPricePkg = adult > 0 ? parseInt(s_pkg_price_adult) * parseInt(adult) : 0;
                if (s_pkg_cl_f > 0) {

                    var freechild = parseInt(child) - parseInt(s_pkg_cl_f);
                    if (freechild > 0) {
                        var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(freechild) : 0;
                    } else {
                        var childPricePkg = 0;
                    }
                } else {
                    var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(child) : 0;
                }
                // totalSummry['adult'] = adultPricePkg;
                // totalSummry['child'] = childPricePkg;

                //packagePrice 300
                var calcAMt1 = parseInt(adultPricePkg) + parseInt(childPricePkg); //900
                if (p_available == 0) {
                    var slotClass = 'disableddrop';
                } else if (p_available <= p_totalRemain) {
                    var slotClass = 'package_select_slot';
                } else {
                    var slotClass = 'package_select_slot';
                }

                if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {

                    var selectedPackageSlot = packageMeta.timeslotid;
                    if(selectedPackageSlot == p_adult_timeslotid) {

                        modifyPackageCalc(adultPricePkg,childPricePkg,timeSlotArray_p[i].time,p_adult_timeslotid,data.post.ID,data);
                    }

                }

                timeElement += '<li class="' + slotClass + ' col-sm-12  timeslot-item" data-adult="'+adultPricePkg+'" data-child="'+childPricePkg+'" data-time="'+timeSlotArray_p[i].time+'" data-timeslot="'+p_adult_timeslotid+'" data-package="'+data.post.ID+'"><a href="javascript:void(0)">' + timeSlotArray_p[i].time + ' | '+details.currency+' ' + calcAMt1 + '</a></li>'
            }

            timeElement += '</ul></div></div></div>';

            return timeElement;
        } else if (data.fields.hasOwnProperty('timeslots')) {

            if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {
                var removeIcon = 'd-flex';
                var btn1 = 'style="display:none"';
                var btn2 = 'style="display:flex"';
                var packageMeta = JSON.parse(cartData.package_meta);
                var timeselected = packageMeta.timeslot;

            } else {
                var removeIcon = 'd-none';
                var btn1 = 'style="display:flex"';
                var btn2 = 'style="display:none"';
                var timeselected;
            }

            var timeSlotArray_p = data.fields.timeslots;
            var timeElement = '<div><div class="'+removeIcon+' trash_sec deselect-package-time" data-package="'+data.post.ID+'" id="pkgremove' + data.post.ID + '">\
            <div class="img_sec">\
                <img src="'+ details.theme_url + '/assets/images/default/remove.png" />\
            </div>\
            <h6 class="rem">'+bilingual.remove_lang+'</h6>\
        </div>\
        <div class="mt-2 dropdown">\
        <button id="p_select_btn'+ data.post.ID + '" class="default-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn1+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg" />\
        <span class="select_title">'+bilingual.select_time_lang+'</span>\
    </button>\
    <button id="p_selected_btn'+ data.post.ID + '" class="after-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100 btn-dark text-white" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn2+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg"/>\
        <div class="content">\
            <span class="select_label">'+bilingual.time_lang+'</span>\
            <span class="select_title" id="p_selected_time'+ data.post.ID + '">'+timeselected+'</span>\
        </div>\
    </button>'

            timeElement += '<div class="dropdown-menu multi-column columns-3">\
    <ul class="row multi-column-dropdown timeslot-intervals">'

            for (var i = 0; i < timeSlotArray_p.length; i++) {

                var p_totalCapacity = timeSlotArray_p[i].totalCapacity;
                var p_available = timeSlotArray_p[i].available;
                var p_percentage = (p_totalCapacity * 0.8).toFixed(2);
                var p_totalRemain = parseInt(p_totalCapacity) - parseInt(p_percentage);
                var adultTime = timeSlotArray_p[i].time;
                var p_adultPrice = timeSlotArray_p[i].price;
                var p_adult_timeslotid = timeSlotArray_p[i].timeSlotId;
                var p_childPrice = 0;
                // Update corresponding input field
                var s_pkg_price_adult = parseInt(p_adultPrice);
                var s_pkg_price_child = parseInt(p_childPrice);
                var s_pkg_cl_f = p_childFre;
                var adult = parseInt($('.adult_input').val());
                var child = parseInt($('.child_input').val());

                var adultPricePkg = adult > 0 ? parseInt(s_pkg_price_adult) * parseInt(adult) : 0;
                if (s_pkg_cl_f > 0) {

                    var freechild = parseInt(child) - parseInt(s_pkg_cl_f);
                    if (freechild > 0) {
                        var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(freechild) : 0;
                    } else {
                        var childPricePkg = 0;
                    }
                } else {
                    var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(child) : 0;
                }
                // totalSummry['adult'] = adultPricePkg;
                // totalSummry['child'] = childPricePkg;

                //packagePrice 300
                var calcAMt1 = parseInt(adultPricePkg) + parseInt(childPricePkg); //900
                if (p_available == 0) {
                    var slotClass = 'disableddrop';
                } else if (p_available <= p_totalRemain) {
                    var slotClass = 'package_select_slot';
                } else {
                    var slotClass = 'package_select_slot';
                }

                if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {

                    var selectedPackageSlot = packageMeta.timeslotid;
                    if(selectedPackageSlot == p_adult_timeslotid) {

                        modifyPackageCalc(adultPricePkg,childPricePkg,timeSlotArray_p[i].time,p_adult_timeslotid,data.post.ID,data);
                    }

                }

                timeElement += '<li class="' + slotClass + ' col-sm-12  timeslot-item" data-adult="'+adultPricePkg+'" data-child="'+childPricePkg+'" data-time="'+timeSlotArray_p[i].time+'" data-timeslot="'+p_adult_timeslotid+'" data-package="'+data.post.ID+'"><a href="javascript:void(0)">' + timeSlotArray_p[i].time + ' | '+details.currency+' ' + calcAMt1 + '</a></li>'
            }

            timeElement += '</ul></div></div></div>';

            return timeElement;
        } else if (data.hasOwnProperty('timeslots')) {

            if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {
                var removeIcon = 'd-flex';
                var btn1 = 'style="display:none"';
                var btn2 = 'style="display:flex"';
                var packageMeta = JSON.parse(cartData.package_meta);
                var timeselected = packageMeta.timeslot;

            } else {
                var removeIcon = 'd-none';
                var btn1 = 'style="display:flex"';
                var btn2 = 'style="display:none"';
                var timeselected;
            }

            var timeSlotArray_p = data.timeslots;
            var timeElement = '<div><div class="'+removeIcon+' trash_sec deselect-package-time" data-package="'+data.post.ID+'" id="pkgremove' + data.post.ID + '">\
            <div class="img_sec">\
                <img src="'+ details.theme_url + '/assets/images/default/remove.png" />\
            </div>\
            <h6 class="rem">'+bilingual.remove_lang+'</h6>\
        </div>\
        <div class="mt-2 dropdown">\
        <button id="p_select_btn'+ data.post.ID + '" class="default-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn1+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg" />\
        <span class="select_title">'+bilingual.select_time_lang+'</span>\
    </button>\
    <button id="p_selected_btn'+ data.post.ID + '" class="after-package btn btn--outline-light dropdown-toggle slot-dropdown border w-100 btn-dark text-white" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-defaulttext="'+bilingual.select_time_slot_lang+'" '+btn2+'>\
        <img src="'+ details.theme_url + '/assets/images/svg/clock.svg"/>\
        <div class="content">\
            <span class="select_label">'+bilingual.time_lang+'</span>\
            <span class="select_title" id="p_selected_time'+ data.post.ID + '">'+timeselected+'</span>\
        </div>\
    </button>'

            timeElement += '<div class="dropdown-menu multi-column columns-3">\
    <ul class="row multi-column-dropdown timeslot-intervals">'

            for (var i = 0; i < timeSlotArray_p.length; i++) {

                var p_totalCapacity = timeSlotArray_p[i].totalCapacity;
                var p_available = timeSlotArray_p[i].available;
                var p_percentage = (p_totalCapacity * 0.8).toFixed(2);
                var p_totalRemain = parseInt(p_totalCapacity) - parseInt(p_percentage);
                var adultTime = timeSlotArray_p[i].time;
                var p_adultPrice = timeSlotArray_p[i].price;
                var p_adult_timeslotid = timeSlotArray_p[i].timeSlotId;
                var p_childPrice = 0;
                // Update corresponding input field
                var s_pkg_price_adult = parseInt(p_adultPrice);
                var s_pkg_price_child = parseInt(p_childPrice);
                var s_pkg_cl_f = p_childFre;
                var adult = parseInt($('.adult_input').val());
                var child = parseInt($('.child_input').val());

                var adultPricePkg = adult > 0 ? parseInt(s_pkg_price_adult) * parseInt(adult) : 0;
                if (s_pkg_cl_f > 0) {

                    var freechild = parseInt(child) - parseInt(s_pkg_cl_f);
                    if (freechild > 0) {
                        var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(freechild) : 0;
                    } else {
                        var childPricePkg = 0;
                    }
                } else {
                    var childPricePkg = child > 0 ? parseInt(s_pkg_price_child) * parseInt(child) : 0;
                }
                // totalSummry['adult'] = adultPricePkg;
                // totalSummry['child'] = childPricePkg;

                //packagePrice 300
                var calcAMt1 = parseInt(adultPricePkg) + parseInt(childPricePkg); //900
                if (p_available == 0) {
                    var slotClass = 'disableddrop';
                } else if (p_available <= p_totalRemain) {
                    var slotClass = 'package_select_slot';
                } else {
                    var slotClass = 'package_select_slot';
                }

                if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {

                    var selectedPackageSlot = packageMeta.timeslotid;
                    if(selectedPackageSlot == p_adult_timeslotid) {

                        modifyPackageCalc(adultPricePkg,childPricePkg,timeSlotArray_p[i].time,p_adult_timeslotid,data.post.ID,data);
                    }

                }

                timeElement += '<li class="' + slotClass + ' col-sm-12  timeslot-item" data-adult="'+adultPricePkg+'" data-child="'+childPricePkg+'" data-time="'+timeSlotArray_p[i].time+'" data-timeslot="'+p_adult_timeslotid+'" data-package="'+data.post.ID+'"><a href="javascript:void(0)">' + timeSlotArray_p[i].time + ' | '+details.currency+' ' + calcAMt1 + '</a></li>'
            }

            timeElement += '</ul></div></div></div>';

            return timeElement;
        } else {
            setTimeout(function() {
                $('[data-packageindex="'+packageindex+'"]').remove();
                }, 500);
    //         if(details.api_modify == 'true' && details.api_selected_package_id == data.post.ID) {
    //             var removeIcon = 'd-flex';
    //             var select_class = 'selected_package';
    //             var btnTxt = bilingual.selected_button_lang;
    //             modifyPackageCalcSimple(details.api_adult_number,details.api_child_number,data)
    //         } else {
    //             var removeIcon = 'd-none';
    //             var select_class = '';
    //             var btnTxt = bilingual.select_button_lang;
    //         }
    //         return '<div><div class="'+removeIcon+' trash_sec deselect-package" data-package="'+data.post.ID+'" id="pkgremove' + data.post.ID + '">\
    //     <div class="img_sec">\
    //         <img src="'+ details.theme_url + '/assets/images/default/remove.png" />\
    //     </div>\
    //     <h6 class="rem">'+bilingual.remove_lang+'</h6>\
    // </div>\
    //     <div class="">\
    //     <a class="btn s_select_package btn-select '+select_class+'" href="javascript:void(0)" id="s_pkg_id_'+ data.post.ID + '">'+btnTxt+'</a>\
    // </div></div>'
        }
    }
}

//select package slot
$(document).on('click','.package_select_slot', function(){
    resetFields('package');
    var n_a_prcie = $(this).data('adult');
    var n_c_price = $(this).data('child');
    var n_time = $(this).data('time');
    var n_timeslot_id = $(this).data('timeslot');
    var n_post = $(this).data('package');
    var adults = parseInt($('.adult_input').val());
    var children = parseInt($('.child_input').val());
        
    // Get the data-index value
    var parentLi = $(this).closest('li[data-packageindex]');
    var packageIndex = parentLi.data('packageindex');
    $('#tandcbody_main').addClass('d-none');
    $('#tandcbody_other').html(packageTandC[packageIndex].description).removeClass('d-none');
    //packageTandC[packageIndex].description
    details.api_selected_package_id = n_post;
    var s_pkg_cl_f = $('#s_pkg_cl_f_' + n_post).val(); //free child count
    if (s_pkg_cl_f > 0) {

        var freechild = parseInt(children) - parseInt(s_pkg_cl_f);
        if (freechild > 0) {
            var children = freechild;
        } else {
            var children = 0;
        }
        var childText = details.currency+" 0";
    } else {
        var children = children;
        var childText = "";
    }
    $('#packages').find(".selected_package").removeClass("selected_package").css({"pointer-events":"all"}).text(bilingual.select_button_lang);
    $('.default-package').show();
    $('.after-package').hide();
    $('.trash_sec').addClass('d-none').removeClass('d-flex');

    var n_total = parseInt(n_a_prcie)+parseInt(n_c_price);
    $('#s_pkg_amt_calc_'+n_post).text(details.currency+' '+n_total);
    $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + n_a_prcie : "");
    $("#s_child_total_amt").text(children > 0 ? details.currency+" " + n_c_price : childText);
    $('#pkgremove'+n_post).addClass('d-flex').removeClass('d-none');
    $('#p_select_btn'+n_post).hide();
    $('#p_selected_btn'+n_post).show();
    $('#p_selected_time'+n_post).text(n_time);
    $('.s_package_time').text(n_time);
    var pkg_image_url1 = $('#pkg_src_1' + n_post).attr('src');
        var pkg_image_url2 = $('#pkg_src_2' + n_post).attr('src');
        var pkg_name = $('#pkg_name_' + n_post).text();
        $('.s_ticket_text').text(pkg_name);
        $('#s_ticket_image1').attr('src', pkg_image_url1);
        $('.package-tag').show();
        if (pkg_image_url2) {
            $('#s_ticket_image2').attr('src', pkg_image_url2);
            $('#s_ticket_image2').show();
        } else {
            $('#s_ticket_image2').hide();
            $('#s_ticket_image1').css({ 'width': '100%' });
        }
        $('#ticket-image').hide();
        $('#package-image').show();
        //disable ticket timeslot strip
        $(".calendar_card:nth-child(2)").css({ 'pointer-events': 'none', 'opacity': '0.4' });
        //create package array
        totalSummry['package'] = totalSummry['package'] || {}; // Initialize if not exists
        totalSummry['package']['s_pkg_list'] = n_total;
        totalSummry['package']['timeslot'] = n_time;
        totalSummry['package']['timeslotid'] = n_timeslot_id;
    totalSummry['adult'] = n_a_prcie;
    totalSummry['child'] = n_c_price;
    sumOfGrand(5,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
    get_addons(n_post);

});

//deselect package
$(document).on('click', '.deselect-package', function() {

    resetFields('package');
    var d_post = $(this).data('package');
    var adults = $('.adult_input').val();
    var children = $('.child_input').val();
    var adultPricing = details.api_adult_price;
    var childPricing = details.api_child_price;
    details.api_selected_package_id = 0
        $('#packages').find(".selected_package").removeClass("selected_package").css({"pointer-events":"all"});
        totalSummry['adult'] = adults > 0 ? adults * adultPricing : 0;
        totalSummry['child'] = children > 0 ? children * childPricing : 0;
        $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + totalSummry['adult'] : "");
        $("#s_child_total_amt").text(children > 0 ? details.currency+" " + totalSummry['child'] : "");
        totalSummry['package'] = {};
        $('#pkgremove'+d_post).addClass('d-none').removeClass('d-flex');
        $('#s_pkg_id_' + d_post).text(bilingual.select_button_lang);
        $('.s_ticket_text').text(currentTicketName);
        $('#ticket-image').show();
        $('#package-image').hide();
        $('#s_ticket_image1').removeAttr('style');
        details.addon_loaded = 0;
        if(details.addonShow) {
            get_addons(details.api_post_id);
        } else {
            $('#addonTab').hide();
            $('#addon_Elements').empty();
        }
        $('.package-tag').hide();
        $('#tandcbody_other').addClass('d-none');
        $('#tandcbody_main').removeClass('d-none');
        sumOfGrand(6,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
});
$(document).on('click', '.deselect-package-time', function() {

    resetFields('package');
    var d_post = $(this).data('package');
    var d_packagePrice = $('#s_pkg_price_'+d_post).val();
    details.api_selected_package_id = 0
    var adultPricing = details.api_adult_price;
    var childPricing = details.api_child_price;
    var adults = $('.adult_input').val();
    var children = $('.child_input').val();
    $('#s_pkg_amt_calc_'+d_post).text(details.currency+' '+d_packagePrice);
    totalSummry['package'] = {};
    totalSummry['adult'] = adults > 0 ? adults * adultPricing : 0;
    totalSummry['child'] = children > 0 ? children * childPricing : 0;
    $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + totalSummry['adult'] : "");
    $("#s_child_total_amt").text(children > 0 ? details.currency+" " + totalSummry['child'] : "");
    $('#pkgremove'+d_post).addClass('d-none').removeClass('d-flex');
    $('#p_select_btn'+d_post).show();
    $('#p_selected_btn'+d_post).hide();
    $('#p_selected_time'+d_post).text('Time');
    $('.s_ticket_text').text(currentTicketName);
    $('#ticket-image').show();
    $('#package-image').hide();
    $('#s_ticket_image1').removeAttr('style');
    $('.package-tag').hide();
    $('.default-package').show();
    $('.after-package').hide();
    $('.trash_sec').addClass('d-none').removeClass('d-flex');
    $('.s_package_time').text(details.api_selected_slot_timing);
    $(".calendar_card:nth-child(2)").css({ 'pointer-events': 'all', 'opacity': '1' });
    details.addon_loaded = 0;
    if(details.addonShow) {
        get_addons(details.api_post_id);
    } else {
        $('#addonTab').hide();
        $('#addon_Elements').empty();
    }
    $('#tandcbody_other').addClass('d-none');
    $('#tandcbody_main').removeClass('d-none');
    sumOfGrand(7,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
});

//update package details in modify for timeslot
function modifyPackageCalc(adultPricePkg,childPricePkg,time,timeslot,ID,pkData){

    var n_a_prcie = adultPricePkg;
    var n_c_price = childPricePkg;
    var n_time = time;
    var n_timeslot_id = timeslot;
    var n_post = ID;
    var adults = parseInt($('.adult_input').val());
    var children = parseInt($('.child_input').val());
    details.api_selected_package_id = n_post;
    var s_pkg_cl_f = $('#s_pkg_cl_f_' + n_post).val(); //free child count
    if (s_pkg_cl_f > 0) {

        var freechild = parseInt(children) - parseInt(s_pkg_cl_f);
        if (freechild > 0) {
            var children = freechild;
        } else {
            var children = 0;
        }
        var childText = details.currency+" 0";
    } else {
        var children = children;
        var childText = "";
    }
    $('#packages').find(".selected_package").removeClass("selected_package").css({"pointer-events":"all"}).text(bilingual.select_button_lang);
    $('.default-package').show();
    $('.after-package').hide();
    $('.trash_sec').addClass('d-none').removeClass('d-flex');
    $(".calendar_card:nth-child(2)").css({ 'pointer-events': 'none', 'opacity': '0.4' });

    var n_total = parseInt(n_a_prcie)+parseInt(n_c_price);
    setTimeout(() => {
        $('#s_pkg_amt_calc_'+n_post).text(details.currency+' '+n_total);
    }, 2000);
    $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + n_a_prcie : "");
    $("#s_child_total_amt").text(children > 0 ? details.currency+" " + n_c_price : childText);
    $('#pkgremove'+n_post).addClass('d-flex').removeClass('d-none');
    $('#p_select_btn'+n_post).hide();
    $('#p_selected_btn'+n_post).show();
    $('#p_selected_time'+n_post).text(n_time);
    $('.s_package_time').text(n_time);
    var pkg_image_url1 = pkData.fields.image;
        var pkg_image_url2 = pkData.fields.image_2;
        var pkg_name =  pkData.fields.title;
        $('.s_ticket_text').text(pkg_name);
        $('#s_ticket_image1').attr('src', pkg_image_url1);
        $('.package-tag').show();
        if (pkg_image_url2) {
            $('#s_ticket_image2').attr('src', pkg_image_url2);
            $('#s_ticket_image2').show();
        } else {
            $('#s_ticket_image2').hide();
            $('#s_ticket_image1').css({ 'width': '100%' });
        }
        $('#ticket-image').hide();
        $('#package-image').show();
        //create package array
        totalSummry['package'] = totalSummry['package'] || {}; // Initialize if not exists
        totalSummry['package']['s_pkg_list'] = n_total;
        totalSummry['package']['timeslot'] = n_time;
        totalSummry['package']['timeslotid'] = n_timeslot_id;
    totalSummry['adult'] = n_a_prcie;
    totalSummry['child'] = n_c_price;
    sumOfGrand(8,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
}

//update package details in modify without timeslot
function modifyPackageCalcSimple(adults,children,pkData){

    var adults = adults;
    var children = children;
    var s_product_type = pkData.fields.product_type;
    var s_pkg_price_adult = s_product_type == 'variable' ? parseFloat(pkData.fields.adult.price).toFixed(2) : parseFloat(pkData.fields.single_item.price).toFixed(2);
    var s_pkg_price_child = s_product_type == 'variable' ? parseFloat(pkData.fields.child.price).toFixed(2) : parseFloat(pkData.fields.single_item.price).toFixed(2);
    var s_pkg_cl_f = pkData.fields.child.free //free child count

    if (s_pkg_cl_f > 0) {

        var freechild = parseInt(children) - parseInt(s_pkg_cl_f);
        if (freechild > 0) {
            var children = freechild;
        } else {
            var children = 0;
        }
        var childText = details.currency+" 0";
    } else {
        var children = children;
        var childText = "";
    }
        var n_total = parseFloat(s_pkg_price_adult)+parseFloat(s_pkg_price_child);
        var adultPkgAmt = adults > 0 ? s_pkg_price_adult * adults : 0;
        var childPkgAmt = children > 0 ? s_pkg_price_child * children : 0;
        var adltTotal = parseFloat(adultPkgAmt).toFixed(2);
        var chlTotal = parseFloat(childPkgAmt).toFixed(2);
        totalSummry['adult'] = adltTotal;
        totalSummry['child'] = chlTotal;
        $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + adltTotal : "");
        $("#s_child_total_amt").text(children > 0 ? details.currency+" " + chlTotal : childText);

        //create package array
        totalSummry['package'] = totalSummry['package'] || {}; // Initialize if not exists
        totalSummry['package']['s_pkg_list'] = n_total;
        totalSummry['package']['timeslot'] = '';
        totalSummry['package']['timeslotid'] = '';

        var pkgPostId = pkData.post.ID;
        details.api_selected_package_id = pkgPostId
        var pkg_image_url1 = pkData.fields.image;
        var pkg_image_url2 = pkData.fields.image_2;
        var pkg_name = pkData.fields.title;
        $('.s_ticket_text').text(pkg_name);
        $('#s_ticket_image1').attr('src', pkg_image_url1);
        $('.package-tag').show();
        if (pkg_image_url2) {
            $('#s_ticket_image2').attr('src', pkg_image_url2);
            $('#s_ticket_image2').show();
        } else {
            $('#s_ticket_image2').hide();
            $('#s_ticket_image1').css({ 'width': '100%' });
        }
        $('#ticket-image').hide();
        $('#package-image').show();
        sumOfGrand(9,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
}

//get addons
function get_addons(adonproductid) {
    details.addon_loaded = 1;
    // $('#main-loader').show();

    jQuery.ajax({
        url: Aurl.ajaxurl,
        dataType: "json",
        data: {
            nonce: Aurl.api_nonce,
            action: "get_addons",
            product_id: adonproductid, // Send the product id.
            add_timeslots: 0,
            lang: details.api_language,
            date: ''
        },
        method: 'POST',
        success: function (response) {
            if(response.success == true) {
                $(".ticket_recommendation").show();
                $('#addon_Elements').empty();
                // if (details.packagesShow == 0) {
                
                    if (details.packagesShow == 0) {
                        $('#addonTab').show();
                        $('#addons').addClass('in active show');
                        jQuery('.cart-submit').show();
                        jQuery('.next-btn').addClass('d-none');
                    } else {
                        $('#addonTab').hide();
                        jQuery('.cart-submit').hide();
                        jQuery('.next-btn').removeClass('d-none');
                    }
                // }
                $.each(response.data, function (index, item) {
                    for (let x in item) {
                        addonElements(index, item[x])
                    }
                });
            }
        },
        error: function (response) {
            details.addon_loaded = 0;
            $('#addon_Elements').empty();
            $('#addon_Elements').text("No Add-ons Found");
            $('#addonTab').hide();
            jQuery('.cart-submit').show();
            jQuery('.next-btn').addClass('d-none');
            if(details.packagesShow == '0') {
                $(".ticket_recommendation").hide();
            }
        }
    });

}

//modify addons
function addonsOnModify(adonproductid, addOnData, addons) {

    details.addon_loaded = 1;
    // $('#main-loader').show();
    var addons = JSON.parse(addons)
    jQuery.ajax({
        url: Aurl.ajaxurl,
        dataType: "json",
        data: {
            nonce: Aurl.api_nonce,
            action: "get_addons",
            product_id: adonproductid // Send the product id.
        },
        method: 'POST',
        success: function (response) {
            if(response.success == true) {

                // $('#main-loader').hide();
            $('#addon_Elements').empty();
            $('#addonTab').show();
            var addonElements = '';

            $.each(response.data, function (index, item) {
                for (let x in item) {
                    var price = item[x].fields.price;
                    var addEmaarId = item[x].fields.id;
                    var addon_individual = item[x].fields.addon_individual;
                    var addonpurchase_limit = item[x].fields.purchase_limit;
                    if (addons.hasOwnProperty('s_addon_' + item[x].post.ID)) {

                        if (!$("#s_addon_id_" + item[x].post.ID).length) {
                            createAddonBlock(item[x].post.ID);
                        }
                        var quantity = addons['s_addon_' + item[x].post.ID].quantity;
                        var addonTimeSlotIdModify = addons['s_addon_' + item[x].post.ID].timeslotid;
                        var addonTimeSlotModify = addons['s_addon_' + item[x].post.ID].timeslot;
                        var selectedAddonAMt = price * quantity;
                        totalSummry['addon'] = totalSummry['addon'] + selectedAddonAMt

                        totalSummry['addon_object'] = totalSummry['addon_object'] || {};
                        totalSummry['addon_object']['s_addon_' + item[x].post.ID] = totalSummry['addon_object']['s_addon_' + item[x].post.ID] || {};
                        totalSummry['addon_object']['s_addon_' + item[x].post.ID]['post_id'] = item[x].post.ID;
                        totalSummry['addon_object']['s_addon_' + item[x].post.ID]['quantity'] = quantity;
                        totalSummry['addon_object']['s_addon_' + item[x].post.ID]['timeslotid'] = addonTimeSlotIdModify;
                        totalSummry['addon_object']['s_addon_' + item[x].post.ID]['timeslot'] = addonTimeSlotModify;

                        $("#s_addon_total" + item[x].post.ID).html(quantity > 0 ? quantity + "&nbsp; X &nbsp;" + item[x].post.post_title + " <span class='op-06'>("+bilingual.addons_lang+")</span>" : "");
                        $("#s_addon_total_amt" + item[x].post.ID).text(quantity > 0 ? details.currency+" " + price * quantity : "");

                        var addonElements = $('<li class="p_l" id="addon_loop_' + item[x].post.ID + '">\
                        <input type="hidden" id="s_add_on_id' + item[x].post.ID + '" value="' + item[x].post.ID + '">\
                            <input type="hidden" id="s_add_on_price' + item[x].post.ID + '" value="' + price + '">\
                            <input type="hidden" id="s_add_on_individual' + item[x].post.ID + '" value="' + addon_individual + '">\
                            <input type="hidden" id="s_add_on_limit' + item[x].post.ID + '" value="' + addonpurchase_limit + '">\
                            <figure class="positon-relative">\
                                <img src="' + item[x].fields.image + '" />\
                            </figure>\
                            <div class="package_info">\
                                <div class="package_title">\
                                    <div class="package_detail">\
                                        <h4 title="Kids go Free" id="addon_title_' + item[x].post.ID + '">' + item[x].post.post_title + '</h4>\
                                        ' + item[x].fields.instructions + '\
                                    </div>\
                                    <a href="javascript:void(0)" class="view_info view-details-modal-btn">'+bilingual.view_details_lang+'</a>\
                                </div>\
                                <div class="package_save">\
                                    <div class="offer_box">\
                                        <h5 class="text-right">' + item[x].fields.currency + ' ' + price + '</h5>\
                                        <h3>'+ item[x].fields.text_below_price+'</h3>\
                                    </div>\
                                    <div class="">\
                                        <div class="quantity justify-content-end">\
                                            <a href="#" class="quantity__minus addons_minus fw-400" data-target="quantity-input-addon-' + item[x].post.ID + '"><span>-</span></a>\
                                            <input name="addon_quantity" type="text" class="quantity__input" id="quantity-input-addon-'
                            + item[x].post.ID + '" value="' + quantity + '" disabled="disabled">\
                                            <a href="#" class="quantity__plus addons_plus fw-400" data-target="quantity-input-addon-' + item[x].post.ID + '"><span>\+</span></a>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>');
                        addonElements.find('.view-details-modal-btn').on('click', () => viewDetailsModal(item[x]));
                        $('#addon_Elements').append(addonElements);


                    } else {
                        var addonElements = $('<li class="p_l" id="addon_loop_' + item[x].post.ID + '">\
                        <input type="hidden" id="s_add_on_id' + item[x].post.ID + '" value="' + item[x].post.ID + '">\
                            <input type="hidden" id="s_add_on_price' + item[x].post.ID + '" value="' + price + '">\
                            <input type="hidden" id="s_add_on_individual' + item[x].post.ID + '" value="' + addon_individual + '">\
                            <input type="hidden" id="s_add_on_limit' + item[x].post.ID + '" value="' + addonpurchase_limit + '">\
                            <figure class="positon-relative">\
                                <img src="' + item[x].fields.image + '" />\
                            </figure>\
                            <div class="package_info">\
                                <div class="package_title">\
                                    <div class="package_detail">\
                                        <h4 title="Kids go Free" id="addon_title_' + item[x].post.ID + '">' + item[x].post.post_title + '</h4>\
                                        ' + item[x].fields.instructions + '\
                                    </div>\
                                    <a href="javascript:void(0)" class="view_info view-details-modal-btn">'+bilingual.view_details_lang+'</a>\
                                </div>\
                                <div class="package_save">\
                                    <div class="offer_box">\
                                        <h5 class="text-right">' + item[x].fields.currency + ' ' + price + '</h5>\
                                        <h3>'+ item[x].fields.text_below_price+'</h3>\
                                    </div>\
                                    <div class="">\
                                        <div class="quantity justify-content-end">\
                                            <a href="#" class="quantity__minus addons_minus fw-400 disabled-decrement" data-target="quantity-input-addon-' + item[x].post.ID + '"><span>-</span></a>\
                                            <input name="addon_quantity" type="text" class="quantity__input" id="quantity-input-addon-'
                            + item[x].post.ID + '" value="0" disabled="disabled">\
                                            <a href="#" class="quantity__plus addons_plus fw-400" data-target="quantity-input-addon-' + item[x].post.ID + '"><span>\+</span></a>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>');
                        addonElements.find('.view-details-modal-btn').on('click', () => viewDetailsModal(item[x]));
                        $('#addon_Elements').append(addonElements);
                    }
                }
            });
            // addonElements.find('.view-details-modal-btn').on('click', () => viewDetailsModal(item[x]));

            sumOfGrand(10,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
            }
        },
        error: function (response) {
            $('#addon_Elements').empty();
            $('#addon_Elements').text("No Add-ons Found");
        }
    });
}

//create addon elements
function addonElements(index, data) {

    var addonImage = data.fields.image;
    var addOnName = data.post.post_title;
    var addPostId = data.post.ID;
    var addonDesc = data.fields.instructions;
    var addonview_detail_url = data.fields.view_detail_url;
    var addonprice = data.fields.price;
    var addoncurrency = data.fields.currency;
    var addonpurchase_limit = data.fields.purchase_limit;
    var addon_individual = data.fields.addon_individual;

    var $addonElements = $('<li class="p_l" id="addon_loop_' + addPostId + '">\
    <input type="hidden" id="s_add_on_id' + addPostId + '" value="' + addPostId + '">\
        <input type="hidden" id="s_add_on_price' + addPostId + '" value="' + addonprice + '">\
        <input type="hidden" id="s_add_on_individual' + addPostId + '" value="' + addon_individual + '">\
        <input type="hidden" id="s_add_on_limit' + addPostId + '" value="' + addonpurchase_limit + '">\
        <figure class="positon-relative">\
            <img src="' + addonImage + '" />\
        </figure>\
        <div class="package_info">\
            <div class="package_title">\
                <div class="package_detail">\
                    <h4 title="Kids go Free" id="addon_title_' + addPostId + '">' + addOnName + '</h4>\
                    ' + addonDesc + '\
                </div>\
                <a href="javascript:void(0)" class="view_info view-details-modal-btn">'+bilingual.view_details_lang+'</a>\
            </div>\
            <div class="package_save">\
                <div class="offer_box">\
                    <h5 class="text-right">' + addoncurrency + ' ' + addonprice + '</h5>\
                    <h3>'+ data.fields.text_below_price+'</h3>\
                </div>\
                <div class="">\
                    <div class="quantity justify-content-end">\
                        <a href="#" class="quantity__minus addons_minus fw-400 disabled-decrement" data-target="quantity-input-addon-' + addPostId + '"><span>-</span></a>\
                        <input name="addon_quantity" type="text" class="quantity__input" id="quantity-input-addon-'
        + addPostId + '" value="0" disabled="disabled">\
                        <a href="#" class="quantity__plus addons_plus fw-400" data-target="quantity-input-addon-' + addPostId + '"><span>\+</span></a>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </li>');
    $addonElements.find('.view-details-modal-btn').on('click', () => viewDetailsModal(data));

    $('#addon_Elements').append($addonElements);

}

//view addon details
function viewDetailsModal(data) {

    var Overview = '';
    if (data.fields.description != '') {
        var Overview = '<h5>Overview</h5>\
                    <p>'+ data.fields.description + '</p>';
    }
    var featuresArray = data.fields.addon_popup.features.features_list;
    var features = '';
    if (featuresArray.length > 0) {
        var features = '';
        for (let index = 0; index < featuresArray.length; index++) {
            features += '<div class="col-6">\
            <div class="single-inclusion">\
            <figure>\
            <img src="'+ featuresArray[index].icon + '" alt="addon image" role="presentation" />\
        </figure>\
        <p>'+ featuresArray[index].name + '</p>\
        </div>\
        </div>'
        }
    }
    var termsandcon = '';
    if (data.fields.addon_popup.terms_conditions != '') {
        var termsandcon = '<h5 class="mt-4">' + data.fields.addon_popup.terms_conditions.heading + '</h5>\
        '+ data.fields.addon_popup.terms_conditions.description + ''
    }
    var modalBody = '<div class="modal-header align-items-center">\
    <div class="d-flex align-items-center justify-content-start">\
        <h4 class="modal-title">'+ data.post.post_title + '</h4>\
    </div>\
    <button type="button" title="Close" class="close" data-dismiss="modal">&times;</button>\
</div>\
<div class="modal-body">\
    '+ Overview + '\
    <h5 class="mt-4">'+ data.fields.addon_popup.features.heading + '</h5>\
    <div class="row">\
        '+ features + '\
    </div>\
    '+ termsandcon + '\
</div>';
    jQuery("#addonDetailModal .modal-content").html(modalBody);


    jQuery('#addonDetailModal').modal('show');

}


//Update Package pricing with amount
$(document).on('click', '.s_select_package', function () {
    // resetFields('package');
    var pkgId = this.id.substring(9);
    var adults = $('.adult_input').val();
    var children = $('.child_input').val();
    var packagePrice = $('#s_pkg_price_' + pkgId).val();
    var s_pkg_price_adult = $('#s_pkg_price_adult' + pkgId).val();
    var s_pkg_price_child = $('#s_pkg_price_child' + pkgId).val();
    var s_pkg_cl_f = $('#s_pkg_cl_f_' + pkgId).val(); //free child count
    var prevBtn = $('#packages').find(".selected_package").attr('id');
    // Get the data-index value
    var parentLi = $(this).closest('li[data-packageindex]');
    var packageIndex = parentLi.data('packageindex');
    $('#tandcbody_main').addClass('d-none');
    $('#tandcbody_other').html(packageTandC[packageIndex].description).removeClass('d-none');
    if (prevBtn != undefined) {
        $('#' + prevBtn).text(bilingual.select_button_lang);
    }

    $('.default-package').show();
    $('.after-package').hide();
    $('.trash_sec').addClass('d-none').removeClass('d-flex');
    $('#pkgremove'+pkgId).addClass('d-flex').removeClass('d-none');
    $(this).css({ 'pointer-events': 'none'});
    $(".calendar_card:nth-child(2)").css({ 'pointer-events': 'all', 'opacity': '1' });
    if ($(this).hasClass("selected_package")) {

        

    } else {

        if (s_pkg_cl_f > 0) {

            var freechild = parseInt(children) - parseInt(s_pkg_cl_f);
            if (freechild > 0) {
                var children = freechild;
            } else {
                var children = 0;
            }
            var childText = details.currency+" 0";
        } else {
            var children = children;
            var childText = "";
        }

        $('#packages').find(".selected_package").removeClass("selected_package");
        $(this).addClass("selected_package");
        $('#s_ticket_image1').removeAttr('style');

        var adultPkgAmt = adults > 0 ? s_pkg_price_adult * adults : 0;
        var childPkgAmt = children > 0 ? s_pkg_price_child * children : 0;
        var adltTotal = parseFloat(adultPkgAmt).toFixed(2);
        var chlTotal = parseFloat(childPkgAmt).toFixed(2);
        totalSummry['adult'] = adltTotal;
        totalSummry['child'] = chlTotal;
        $("#s_adult_total_amt").text(adults > 0 ? details.currency+" " + adltTotal : "");
        $("#s_child_total_amt").text(children > 0 ? details.currency+" " + chlTotal : childText);

        //create package array
        totalSummry['package'] = totalSummry['package'] || {}; // Initialize if not exists
        totalSummry['package']['s_pkg_list'] = packagePrice;
        totalSummry['package']['timeslot'] = '';
        totalSummry['package']['timeslotid'] = '';
        $('#s_pkg_id_' + pkgId).text(bilingual.selected_button_lang);
        var pkgPostId = $('#s_pkg_post_id_' + pkgId).val();
        details.api_selected_package_id = pkgPostId
        var pkg_image_url1 = $('#pkg_src_1' + pkgId).attr('src');
        var pkg_image_url2 = $('#pkg_src_2' + pkgId).attr('src');
        var pkg_name = $('#pkg_name_' + pkgId).text();
        $('.s_ticket_text').text(pkg_name);
        $('#s_ticket_image1').attr('src', pkg_image_url1);
        $('.package-tag').show();
        if (pkg_image_url2) {
            $('#s_ticket_image2').attr('src', pkg_image_url2);
            $('#s_ticket_image2').show();
        } else {
            $('#s_ticket_image2').hide();
            $('#s_ticket_image1').css({ 'width': '100%' });
        }
        $('#ticket-image').hide();
        $('#package-image').show();
        $('.s_slot').text(details.api_selected_slot_timing);
        details.addon_loaded = 0;
        get_addons(pkgId);
    }
    sumOfGrand(11,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
})

//Update Add-ons
$(document).on('click', '.addons_minus', function (e) {
    e.preventDefault();
    var targetInput = $('#' + $(this).data('target'));
    var value = parseFloat(targetInput.val());

    if (value > 0) {
        value--;

        targetInput.val(value);
        var addOnId = $(this).data('target').substring(21);
        if ($('#addon_loop_' + addOnId).hasClass("disable-now")) {
        } else {
            var addOnCount = $('#quantity-input-addon-' + addOnId).val();
            var addOnName = $("#addon_title_" + addOnId).text();
            var addOnAmt = $('#s_add_on_price' + addOnId).val();
            var afterTotal = grandTotal - addOnAmt;
            $("#s_addon_total" + addOnId).html(value > 0 ? value + "&nbsp; X &nbsp;" + addOnName + " <span class='op-06'>("+bilingual.addons_lang+")</span>" : "");
            $("#s_addon_total_amt" + addOnId).text(addOnCount > 0 ? details.currency+" " + addOnAmt * value : "");
            totalSummry['addon'] = totalSummry['addon'] > 0 ? totalSummry['addon'] - parseFloat(addOnAmt) : 0;

            //update add on object
            totalSummry['addon_object']['s_addon_' + addOnId]['quantity'] = value;
            if (addOnCount == 0) {
                $("#s_addon_id_" + addOnId).remove();
                $('#addon_loop_' + addOnId).addClass("disable-now");
                delete totalSummry['addon_object']['s_addon_' + addOnId];
                $('[data-target="' + $(this).data('target') + '"].addons_minus').addClass("disabled-decrement");
            }
            if ($('.s_addon_summary').length == 0) {
                $('.addon-border-top').remove();
            }
            sumOfGrand(12,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
            ////console.log("alert");
        }
    }
});

$(document).on('click', '.addons_plus', function (e) {
    e.preventDefault();
    $('.s_addon_summary').show();
    var targetInput = $('#' + $(this).data('target'));
    var targetInput = $('#' + $(this).data('target'));
    $('[data-target="' + $(this).data('target') + '"].addons_minus').removeClass("disabled-decrement");
    var value = parseFloat(targetInput.val());
    var addOnId = $(this).data('target').substring(21);
    var s_add_on_individual = $('#s_add_on_individual' + addOnId).val();
    var s_add_on_limit = $('#s_add_on_limit' + addOnId).val();
    var checkLimitAddon = s_add_on_individual == 'true' ? addonLimit(s_add_on_limit, value) : limitVisitorsaddon(value);
    if (checkLimitAddon) {
        value++;
        targetInput.val(value);

        var addOnPrice = $('#s_add_on_price' + addOnId).val();
        $('#addon_loop_' + addOnId).removeClass("disable-now");
        var addOnName = $("#addon_title_" + addOnId).text();
        var addOnAmt = parseFloat(addOnPrice);
        if (!$("#s_addon_id_" + addOnId).length) {
            createAddonBlock(addOnId);
        }
        //create addon object
        totalSummry['addon'] = totalSummry['addon'] + parseFloat(addOnAmt);
        //create addon array
        var addOnPostid = $('#s_add_on_id' + addOnId).val();
        // Create an empty object dynamically and set it as a property of totalSummry
        totalSummry['addon_object'] = totalSummry['addon_object'] || {};
        totalSummry['addon_object']['s_addon_' + addOnId] = {};
        totalSummry['addon_object']['s_addon_' + addOnId]['post_id'] = addOnPostid;
        totalSummry['addon_object']['s_addon_' + addOnId]['quantity'] = value;
        totalSummry['addon_object']['s_addon_' + addOnId]['timeslotid'] = '';
        totalSummry['addon_object']['s_addon_' + addOnId]['timeslot'] = '';

        $("#s_addon_total" + addOnId).html(value > 0 ? value + "&nbsp; X &nbsp;" + addOnName + " <span class='op-06'>("+bilingual.addons_lang+")</span>" : "");
        $("#s_addon_total" + addOnId).addClass("fw-400");
        $("#s_addon_total_amt" + addOnId).text(value > 0 ? details.currency+" " + addOnAmt * value : "");
        $("#s_addon_total_amt" + addOnId).addClass("fw-400");
        $('.ticket_card_body').animate({
            scrollTop: 200
        }, 800);
        sumOfGrand(13,totalSummry['adult'], totalSummry['child'], 0, totalSummry['addon']);
    } else {
        $('#addonerrorAlert').modal('show');
    }
});

//check adult and child limit for adding addons
function limitVisitorsaddon(targetInput) {

    var visitoCheck = true;
    var currentVal = parseInt(targetInput) + 1;
    var adults = parseInt($('.adult_input').val());
    var children = parseInt($('.child_input').val());
    var checkForlimit = parseInt(adults) + parseInt(children);

    if (currentVal > checkForlimit) {
        visitoCheck = false;
    } else {
        visitoCheck = true;
    }
    return visitoCheck;
}

//check for purchase limit of addon
function addonLimit(limit, count) {

    var currentcount = parseInt(count) + 1;
    if (parseInt(limit) == 0) {
        return true;
    } else if (parseInt(currentcount) > parseInt(limit)) {
        return false;
    } else {
        return true;
    }

}

function createAddonBlock(id) {
    var $newBlock =
        $("<div>").addClass("row s_visitor_summary s_addon_summary align-items-center ").attr("id", "s_addon_id_" + id)
            .append(
                $("<div>").addClass("col-xl-8 col-lg-8 col-md-8 col-8")
                    .append($("<div>").addClass("visitor_amt fw-400 mb-2").attr("id", "s_addon_total" + id))
            )
            .append(
                $("<div>").addClass("col-xl-4 col-lg-4 col-md-4 col-4 fw-400 text-end mt-2")
                    .append($("<div>").addClass("visitor_amt fw-400 justify-content-end mb-2").attr("id", "s_addon_total_amt" + id))
            );
    if ($('.s_addon_summary').length == 0) {
        $('.addon_pointer').after($newBlock);
        $('.addon_pointer').after('<hr class="addon-border-top"/>');

    } else {
        $('.s_addon_summary').after($newBlock);
    }
}

function parseTimeString(timeString) {
    var timeParts = timeString.split(" ");
    var time = timeParts[0];
    var meridiem = timeParts[1];

    var hoursMinutes = time.split(":");
    var hours = parseInt(hoursMinutes[0]);
    var minutes = parseInt(hoursMinutes[1]);

    if (meridiem === "PM" && hours !== 12) {
        hours += 12;
    }

    return new Date(0, 0, 0, hours, minutes);
}
//reset code
function resetFields(type) {

    if (type == 'date') {

        totalSummry['package'] = {};
        totalSummry['addon'] = 0;
        totalSummry['adult'] = 0;
        totalSummry['child'] = 0;
        totalSummry['addon_object'] = {};

        $('.s_date').text(bilingual.not_selected_lang);
        $('.s_date').addClass('notselected');
        details.api_selected_slot = ''
        details.api_selected_slot_timing = ''
        details.api_selected_package_id = 0
        $('.s_slot').text(bilingual.not_selected_lang);
        $(".s_slot").addClass('notselected');
        $('.slot_list').find('.selected-slot').removeClass('selected-slot');
        $('.adult_input').val(0);
        $('.child_input').val(0);
        $('.quantity__minus').addClass('disabled-decrement');
        $("input[name='quantity']").val(0);
        $(".s_visitors").text(bilingual.not_selected_lang);
        $(".s_visitors").addClass('notselected');
        $(".s_visitor_count").empty();
        $("#s_adult_total").empty();
        $("#s_adult_total_amt").empty();
        $("#s_child_total").empty();
        $("#s_child_total_amt").empty();
        $(".empty-date").empty();
        $(".empty-time").empty();
        $(".empty-visitor").empty();
        $('.package-tag').hide();
        $('.kid-free').hide();
        details.api_adult_number = 0;
        details.api_child_number = 0;
        $('.s_visitor_summary').hide();
        // $('.slot_list').empty();
        $('.s_addon_summary').remove();
        $('.addon-border-top').remove();
        $(".ticket_recommendation").hide();
        jQuery('.confirm-btn').attr("disabled", "disabled");
        jQuery('.cart-submit').attr("disabled", "disabled");
        jQuery('.cart-submit').show();
        jQuery('.next-btn').addClass('d-none');
        jQuery('#packages').addClass("in active show");
        if (details.packagesShow == 1) jQuery('#addons').removeClass("in active show");
        jQuery('.recommend_tabs li').find('a').removeClass('active');
        jQuery('.recommend_tabs li:first-child a').addClass('active');
        jQuery('#tandcbody_main').removeClass('d-none');
        jQuery('#tandcbody_other').addClass('d-none');
        // $('#addonTab').hide();
        // $('#addon_Elements').empty();
        details.addon_loaded = 0;
        details.api_selected_date = '';
        details.package_loaded = 0;
        $('#append_package').empty();
        sumOfGrand(14,totalSummry['adult'], totalSummry['child'], totalSummry['package'], totalSummry['addon']);
    } else if (type == 'slot') {
        totalSummry['package'] = {};
        totalSummry['addon'] = 0;
        totalSummry['adult'] = 0;
        totalSummry['child'] = 0;
        totalSummry['addon_object'] = {};
        $('.s_slot').text(bilingual.not_selected_lang);
        $(".s_slot").addClass('notselected');
        $('.slot_list').find('.selected-slot').removeClass('selected-slot');
        $('.adult_input').val(0);
        $('.child_input').val(0);
        $('.quantity__minus').addClass('disabled-decrement');
        $("input[name='quantity']").val(0);
        $(".s_visitors").text(bilingual.not_selected_lang);
        $(".s_visitors").addClass('notselected');
        $(".s_visitor_count").empty();
        $("#s_adult_total").empty();
        $("#s_adult_total_amt").empty();
        $("#s_child_total").empty();
        $("#s_child_total_amt").empty();
        $(".empty-time").empty();
        $(".empty-visitor").empty();
        $('.package-tag').hide();
        $('.kid-free').hide();
        details.api_adult_number = 0;
        details.api_child_number = 0;
        $('.s_visitor_summary').hide();
        $('.s_addon_summary').remove();
        $('.addon-border-top').remove();
        $(".ticket_recommendation").hide();
        details.api_selected_package_id = 0;
        details.addon_loaded = 0;
        jQuery('.confirm-btn').attr("disabled", "disabled");
        jQuery('.cart-submit').attr("disabled", "disabled");
        jQuery('.cart-submit').show();
        jQuery('.next-btn').addClass('d-none');
        jQuery('#packages').addClass("in active show");
        if (details.packagesShow == 1) jQuery('#addons').removeClass("in active show");
        jQuery('.recommend_tabs li').find('a').removeClass('active');
        jQuery('.recommend_tabs li:first-child a').addClass('active');
        jQuery('#tandcbody_main').removeClass('d-none');
        jQuery('#tandcbody_other').addClass('d-none');
        // $('#addonTab').hide();
        // $('#addon_Elements').empty();
        sumOfGrand(15,totalSummry['adult'], totalSummry['child'], totalSummry['package'], totalSummry['addon']);
    } else if (type == 'visitor') {
        $('.s_addon_summary').remove();
        $('.addon-border-top').remove();
        $(".ticket_recommendation").hide();
        totalSummry['package'] = {};
        totalSummry['addon'] = 0;
        details.api_selected_package_id = 0;
        totalSummry['addon_object'] = {};
        jQuery('.cart-submit').attr("disabled", "disabled");
        jQuery('.cart-submit').show();
        jQuery('.next-btn').addClass('d-none');
        jQuery('#packages').addClass("in active show");
        if (details.packagesShow == 1) jQuery('#addons').removeClass("in active show");
        jQuery('.recommend_tabs li').find('a').removeClass('active');
        jQuery('.recommend_tabs li:first-child a').addClass('active');
        $("input[name='addon_quantity']").val(0);
        $(".empty-visitor").empty();
        $('.package-tag').hide();
        $('.kid-free').hide();
        details.package_loaded = 0;
        $('#append_package').empty();
        $(".calendar_card:nth-child(2)").css({ 'pointer-events': 'all', 'opacity': '1' });
        jQuery('#tandcbody_main').removeClass('d-none');
        jQuery('#tandcbody_other').addClass('d-none');
        // $('#addonTab').hide();
        // $('#addon_Elements').empty();
    } else if (type == 'package') {
        $('.s_addon_summary').remove();
        $('.addon-border-top').remove();
        totalSummry['package'] = {};
        totalSummry['addon'] = 0;
        details.api_selected_package_id = 0;
        $("input[name='addon_quantity']").val(0);
        totalSummry['addon_object'] = {};
    } else if (type == 'visitor-for-zero') {
        if ($('.adult_input').val() == 0 && $('.child_input').val() == 0) {
            $('.adult_input').val(0);
            $("#s_adult_total").empty();
            $("#s_adult_total_amt").empty();
            details.api_adult_number = 0;
            details.api_child_number = 0;
            $('.child_input').val(0);
            $("#s_child_total").empty();
            $("#s_child_total_amt").empty();
            $(".s_visitors").text(bilingual.not_selected_lang);
            $(".s_visitors").addClass('notselected');
            $(".s_visitor_count").empty();
            $('.s_visitor_summary').hide();
            $(".ticket_recommendation").hide();
            $('.package-tag').hide();
            details.api_selected_package_id = 0;
            $("input[name='addon_quantity']").val(0);
            $(".empty-visitor").empty();
            jQuery('.confirm-btn').attr("disabled", "disabled");
            jQuery('.cart-submit').attr("disabled", "disabled");
            jQuery('.cart-submit').show();
            jQuery('.next-btn').addClass('d-none');
            jQuery('#packages').addClass("in active show");
            if (details.packagesShow == 1) jQuery('#addons').removeClass("in active show");
            jQuery('.recommend_tabs li').find('a').removeClass('active');
            jQuery('.recommend_tabs li:first-child a').addClass('active');
        }
        if ($('.adult_input').val() == 0 && $('.child_input').val() != 0  && details.api_type_adult == '1' && details.api_mendatory_adult == '1') {

            $('#button_click').val(0);
            jQuery('.confirm-btn').attr("disabled", "disabled");
            jQuery('.cart-submit').attr("disabled", "disabled");
            jQuery('.cart-submit').show();
            jQuery('.next-btn').addClass('d-none');
        }
    }
}
//check package exist
function packageExist() {

    if(totalSummry['package'].hasOwnProperty('s_pkg_list')){
        return 1;
    } else {
        return 0;
    }
}
function formatDate(date) {

    if (date != '') {

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    } else {
        return '';
    }
}

function formatDateTemp(originalDate, monthType) {

    if (originalDate != '') {

        var parts = originalDate.split('-');
        // Months array to convert numeric month to its name
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // Get the month name
        var monthName = months[parseInt(parts[1]) - 1];
        var monthName = monthType == 'half' ? monthName.substring(0, 3) : monthName;
        // Create the formatted date string
        var formattedDate = monthName + ' ' + parts[2] + ', ' + parts[0];
        return formattedDate;
    } else {
        return '';
    }
}
function sumOfGrand(num,amt1, amt2, amt3, amt4) {

    var sumTotal = parseFloat(amt1) + parseFloat(amt2) + parseFloat(0) + parseFloat(amt4);
    $('#s_total').text(details.currency + " " + sumTotal.toFixed(2));
    $('#s_grand_total').text(details.currency + " " + sumTotal.toFixed(2));
    details.api_grand_total = sumTotal.toFixed(2);

    // if (details.current_currency != 0) {

    //     var splitS = details.current_currency.split('-');
    //     var code = splitS[0];
    //     var rate = splitS[1];
    //     convertAmount(rate, code)
    // }
};
function activeStrips() {

    var activeListItem = $('.calendar_card.active');
    var nextListItem = activeListItem.next();
    jQuery(activeListItem).find('.collapse').collapse('hide');
    jQuery(activeListItem).removeClass('active');

    jQuery(nextListItem).find('.collapse').addClass('show');
    jQuery(nextListItem).addClass('active');
    jQuery(".calendar_card:eq(" + nextListItem.index() + ")").css({ 'pointer-events': 'all', 'opacity': '1' });

    if (tabIndex[nextListItem.index()] == 'time' && details.timeSlotsShow == 1) {

        var temp_selected_date = details.temp_selected_date;
        if (details.api_selected_date == '') {
            timeSlots(temp_selected_date);
        } else if (details.api_selected_date != formatDate(temp_selected_date)) {
            timeSlots(temp_selected_date);
        } else if (details.api_modify == 'true') {
            timeSlots(temp_selected_date);
        }

    } else {
        var temp_selected_date = details.temp_selected_date;
        details.api_selected_date = formatDate(temp_selected_date);
    }
    jQuery('.cart-submit').show();
    jQuery('.next-btn').addClass('d-none');
    editIcons();


}

//error alert
function editAlert(div, type) {

    jQuery("#edit_type").val(type);
    jQuery("#div_type").val(div);
    jQuery("#confirmmodal").modal('show');
}
//add the active class to current open div 
$(document).on('click', '.calendar_card', function () {
    $('.calendar_card').removeClass('active');
    $(this).addClass('active');

    editIcons();
});
//next btn for packages
$(document).on('click', '.next-btn', function () {
    
    jQuery('.cart-submit').show();
    jQuery(this).addClass('d-none');
    jQuery('#packageTab a').removeClass('active');
    jQuery('#addonTab a').addClass('active');
    jQuery('#packages').removeClass('active show');
    jQuery('#addons').addClass('active show');
    jQuery('#addonTab').show();

});
$(document).on('click', '#packageTab', function () {
    
    if(details.addonShow == '1') {
        jQuery('.cart-submit').hide();
        jQuery('.next-btn').show().removeClass('d-none');
        // jQuery('#addonTab').css({ 'display': 'none'});
    }

});
$(document).on('click', '#addonTab', function () {
    
    if(details.packagesShow == '1') {
        jQuery('.cart-submit').show();
        jQuery('.next-btn').addClass('d-none');
    }

});

//hide edit icons
function editIcons() {

    $("img.edit-img").each(function () {
        var closestSpan = $(this).prev("span");
        // Check if the <span> has text content
        if (closestSpan.text().trim().length > 0) {
            // Check if the parent <button> has the class "collapsed"
            if (closestSpan.closest(".calendar_card").css("pointer-events") === "none") {
                // Hide the <img> element
                $(this).hide();
            } else {
                $(this).show();
            }
        } else {
            $(this).hide();
        }
    });
}

//image name and text update
function updateforPackage() {

    var prevBtn = $('#packages').find(".selected_package").attr('id');
    if (prevBtn != undefined) {
        $('#' + prevBtn).text(bilingual.select_button_lang);
        $('.s_ticket_text').text(currentTicketName);
        $('#s_ticket_image').attr('src', currentImage);
        $('#packages').find(".selected_package").removeClass("selected_package btn-dark text-white")
        details.api_selected_package_id = 0
    }
}

//submit cart
$(document).on('click', '.cart-submit', function () {

    dataLayerCall();
    if (details.api_modify == 'true') {
        updateCart();
    } else {
        $('#tandcModal').modal('show');
    }
});

$(document).on('click', '.terms-check', function () {

    $('#tandcModal').modal('hide');
    if (details.api_modify == 'true') {
        updateCart();
    } else {
        adToCart();
    }
});

function dataLayerCall() {

    var addonsum = 0;
    $('input[name="addon_quantity"]').each(function() {
        var value = parseFloat($(this).val());
        if (!isNaN(value)) {
          addonsum += value;
        }
      });
    dataLayer.push({
        'event': 'add_to_cart',
        'ecommerce': {
          'currency': details.currency,
          'value': details.api_grand_total,
          'items': [{
             'item_id': details.api_ticket_id,
             'item_name': details.item_name,
             'price' : details.api_adult_price,
             'quantity' : '1',
             'item_brand' : details.item_brand,
             'item_category' : details.item_category,
             'booking_date':details.temp_selected_date,
             'booking_time':details.api_selected_slot_timing,
             'visitors':jQuery('.s_visitor_count').text(),
             'add_on_quantity': addonsum,
             'add_on_price': totalSummry['addon']
          }]
        }
    })
}

//Submit for cart
function adToCart() {

    if (details.api_booking_type == 'package') {
        var package_post_id = details.api_post_id;
    } else {
        var package_post_id = details.api_selected_package_id;
    }
    if(package_post_id > 0) {
        var package_meta = {};
        package_meta['timeslotid'] = totalSummry['package']['timeslotid'];
        package_meta['timeslot'] = totalSummry['package']['timeslot'];
    } else {
        var package_meta = '';
    }
    var site_url = details.site_url;
    // $('#main-loader').show();
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "set_local_cart",
            product_post_id: details.api_post_id,
            local_cart_id: '',
            remote_cart_id: '',
            adult_quantity: details.api_adult_number,
            child_quantity: details.api_child_number,
            date: details.api_selected_date,
            timeSlotId: details.api_selected_slot,
            timeslot: details.api_selected_slot_timing,
            startTimestamp: details.api_startTimestamp,
            endTimestamp: details.api_endTimestamp,
            package_post_id: package_post_id,
            package_meta : package_meta,
            addons: totalSummry['addon_object'],
            price_breakdown: "",
            lang: details.api_language,
        },
        success: function (response) {
            if (response.success == true) {
                $('.cart-submit').removeAttr("disabled");
                // $('#main-loader').hide();
                Swal.fire({
                    title: bilingual.succes_alert,
                    text: bilingual.saved_cart,
                    icon: 'success',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#CFA76D',
                }
                )
                window.location.href = details.cart_page_url;
            } else {
                // $('#main-loader').hide();
                errorAlert();
            }
        },
        error: function (request, status, error) {
            // $('#main-loader').hide();
            errorAlert();
        }
    });
}

//Update cart
function updateCart() {

    if (details.api_booking_type == 'package') {
        var package_post_id = details.api_post_id;
    } else {
        var package_post_id = details.api_selected_package_id;
    }
    if(package_post_id > 0) {
        var package_meta = {};
        package_meta['timeslotid'] = totalSummry['package']['timeslotid'];
        package_meta['timeslot'] = totalSummry['package']['timeslot'];
    } else {
        var package_meta = '';
    }
    var site_url = details.site_url;
    // $('#main-loader').show();
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: Aurl.ajaxurl,
        data: {
            nonce: Aurl.api_nonce,
            action: "emaar_modify_item",
            cart_item_id: details.api_cartId,
            product_post_id: details.api_post_id,
            local_cart_id: '',
            remote_cart_id: '',
            adult_quantity: details.api_adult_number,
            child_quantity: details.api_child_number,
            date: details.api_selected_date,
            timeSlotId: details.api_selected_slot,
            timeslot: details.api_selected_slot_timing,
            startTimestamp: details.api_startTimestamp,
            endTimestamp: details.api_endTimestamp,
            package_post_id: package_post_id,
            package_meta: package_meta,
            addons: totalSummry['addon_object'],
            price_breakdown: "",
            lang: details.api_language,
        },
        success: function (response) {
            if (response.success == true) {
                // $('#main-loader').hide();
                Swal.fire({
                    title: bilingual.succes_alert,
                    text: bilingual.saved_cart,
                    icon: 'success',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#CFA76D',
                }
                )
                window.location.href = details.cart_page_url;
            } else {
                errorAlert();
            }
        },
        error: function (request, status, error) {
            errorAlert();
        }
    });
}

function errorAlert() {

    // $('#main-loader').hide();
    $('#calendar-loader').hide();
    $('#errorAlert').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#errorAlert').modal('show');
}

// Show loader when an AJAX request starts
$(document).ajaxStart(function() {
    $("#main-loader").show();
});
  
// Hide loader when all AJAX requests have completed
$(document).ajaxStop(function() {
    $("#main-loader").hide();
});
  

window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && performance.getEntriesByType("navigation")[0].type === 2 );
    
    if ( historyTraversal ) {
        // Handle page restore.
        window.location.reload();
    }
});