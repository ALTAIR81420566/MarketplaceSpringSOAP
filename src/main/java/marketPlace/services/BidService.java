package marketPlace.services;

import marketPlace.model.Bid;
import marketPlace.repositories.BidRepo;
import org.springframework.stereotype.Service;
import soapmarketplace.ResponseBid;

@Service
public class BidService {

    private final BidRepo bidRepo;

    public BidService(BidRepo bidRepo) {
        this.bidRepo = bidRepo;
    }

    public ResponseBid getResponse(Bid bid){
        ResponseBid responseBid = null;
        if(bid != null) {
            responseBid = new ResponseBid();
            responseBid.setCount(bid.getCount());
            responseBid.setId(bid.getId().toString());
            responseBid.setProductId(bid.getProductId());
            responseBid.setUserId(bid.getUserId());
        }
        return responseBid;
    }

    public Bid getBestBid(Long aLong) {
        return bidRepo.getBestBid(aLong);
    }
}
