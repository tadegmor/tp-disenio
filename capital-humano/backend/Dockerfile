# Etapa 1: Compilación
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Cachear dependencias primero
COPY pom.xml .
RUN mvn dependency:go-offline -B -Daether.connector.basic.threads=1 -Daether.dependencyCollector.bf.threads=1 -Daether.connector.http.retryHandler.count=5

# Copiar código fuente y empaquetar
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]