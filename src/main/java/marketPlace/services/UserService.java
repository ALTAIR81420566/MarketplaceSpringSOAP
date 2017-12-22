package marketPlace.services;

import marketPlace.model.User;
import marketPlace.repositories.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepo repo;

    public UserService(UserRepo repo) {
        this.repo = repo;
    }

    public User getByLogin(String login) {
        User user = repo.findByLogin(login);
        return user;
    }
}
