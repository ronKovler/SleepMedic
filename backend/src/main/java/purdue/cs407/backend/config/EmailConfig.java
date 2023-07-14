package purdue.cs407.backend.config;

import jakarta.mail.Session;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    /**
     * Get the javamailsender for sending emails through Gmail SMTP.
     * @return JavaMailSender instance with correct properties.
     */
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername("sleepmedic.me@gmail.com");
        mailSender.setPassword("hxevomamxpigdxox");
        //34gtqhwWBTE9uwWGsfn2u94g
        // PASS: 4C931%k4J0wk$LMcvWR5
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true"); //TODO disable


        return mailSender;
    }

    /**
     * Get the session object for connecting to IMAP for email reading
     * @return - Session session with correct properties for gmail IMAP.
     */
    @Bean
    public Session getMailReadSession() {
        Properties properties = new Properties();
        properties.put("mail.store.protocol", "imaps");
        properties.put("mail.imaps.host", "imap.gmail.com");
        properties.put("mail.imaps.port", "993");
        properties.put("mail.imaps.starttls.enable", "true");
        properties.put("mail.imaps.auth", "true");
        properties.put("mail.imaps.user", "sleepmedic.me@gmail.com");
        properties.put("mail.imaps.password", "rmnrufeaijzxegcq");
        properties.put("mail.debug", "true");
        properties.put("mail.imaps.connectiontimeout", "5000");
        properties.put("mail.imaps.timeout", "5000");

        return Session.getInstance(properties);
    }

}
