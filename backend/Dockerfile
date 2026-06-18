FROM maven:3.9.6-eclipse-temurin-18 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:18-jre
WORKDIR /app
COPY --from=build /app/target/aim-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
