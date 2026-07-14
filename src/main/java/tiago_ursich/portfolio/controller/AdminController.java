package tiago_ursich.portfolio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        if (adminPassword.equals(request.password())) {
            return ResponseEntity.ok(Map.of("token", adminPassword, "ok", true));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Senha incorreta", "ok", false));
    }

    record LoginRequest(String password) {}
}
