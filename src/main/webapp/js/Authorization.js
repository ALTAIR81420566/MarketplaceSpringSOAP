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
        'processSuccess': function (data, status, req) {
            var response = $(req.responseXML).find("response").text();
            if(response == "success"){
                $.cookie("login", $('#login').val());
                $.cookie("role", "USER");
                window.location.href = '/general';
            }else{
                $(".errorText").text($(req.responseXML).find("response").text());
            }
        },
        'processError': function (data, status, req) {
            $('.errorText').text("errorErrr");
            alert(req.responseText + " dd" + status);
        }
    };
    $('#login').change(jVal.login);
    $('#password').change(jVal.password);
    $('#onRegisterPage').on('click', function (e) {
        e.preventDefault();
        $('#soap').text("ok");
    });

    $('#guestBtn').on('click', function (e) {
        e.preventDefault();
        $.cookie("login", "guest");
        $.cookie("role", "GUEST");
        window.location.href = "/general"
    });

    $('#signInBtn').on('click', function (e) {
        e.preventDefault();
        var wsUrl = "http://localhost:8090/ws";

        var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:authorizationRequest>\
                  <gs:login>' + $('#login').val() +'</gs:login>\
                  <gs:password>' + $('#password').val() + '</gs:password>\
                </gs:authorizationRequest>\
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
    });
    $.cookie("login", null);
    $.cookie("role", "GUEST");
});

