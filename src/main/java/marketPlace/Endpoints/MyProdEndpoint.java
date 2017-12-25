package marketPlace.Endpoints;

import marketPlace.model.Bid;
import marketPlace.model.Product;
import marketPlace.services.BidService;
import marketPlace.services.ProductService;
import marketPlace.services.UserService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.*;

import java.util.List;

@Endpoint
public class MyProdEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    private final BidService bidService;
    private final ProductService productService;
    private final UserService userService;

    public MyProdEndpoint(BidService bidService, ProductService productService, UserService userService) {
        this.bidService = bidService;
        this.productService = productService;
        this.userService = userService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "myProductsRequest")
    @ResponsePayload
    public GeneralResponse getProducts(@RequestPayload MyProductsRequest request) {
        GeneralResponse response = new GeneralResponse();
        ListOfNode listOfNode = new ListOfNode();
        List<Node> nodes = listOfNode.getNodes();


        Iterable<Product> products = productService.findByLogin(request.getLogin());
        products.forEach(product -> {
            Bid bid = bidService.getBestBid(product.getuID());
            Node node = new Node();
            node.setResponseBid(bidService.getResponse(bid));
            node.setResponseProduct(productService.getResponseProduct(product));
            nodes.add(node);
        });


        response.setProducts(listOfNode);

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteProdRequest")
    @ResponsePayload
    public void deleteProduct(@RequestPayload DeleteProdRequest request) {
        productService.delete(Long.parseLong(request.getProductId()));
    }
}
