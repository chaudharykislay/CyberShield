package com.cybershield.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cyberShieldOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CyberShield Enterprise Security Analytics API")
                        .description("REST API and algorithmic engine for threat intelligence, string pattern matching, suffix structures, dynamic programming, network flow, NP-completeness reductions, and randomized analytics.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("CyberShield Security Engineering Team")
                                .email("security-eng@cybershield.enterprise"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
