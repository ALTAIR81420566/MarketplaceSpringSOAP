$(document).ready(function () {
    jVal = {
        'size': function (ele, info, s) {
            var pos = ele.offset();
            info.css({
                top: pos.top - 3,
                left: pos.left + ele.width() + 15
            });
            if (ele.val().length < s) {
                jVal.errors = true;
                info.removeClass('correct').addClass('error').html('← at least ' + s + ' characters').show();
                ele.removeClass('normal').addClass('wrong');
                return false;
            } else {
                info.removeClass('error').addClass('correct').html('√').show();
                ele.removeClass('wrong').addClass('normal');
                return true;
            }
        },
        'password': function () {
            $('body').append('<div id="passwordInfo" class="info"></div>');
            var passwordInfo = $('#passwordInfo');
            var ele = $('#password');
            return jVal.size(ele, passwordInfo, 6);
        },
        'rePassword': function () {
            $('body').append('<div id="rePasswordInfo" class="info"></div>');
            var info = $('#rePasswordInfo');
            var ele = $('#rePassword');
            var password = $('#password');
            var pos = ele.offset();
            info.css({
                top: pos.top - 3,
                left: pos.left + ele.width() + 15
            });
            if (ele.val() != password.val()) {
                jVal.errors = true;
                info.removeClass('correct').addClass('error').html('← Passwords do not match').show();
                ele.removeClass('normal').addClass('wrong');
                return false;
            } else {
                info.removeClass('error').addClass('correct').html('√').show();
                ele.removeClass('wrong').addClass('normal');
                return true;
            }
        },
        'login': function () {
            $('body').append('<div id="loginInfo" class="info"></div>');
            var info = $('#loginInfo');
            var ele = $('#login');
            var name = $('#fullName');
            var pos = ele.offset();
            info.css({
                top: pos.top - 3,
                left: pos.left + ele.width() + 15
            });
            if (ele.val().length < 6) {
                jVal.errors = true;
                info.removeClass('correct').addClass('error').html('← at least 6 characters').show();
                ele.removeClass('normal').addClass('wrong');
                return false;
            } else if (ele.val() == name.val()) {
                jVal.errors = true;
                info.removeClass('correct').addClass('error').html('← must not be the same as the full name').show();
                ele.removeClass('normal').addClass('wrong');
                return false;
            } else {
                info.removeClass('error').addClass('correct').html('√').show();
                ele.removeClass('wrong').addClass('normal');
                return true;
            }
        },
        'address': function () {
            $('body').append('<div id="addressInfo" class="info"></div>');
            var addressInfo = $('#addressInfo');
            var ele = $('#address');
            return jVal.size(ele, addressInfo, 1);
        },
        'fullName': function () {
            $('body').append('<div id="nameInfo" class="info"></div>');
            var nameInfo = $('#nameInfo');
            var ele = $('#fullName');
            var s = 1;
            return jVal.size(ele, nameInfo, 1);
        },
        'processSuccess': function (data, status, req) {
            var response = $(req.responseXML).find("response").text();
            if (response == "OK") {
                window.location.href = '/';
            } else {
                $(".errorText").text("User with this login already exist");
            }
        },
        'processError': function (data, status, req) {
            $('.errorText').text("errorErrr");
            alert(req.responseText + " " + status);
        }


    }

    $('#address').change(jVal.address);
    $('#fullName').change(jVal.fullName);
    $('#login').change(jVal.login);
    $('#password').change(jVal.password);
    $('#rePassword').change(jVal.rePassword);

    $('#register').on('click', function (e) {
        e.preventDefault();
        if (jVal.login() && jVal.password() && jVal.fullName()
            && jVal.address() && jVal.rePassword()) {


            var wsUrl = "http://localhost:8090/ws";


            var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:registerRequest>\
                  <gs:name>' + $('#fullName').val() + '</gs:name>\
                  <gs:billingAddress>' + $('#address').val() + '</gs:billingAddress>\
                  <gs:login>' + $('#login').val() + '</gs:login>\
                  <gs:password>' + $('#password').val() + '</gs:password>\
                </gs:registerRequest>\
               </soapenv:Body>\
           </soapenv:Envelope>';

            $.ajax({
                type: "POST",
                url: wsUrl,
                contentType: "text/xml",
                dataType: "xml",
                data: soapRequest,
                success: jVal.processSuccess,
                error: jVal.processError
            });

        }

    })
});