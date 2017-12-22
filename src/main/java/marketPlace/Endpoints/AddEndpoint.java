package marketPlace.Endpoints;


import marketPlace.model.Product;
import marketPlace.model.User;
import marketPlace.services.ProductService;
import marketPlace.services.UserService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.AddProductRequest;

@Endpoint
public class AddEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";
    private final ProductService productService;
    private final UserService userService;

    public AddEndpoint(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addProductRequest")
    @ResponsePayload
    public void addProduct(@RequestPayload AddProductRequest request) {
        User user =  userService.getByLogin(request.getLogin());
        Product product = new Product();
        product.setStartPrice(request.getStartPrice());
        product.setDescription(request.getDescription());
        product.setTitle(request.getTitle());
        product.setIsBuyNow(request.getBuyItNow());
        product.setSellerID(user.getId());
        product.setStep(request.getStep());
        product.setTime(request.getTime() * 60 * 60 * 1000);
        productService.save(product);

    }
}
