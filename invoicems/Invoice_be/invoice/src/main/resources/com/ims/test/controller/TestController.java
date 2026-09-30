package com.ims.Test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/userService")
public class TestController {

    @GetMapping("userService")
    public Map<String, String> showMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("msg", "user-Service is working!");
        return response;
    }
}
