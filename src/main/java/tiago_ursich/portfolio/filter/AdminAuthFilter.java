package tiago_ursich.portfolio.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AdminAuthFilter extends OncePerRequestFilter {

    private final String adminPassword;

    public AdminAuthFilter(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String method = request.getMethod();
        String path = request.getRequestURI();

        boolean isProtected = path.startsWith("/api/projetos")
            && !method.equalsIgnoreCase("GET")
            && !method.equalsIgnoreCase("OPTIONS");

        if (isProtected) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.equals("Bearer " + adminPassword)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Não autorizado\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
