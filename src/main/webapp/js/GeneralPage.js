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
                    appendStr = appendStr + '<td>SOLD</td></tr>';
                } else if (stopDate.getTime() < Date.now()) {
                    appendStr = appendStr + '<td>Time is over</td></tr>';
                } else if (Number($(this).find("buyNow").text()) == 1) {
                    appendStr = appendStr + '<td><button id="buyNowBtn" type ="submit"  class="buyNow">Buy now</button></td></tr>';
                } else {
                    appendStr = appendStr + '<td><input maxlength="10" size="5" type="number" class="count">' +
                        ' <button type ="submit" class="bid">Bid</button></td></tr>'
                }

                $('#productTable').append(appendStr);
            });

            $('.buyNow').on('click', function () {
                var wsUrl = "http://localhost:8090/ws";

                var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                             				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:buyBidRequest>\
                  <gs:productId>' + Number($(this).parent().parent().find("td:eq(0)").text()) + '</gs:productId>\
                </gs:buyBidRequest>\
               </soapenv:Body>\
           </soapenv:Envelope>';


                $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest,
                });

                $(this).parent().parent().append("<td>SOLD</td>");
                $(this).parent().remove();
            });

            $('.bid').on('click', function () {
                var wsUrl = "http://localhost:8090/ws";
                var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                                     				  xmlns:gs="SOAPMarketplace">\
            <soapenv:Header/>\
              <soapenv:Body>\
                <gs:bidRequest>\
                  <gs:productId>' + Number($(this).parent().parent().find("td:eq(0)").text()) + '</gs:productId>\
                  <gs:login>' + $.cookie("login") + '</gs:login>\
                  <gs:count>' + Number($(this).parent().parent().find("td:eq(9)").find("input:eq(0)").val()) + '</gs:count>\
                </gs:bidRequest>\
               </soapenv:Body>\
           </soapenv:Envelope>';


                $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest,
                    success: jGeneral.bidSuccess
                });
                bidBtn = $(this).parent().parent().find("td:eq(7)");
                count = $(this).parent().parent().find("td:eq(9)").find("input:eq(0)").val();
                // $(this).parent().parent().append("<td>SOLD</td>");
                // $(this).parent().remove();
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
