# ============================================
# Stage 1: BUILD — compile the application
# Uses JDK (has compiler). This layer is discarded in the final image.
# ============================================
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# 1. Copy only dependency files first (for Docker layer caching).
#    These change rarely, so Docker can cache the "dependency:resolve" layer
#    and skip re-downloading on every code change.
COPY pom.xml ./
COPY .mvn/ .mvn
COPY mvnw ./
RUN chmod +x mvnw && ./mvnw dependency:resolve -B -q

# 2. Copy source code and build the fat JAR (skipping tests for faster builds)
COPY src ./src
RUN ./mvnw clean package -DskipTests -B -q

# 3. Extract Spring Boot layered JAR for optimal Docker caching.
#    Spring Boot's layertools splits the fat JAR into:
#      - dependencies (rarely change)
#      - spring-boot-loader
#      - snapshot-dependencies
#      - application (your code — changes often)
#    This means Docker only rebuilds the layer that actually changed.
RUN java -Djarmode=layertools -jar target/*.jar extract --destination extracted

# ============================================
# Stage 2: RUN — lightweight production image
# Uses JRE only (no compiler). ~60% smaller than JDK.
# ============================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy layers from build stage — ordered from least to most frequently changed
COPY --from=build /app/extracted/dependencies/ ./
COPY --from=build /app/extracted/spring-boot-loader/ ./
COPY --from=build /app/extracted/snapshot-dependencies/ ./
COPY --from=build /app/extracted/application/ ./

# Switch to non-root user
USER appuser

EXPOSE 8083

# Use the Spring Boot launcher (works with layered JARs)
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]