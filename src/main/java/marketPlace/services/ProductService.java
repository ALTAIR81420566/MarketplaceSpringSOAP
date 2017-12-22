package marketPlace.services;

import marketPlace.model.Product;
import marketPlace.repositories.ProductRepo;
import org.springframework.stereotype.Service;
import soapmarketplace.ResponseProduct;

@Service
public class ProductService {

    private final ProductRepo productRepo;

    public ProductService(ProductRepo productService) {
        this.productRepo = productService;
    }

    public Iterable<Product> findAll() {
        return productRepo.findAll();
    }

    public ResponseProduct getResponseProduct(Product product) {
        ResponseProduct responseProduct =  new ResponseProduct();
        responseProduct.setUID(product.getuID().toString());
        responseProduct.setBuyNow(product.getBuyNow());
        responseProduct.setDescription(product.getDescription());
        responseProduct.setSellerID(product.getSellerID());
        responseProduct.setSold(product.getSold());
        responseProduct.setStartBiddingDate(product.getStartBiddingDate());
        responseProduct.setStartPrice(product.getStartPrice());
        responseProduct.setStep((int) product.getStep());
        responseProduct.setTime(product.getTime());
        responseProduct.setTitle(product.getTitle());
        return responseProduct;
    }

    public Product findById(long productId) {
        Product product = productRepo.findByuID(productId);
        return product;
    }

    public void save(Product product) {
        productRepo.save(product);
    }
}
