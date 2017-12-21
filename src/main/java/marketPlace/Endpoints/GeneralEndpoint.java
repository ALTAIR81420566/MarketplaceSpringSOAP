package marketPlace.Endpoints;

import marketPlace.model.Bid;
import marketPlace.model.Product;
import marketPlace.services.BidService;
import marketPlace.services.ProductService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.GeneralRequest;
import soapmarketplace.GeneralResponse;
import soapmarketplace.ListOfNode;
import soapmarketplace.Node;

import java.util.List;

@Endpoint
public class GeneralEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    private final BidService bidService;
    private final ProductService productService;

    public GeneralEndpoint(BidService bidService, ProductService productService) {
        this.bidService = bidService;
        this.productService = productService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "generalRequest")
    @ResponsePayload
    public GeneralResponse getProducts(@RequestPayload GeneralRequest request) {
        GeneralResponse response = new GeneralResponse();
        ListOfNode listOfNode = new ListOfNode();
        List<Node> nodes = listOfNode.getNodes();

        if(request.getFindBy().equals("All")){
            Iterable<Product> products = productService.findAll();
            products.forEach(product -> {
                Bid bid = bidService.getBestBid(product.getuID());
                Node node =  new Node();
                node.setResponseBid(bidService.getResponse(bid));
                node.setResponseProduct(productService.getResponseProduct(product));
                nodes.add(node);
            });
        }

        response.setProducts(listOfNode);

        return response;
    }

}
