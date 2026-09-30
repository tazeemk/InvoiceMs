package com.ims.user.service.impl;

import java.security.Key;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final String SECRET = "bZc1Nb3svTHTZ3ZJv2TID7U6Wk7X6Zftv38ZVG8GkXo=";

	public void validateToken(final String token) {
		Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
		Claims claims = claimsJws.getBody();

		// Extract standard or custom claims
		String username = claims.getSubject(); // "sub" claim
		// String role = claims.get("roles", String.class); // assuming you set "role"
		// while generating token
		System.out.println("Username: " + username);

	}

	public List<String> generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		// Extract roles and add to claims
		Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
		claims.put("roles", ((Stream<String>) authorities.stream().map(GrantedAuthority::getAuthority))
				.collect(Collectors.toList()));
		System.out.println("Roles going into token: " + claims.get("roles"));
		String token = createToken(claims, userDetails.getUsername());
		List<String> addtoken = new ArrayList<>();
		addtoken.add(token);
		List<String> roles = (List<String>) claims.get("roles");
		String rolesString = String.join(",", roles);
		addtoken.add(rolesString);
		return addtoken;
	}

	public String createToken(Map<String, Object> claims, String userName) {
		return Jwts.builder().setClaims(claims).setSubject(userName).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 100000 * 60 * 30)) // 30 mins
				.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
