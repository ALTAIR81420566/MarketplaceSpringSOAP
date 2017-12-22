package marketPlace.Endpoints;

import marketPlace.model.User;
import marketPlace.services.UserService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.*;

@Endpoint
public class RegisterEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    private final UserService userService;

    public RegisterEndpoint(UserService userService) {
        this.userService = userService;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "registerRequest")
    @ResponsePayload
    public RegisterResponse registerRequest(@RequestPayload RegisterRequest request) {
        RegisterResponse response = new RegisterResponse();
        User user = userService.getByLogin(request.getLogin());
        if(user == null){
            user = new User();
            user.setBillingAddress(request.getBillingAddress());
            user.setPassword(request.getPassword());
            user.setLogin(request.getLogin());
            user.setName(request.getName());
            user.setRole("USER");

            userService.save(user);
            response.setResponse("OK");
        }else{
            response.setResponse("ERR");
        }

        return response;
    }
}
