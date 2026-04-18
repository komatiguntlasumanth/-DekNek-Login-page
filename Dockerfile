# Multi-stage Docker build

# Stage 1: Build Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM eclipse-temurin:21-jdk-alpine as backend-build
WORKDIR /app
# We need maven to build the backend. Since it's not in the repo, we'll install it.
RUN apk add --no-cache maven
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src
# Copy frontend build to spring boot static resources
COPY --from=frontend-build /app/dist ./src/main/resources/static
RUN mvn package -DskipTests

# Stage 3: Final Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
