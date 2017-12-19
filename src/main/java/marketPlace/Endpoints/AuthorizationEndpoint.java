package marketPlace.Endpoints;

import marketPlace.model.User;
import marketPlace.repositories.UserRepo;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.AuthorizationRequest;
import soapmarketplace.AuthorizationResponse;

@Endpoint
public class AuthorizationEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    private final UserRepo userRepo;

    public AuthorizationEndpoint(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "authorizationRequest")
    @ResponsePayload
    public AuthorizationResponse authorization(@RequestPayload AuthorizationRequest request) {
        AuthorizationResponse response = new AuthorizationResponse();
        String d = request.getLogin();
        User user = userRepo.findByLogin(request.getLogin());
        if (user != null && user.getPassword().equals(request.getPassword())){
            response.setResponse("success");
        }else{
            response.setResponse("error");
        }
        return response;
    }

}

