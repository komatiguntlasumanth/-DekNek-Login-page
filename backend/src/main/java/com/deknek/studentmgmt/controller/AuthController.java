package com.deknek.studentmgmt.controller;

import com.deknek.studentmgmt.dto.AuthRequest;
import com.deknek.studentmgmt.dto.AuthResponse;
import com.deknek.studentmgmt.model.User;
import com.deknek.studentmgmt.repository.UserRepository;
import com.deknek.studentmgmt.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authenticationRequest) throws Exception {
        String email = authenticationRequest.getEmail().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                email, authenticationRequest.getPassword()));

        final String token = jwtTokenUtil.generateToken(userDetailsService.loadUserByUsername(email));
        
        User user = userRepository.findByEmail(email).get();

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> saveUser(@RequestBody AuthRequest userDto) {
        String email = userDto.getEmail().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        User newUser = new User();
        newUser.setUsername(userDto.getUsername());
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setRole("ROLE_USER");
        
        userRepository.save(newUser);
        
        // Use email for loadUserByUsername since it's the identifier now
        final UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(token, newUser.getUsername(), newUser.getRole()));
    }
}
