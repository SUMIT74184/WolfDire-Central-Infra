package org.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.cloud.client.discovery.EnableDiscoveryClient
@org.springframework.cloud.openfeign.EnableFeignClients
public class FeedSvcApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeedSvcApplication.class, args);
    }

}
