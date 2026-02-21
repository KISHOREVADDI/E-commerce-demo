# ---------- STAGE 1 : Build ----------
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .

# Build the Spring Boot jar
RUN mvn clean package -DskipTests


# ---------- STAGE 2 : Run ----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java","-jar","app.jar"]
