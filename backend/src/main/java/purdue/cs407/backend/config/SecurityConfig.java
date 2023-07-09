package purdue.cs407.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import purdue.cs407.backend.filters.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }


    /** Setup Filter Chain to restrict/allow endpoints */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http    //TODO update to use SSL https authorizeChannel()
                .csrf(AbstractHttpConfigurer::disable) // CSRF - cross site request forgery disabled for now TODO enable properly
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/account/auth/**").permitAll() // Making these endpoints public
                        .requestMatchers("/api/reminder/cancel_reminder/**").permitAll()
                        .requestMatchers("/").permitAll() // Think this is needed for CORS preflight?
                        .anyRequest().authenticated())     // Lock all other endpoints
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //No state
                .authenticationProvider(authenticationProvider)
                //.httpBasic(Customizer.withDefaults()) //Not necessary with JWT implementation

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Insert JWT filter before authent filter

        return http.build();

    }


}
