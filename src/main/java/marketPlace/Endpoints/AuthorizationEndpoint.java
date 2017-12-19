package marketPlace.Endpoints;

import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.AuthorizationRequest;
import soapmarketplace.AuthorizationResponse;


public class AuthorizationEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "authorization")
    @ResponsePayload
    public AuthorizationResponse getCountry(@RequestPayload AuthorizationRequest request) {
        AuthorizationResponse response = new AuthorizationResponse();

        return response;
    }

}

