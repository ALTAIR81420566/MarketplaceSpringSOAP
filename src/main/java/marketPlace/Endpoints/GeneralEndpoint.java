package marketPlace.Endpoints;

import marketPlace.model.Bid;
import marketPlace.model.Product;
import marketPlace.model.User;
import marketPlace.services.BidService;
import marketPlace.services.ProductService;
import marketPlace.services.UserService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import soapmarketplace.*;

import java.util.HashMap;
import java.util.List;

@Endpoint
public class GeneralEndpoint {
    private static final String NAMESPACE_URI = "SOAPMarketplace";

    private final BidService bidService;
    private final ProductService productService;
    private final UserService userService;

    public GeneralEndpoint(BidService bidService, ProductService productService, UserService userService) {
        this.bidService = bidService;
        this.productService = productService;
        this.userService = userService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "generalRequest")
    @ResponsePayload
    public GeneralResponse getProducts(@RequestPayload GeneralRequest request) {
        GeneralResponse response = new GeneralResponse();
        ListOfNode listOfNode = new ListOfNode();
        List<Node> nodes = listOfNode.getNodes();

        if (request.getFindBy().equals("All")) {
            Iterable<Product> products = productService.findAll();
            makeProducts(nodes,products);
        }else if (request.getFindBy().equals("Title")) {
            Iterable<Product> products = productService.findByTitle(request.getSearchStr());
            makeProducts(nodes,products);
        }else if (request.getFindBy().equals("Description")) {
            Iterable<Product> products = productService.findByDescription(request.getSearchStr());
            makeProducts(nodes,products);
        }else if(request.getFindBy().equals("uId")){
            Product product =  productService.findByuId(request.getSearchStr());
            Bid bid = bidService.getBestBid(product.getuID());
            Node node = new Node();
            node.setResponseBid(bidService.getResponse(bid));
            node.setResponseProduct(productService.getResponseProduct(product));
            nodes.add(node);
        }

        response.setProducts(listOfNode);

        return response;
    }
    private  List<Node> makeProducts( List<Node> nodes, Iterable<Product> products) {
        products.forEach(product -> {
            Bid bid = bidService.getBestBid(product.getuID());
            Node node = new Node();
            node.setResponseBid(bidService.getResponse(bid));
            node.setResponseProduct(productService.getResponseProduct(product));
            nodes.add(node);
        });
        return nodes;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "buyBidRequest")
    @ResponsePayload
    public void buyProduct(@RequestPayload BuyBidRequest request) {
        Product product = productService.findById(request.getProductId());
        product.setSold(1);
        productService.save(product);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "bidRequest")
    @ResponsePayload
    public BidResponse makeBid(@RequestPayload BidRequest request) {
        BidResponse bidResponse = new BidResponse();
        Product product = productService.findById(request.getProductId());
        Bid bid = bidService.getBestBid(product.getuID());
        User user = userService.getByLogin(request.getLogin());
        long diff = 0;
        if (bid != null) {
            diff = (long) (request.getCount() - bid.getCount());
        } else {
            diff = (long) (request.getCount() - product.getStartPrice());
        }
        if (diff > product.getStep()) {
            bidService.saveRequest(request, user.getId());
            bidResponse.setStatus("OK");
        } else {
            bidResponse.setStatus("ERR");
        }


        return bidResponse;
    }

}
