package marketPlace.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfig  extends WebMvcConfigurerAdapter {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/authorization").setViewName("Authorization");
        registry.addViewController("/").setViewName("Authorization");
        registry.addViewController("/general").setViewName("General");
        registry.addViewController("/add").setViewName("Adding");
        registry.addViewController("/registration").setViewName("Registration");
        registry.addViewController("/myproducts").setViewName("MyProducts");
    }
}
