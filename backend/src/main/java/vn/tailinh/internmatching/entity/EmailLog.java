package vn.tailinh.internmatching.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.EmailStatus;

@Entity
@Table(name = "email_logs")
@Getter
@Setter

public class EmailLog {

@Id 
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name = "recipient_email")
private String recipientEmail;

@Column(name = "subject")
private String subject;

@Column(columnDefinition = "TEXT")
private String content;

@Enumerated(EnumType.STRING)
@Column(name = "status")
private EmailStatus status;

@Column(name = "sent_at")
private Instant sentAt;

@ManyToOne
@JoinColumn(name = "user_id")
private User user;

}