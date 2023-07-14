package purdue.cs407.backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    /**
     * Key to encode JWT with
     */
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    /**
     * Extract username from JWT token
     * @param token token to extract from
     * @return String username or throws an error
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract a claim from a token
     * @param token - Token with which to extract from
     * @param claimsResolver - resolver
     * @return - claim
     * @param <T> - Subject
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate a token from a user and remember me?
     * @param userDetails - User to generate token from
     * @param rememberMe - Boolean specifying remember me token, (1 week exp)
     * @return - String JWT token
     */
    public String generateToken(UserDetails userDetails, boolean rememberMe) {
        return generateToken(new HashMap<>(), userDetails, rememberMe);
    }
    public String generateToken(Map<String, Object> extraClaims,
                                UserDetails userDetails, boolean rememberMe) {
        long time = 1000 * 60 * 60 * 4; // 4hrs
        if (rememberMe) {
            time *= 42; // 1 Week
        }
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration((new Date(System.currentTimeMillis() + time)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Verify if a token is valid.
     * @param token - Token to check.
     * @param userDetails - User to check token against.
     * @return - Boolean true if valid, false otherwise.
     */
    public Boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Verify if a token is expired.
     * @param token - Token to check.
     * @return - Boolean true if expired, false otherwise.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date(System.currentTimeMillis()));
    }

    /**
     * Get expiration date from a token
     * @param token - Token to get date from.
     * @return - Date expiration date.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Get the key for signing in.
     * @return - Key key.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
