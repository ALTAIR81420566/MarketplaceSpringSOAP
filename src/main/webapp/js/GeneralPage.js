$(document).ready(function () {
    jGeneral = {
        'initialize': function () {

            var wsUrl = "http://localhost:8090/ws";

            var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:generalRequest>\
                  <gs:findBy>All</gs:findBy>\
                </gs:generalRequest>\
               </soapenv:Body>\
           </soapenv:Envelope>';


            $.ajax({
                type: "POST",
                url: wsUrl,
                contentType: "text/xml",
                dataType: "xml",
                data: soapRequest,
                success: jGeneral.processSuccess,
                error: jGeneral.processError
            });

        },
        'processSuccess': function (data, status, req) {
            // $.cookie("login", $('#login').val());
            // window.location.href = '/general';
            // $(".errorText").text($(req.responseXML).find("response").text());
            $(req.responseXML).find("nodes").each(function () {
                    alert( $(this).find("title").text());
            });
        },
        'processError': function (data, status, req) {
            alert(req.responseText + " " + status);
        }
    };
    $('#myProd').on('click', function (e) {
        e.preventDefault();
        window.location.href = '/myProducts';
    });
    jGeneral.initialize();
//         $('#backBtn').on('click', function (e) {
//            e.preventDefault();
//            window.location.href='/general';
//         });
});
