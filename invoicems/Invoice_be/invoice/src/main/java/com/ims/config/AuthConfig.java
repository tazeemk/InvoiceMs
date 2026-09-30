package com.ims.config;

import com.ims.config.CustomDetailsService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomDetailsService(); // Make sure this class implements UserDetailsService
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers(
                	    "/users/token", "/users/resetPassword", "/product/**",
                	    "/users/validate", "/users/getAllUsers", "/users/**",
                	    "/users/createUser", "/customers/**", "/customerLedger/**",
                	    "/collections/**", "/collectionAssignment/**", "/category/**",
                	    "/invoices/**", "/invoiceItems/**", "/order/**",
                	    "/api/reports/receipts/**",
                	    "/receipts/**", "/actuator/health", "/actuator/info"
                	).permitAll()
                .anyRequest().authenticated()
                .and()
                .authenticationProvider(authenticationProvider())
                .exceptionHandling()
                .accessDeniedHandler((req, res, ex) -> {
                    ex.printStackTrace(); // Log reason
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: " + ex.getMessage());
                })
                .and()
                .build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
