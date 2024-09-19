// package com.example.ecommerce.controller;

// import com.example.ecommerce.model.User;
// import com.example.ecommerce.model.LoginRequest;
// import com.example.ecommerce.service.UserService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map; // Import Map here

// @RestController
// @RequestMapping("/api")
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @PostMapping("/register")
//     public ResponseEntity<?> registerUser(@RequestBody User user) {
//         boolean isRegistered = userService.register(user);
//         if (isRegistered) {
//             return ResponseEntity.ok(Map.of("success", true));
//         } else {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("success", false, "message", "Registration failed"));
//         }
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
//         User authenticatedUser = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

//         if (authenticatedUser != null) {
//             // Return the username along with the success status
//             return ResponseEntity.ok(Map.of("success", true, "username", authenticatedUser.getUsername()));
//         } else {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("success", false, "message", "Invalid credentials"));
//         }
//     }

// }
package com.example.ecommerce.controller;

import com.example.ecommerce.model.User;
import com.example.ecommerce.model.LoginRequest;
import com.example.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        boolean isRegistered = userService.register(user);
        if (isRegistered) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Registration failed"));
        }
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User authenticatedUser = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (authenticatedUser != null) {
            // Return the username along with the success status
            return ResponseEntity.ok(Map.of("success", true, "username", authenticatedUser.getUsername(), "userid",
                    authenticatedUser.getId()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }

    // User profile endpoint
    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile() {
        // Fetch the user profile based on the logged-in user
        String loggedInUserEmail = getLoggedInUserEmail();
        User user = userService.findByEmail(loggedInUserEmail);

        if (user != null) {
            return ResponseEntity.ok(Map.of("success", true, "username", user.getUsername()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
        }
    }

    // Placeholder for retrieving the logged-in user's email
    private String getLoggedInUserEmail() {
        return "johnpaulreju2k@gmail.com"; // Replace this with your actual logic
    }
}
