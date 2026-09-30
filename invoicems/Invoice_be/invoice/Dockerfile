FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY .mvn/ .mvn/
COPY mvnw ./
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
ENV JAVA_OPTS=""
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8060
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
