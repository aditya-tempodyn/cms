package com.contentpublishing.service;

import com.contentpublishing.dto.JwtResponse;
import com.contentpublishing.dto.LoginRequest;
import com.contentpublishing.dto.RegisterRequest;
import com.contentpublishing.entity.User;
import com.contentpublishing.repository.UserRepository;
import com.contentpublishing.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public JwtResponse login(LoginRequest loginRequest) {
        try {
            logger.info("Attempting login for user: {}", loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User userPrincipal = (User) authentication.getPrincipal();
            
            // Update last login time
            userPrincipal.setLastLogin(LocalDateTime.now());
            userRepository.save(userPrincipal);
            
            String jwt = jwtUtil.generateToken(userPrincipal);
            
            List<String> roles = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .toList();
            
            logger.info("User {} logged in successfully", loginRequest.getUsername());
            
            return new JwtResponse(jwt,
                                 userPrincipal.getId(),
                                 userPrincipal.getUsername(),
                                 userPrincipal.getEmail(),
                                 roles);
                                 
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new RuntimeException("Invalid username or password", e);
        }
    }
    
    public String register(RegisterRequest registerRequest) {
        try {
            logger.info("Attempting registration for user: {}", registerRequest.getUsername());
            
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                logger.warn("Registration failed: Username {} already exists", registerRequest.getUsername());
                throw new RuntimeException("Error: Username is already taken!");
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                logger.warn("Registration failed: Email {} already exists", registerRequest.getEmail());
                throw new RuntimeException("Error: Email is already in use!");
            }
            
            // Create new user
            User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFirstName(),
                registerRequest.getLastName()
            );
            
            if (registerRequest.getPhoneNumber() != null && !registerRequest.getPhoneNumber().trim().isEmpty()) {
                user.setPhoneNumber(registerRequest.getPhoneNumber());
            }
            
            userRepository.save(user);
            
            logger.info("User {} registered successfully", registerRequest.getUsername());
            return "User registered successfully!";
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
    
    public String logout() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                String username = authentication.getName();
                logger.info("User {} logged out successfully", username);
                SecurityContextHolder.clearContext();
                return "Logout successful";
            }
            return "No user logged in";
        } catch (Exception e) {
            logger.error("Logout failed", e);
            throw new RuntimeException("Logout failed", e);
        }
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }
} 