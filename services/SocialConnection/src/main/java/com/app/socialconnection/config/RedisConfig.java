package com.app.socialconnection.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * 🎓 LEARNING: Redis Configuration
 *
 * Redis is an in-memory key-value store. In this service, it's used for:
 * - Caching connection stats (so we don't hit PostgreSQL on every request)
 * - Caching community member counts
 * - Temporary storage / rate limiting (future use)
 *
 * Two parts to this config:
 *
 * 1. RedisTemplate — The low-level API for direct Redis operations (get/set/delete).
 *    Used when you need full control over Redis (e.g., custom data structures, pub/sub).
 *
 * 2. RedisCacheManager + @EnableCaching — Powers Spring's declarative caching annotations:
 *    - @Cacheable("cacheName")  → Cache the return value; skip method on cache HIT
 *    - @CacheEvict("cacheName") → Remove entry from cache when data changes
 *    - @CachePut("cacheName")   → Always execute method and update cache
 *
 * Without @EnableCaching, the @Cacheable/@CacheEvict annotations are completely ignored!
 */
@Configuration
@EnableCaching
public class RedisConfig {

    // ========== LOW-LEVEL REDIS TEMPLATE ==========

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Keys: plain strings (e.g., "connection:stats:42")
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Values: JSON serialization (readable + portable)
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }

    // ========== SPRING CACHE MANAGER (powers @Cacheable / @CacheEvict) ==========

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        // Default config: 10-minute TTL, JSON serialization, don't cache nulls
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

        // Build cache manager with per-cache TTL overrides
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration("connectionStats",
                        defaultConfig.entryTtl(Duration.ofMinutes(10)))   // stats cached 10 min
                .withCacheConfiguration("communityMemberCount",
                        defaultConfig.entryTtl(Duration.ofMinutes(15)))   // member counts cached 15 min
                .build();
    }
}
