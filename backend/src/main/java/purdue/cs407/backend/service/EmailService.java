package purdue.cs407.backend.service;

import purdue.cs407.backend.models.EmailDetails;

public interface EmailService {


    String sendSimpleMail(EmailDetails details);


    String sendMailWithAttachment(EmailDetails details);
}
