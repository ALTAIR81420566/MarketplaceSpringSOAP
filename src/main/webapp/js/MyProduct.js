$(document).ready(function () {
    var bidBtn;
    var count;
    jGeneral = {

        'initialize': function () {


            var wsUrl = "http://localhost:8090/ws";

            var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:myProductsRequest>\
                  <gs:login>'+$.cookie("login")+'</gs:login>\
                </gs:myProductsRequest>\
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
        'bidSuccess': function (data, status, req) {
            var status = $(req.responseXML).find("status").text();
            if(status == "OK"){
                bidBtn.text(count);
            }
        },
        'processSuccess': function (data, status, req) {
            $(req.responseXML).find("nodes").each(function () {

                Date.prototype.format = function (mask, utc) {
                    return dateFormat(this, mask, utc);
                };


                var stopDate = new Date(Number($(this).find("startBiddingDate").text()) + Number($(this).find("time").text()));
                var appendStr = '<tr><td>' + $(this).find("uID").text() + '</td>' +
                    '<td>' + $(this).find("title").text() + '</td>' +
                    '<td>' + $(this).find("description").text() + '</td>' +
                    '<td>' + $(this).find("sellerID").text() + '</td>' +
                    '<td>' + $(this).find("startPrice").text() + '</td>' +
                    '<td>' + $(this).find("step").text() + '</td>' +
                    '<td>' + stopDate.format("yyyy.dd.mm  HH:MM:ss") + '</td>' +
                    '<td>' + $(this).find("count").text() + '</td>' +
                    '<td>' + $(this).find("userId").text() + '</td>';

                if (Number($(this).find("sold").text()) == 1) {
                    appendStr = appendStr + '<td>SOLD  <button class="delete">Delete</button></td></tr>';
                } else if (stopDate.getTime() < Date.now()) {
                    appendStr = appendStr + '<td>Time is over  <button class="delete">Delete</button></td></tr>';
                } else{
                    appendStr = appendStr + '<td><button class="edit">Edit</button>  <button class="delete">Delete</button></td></tr>';
                }

                $('#productTable').append(appendStr);
            });

            $('.delete').on('click', function () {
                var wsUrl = "http://localhost:8090/ws";

                var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:deleteProdRequest>\
                  <gs:productId>' + Number($(this).parent().parent().find("td:eq(0)").text()) + '</gs:productId>\
                </gs:deleteProdRequest>\
               </soapenv:Body>\
           </soapenv:Envelope>';


                $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest,
                });

                 $(this).parent().parent().remove();
            });

            $('.edit').on('click', function () {
                $.cookie("editID",Number($(this).parent().parent().find("td:eq(0)").text()));
                window.location.href = '/add';
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

    $('#userLogin').text($.cookie("login"));


});
