package com.financialtracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.servers.Server;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Financial Tracking System API",
        version = "1.0.0",
        description = "Complete REST API for managing personal finances including accounts, transactions, budgets, and categories",
        contact = @Contact(
            name = "Financial Tracking Team"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Development Server"),
        @Server(url = "http://localhost:8080/api", description = "API Base Path")
    }
)
public class FinancialTrackingApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinancialTrackingApplication.class, args);
    }
}
