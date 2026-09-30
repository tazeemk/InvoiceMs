package com.ims.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ims.dto.DaoAuthRequest;
import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.user.bean.ForgetPasswordBean;
import com.ims.user.bean.UserBean;
import com.ims.user.service.UserService;
import com.ims.user.service.impl.UserServiceImpl;
//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserServiceImpl userserviceimpl;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @PostMapping("/newAndUpdateUser")
    public ResponseEntity<?> newAndUpdateUser(@RequestBody UserBean user) {
      try {
    	UserBean user2 = userService.createUser(user);
          return ResponseEntity.ok(user2);
      }catch(Exception e) {
    	  return ResponseEntity.badRequest().body(e.getMessage());
      }
      }

    
    @PostMapping("/token")
    public List<String> getToken(@RequestBody DaoAuthRequest authReq) {
    	Authentication authentication =authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authReq.getUsername(), authReq.getPassword()));
    	if(authentication.isAuthenticated()){
    		
    		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    		List<String> token = userserviceimpl.generateToken(userDetails);
    		return token;
    	}else {
    		throw new IllegalArgumentException(" Invalid User :");
    	}
    	
    }
    
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
    	 userserviceimpl.validateToken(token);
    	 return "Token is Valid :";
    }
    
    @GetMapping("/getAllUsers")
    public List<UserBean> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/getUser/{id}")
    public UserBean getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    
    @PostMapping("/filterUsers")
    public ResponseEntity<List<UserBean>> filterUsers(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; // default to 100
            List<UserBean> filter = userService.filterUser(request.getFilters(), limit);
            return ResponseEntity.ok(filter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    @DeleteMapping("/deleteUser/{userId}")
    public void deleteUser(@PathVariable String userId) 
    {
    try {
    	   userService.deleteUser(userId);
    }catch(Exception e) {
    	throw new IllegalArgumentException(e.getMessage());
    }
    }
    
    @PutMapping("/updateStatusActiveInactive/{id}")
    public void changeStatusToInactive(@PathVariable String id) 
    {
    	try {
    		userService.changeUserStatusToInactive(id);
    	}catch(Exception e) {
    		throw new IllegalArgumentException(e.getMessage());
    	}
    }
    
    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetUserPassword(@RequestBody ForgetPasswordBean forgetBeanPassword) {
    	try {
    		   String result=  userService.resetUserPassword(forgetBeanPassword);
    		return ResponseEntity.ok(result);
    	}catch(Exception e) {
    		return ResponseEntity.internalServerError().body(e.getMessage());
    	}
    }
}
