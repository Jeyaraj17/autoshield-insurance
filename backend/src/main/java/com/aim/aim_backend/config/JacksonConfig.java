package com.aim.aim_backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Custom deserializer for LocalDateTime
        javaTimeModule.addDeserializer(LocalDateTime.class, 
            new LocalDateTimeDeserializer(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        javaTimeModule.addSerializer(LocalDateTime.class, 
            new LocalDateTimeSerializer(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
        mapper.registerModule(javaTimeModule);
        return mapper;
    }
}