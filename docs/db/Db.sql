CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `appointment_time` datetime(6) NOT NULL,
  `cancellation_reason` varchar(500) DEFAULT NULL,
  `cancelled_by` enum('ADMIN','DOCTOR','PATIENT') DEFAULT NULL,
  `reason_for_visit` varchar(500) DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','PENDING','SCHEDULED') NOT NULL,
  `clinic_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  `payment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK585en1338fkttlaurqfbuqxaf` (`payment_id`),
  KEY `FKap2c2dv8qh6r32te6qbakix0b` (`clinic_id`),
  KEY `FKmujeo4tymoo98cmf7uj3vsv76` (`doctor_id`),
  KEY `FKopb2h9yhin1rb4dqote8bws6w` (`patient_id`),
  CONSTRAINT `FKap2c2dv8qh6r32te6qbakix0b` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`),
  CONSTRAINT `FKbl66iv34dncbgbr3jlph3oo5w` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  CONSTRAINT `FKmujeo4tymoo98cmf7uj3vsv76` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  CONSTRAINT `FKopb2h9yhin1rb4dqote8bws6w` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `cities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4yb9o8jt738pe29p6wervoa2j` (`name`,`state`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `clinic_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `clinic_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg9ed4yxgx3d9ooe6s7o086b64` (`clinic_id`),
  CONSTRAINT `FKg9ed4yxgx3d9ooe6s7o086b64` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `clinic_services` (
  `clinic_id` bigint NOT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`clinic_id`,`service_id`),
  KEY `FK2udes0d0g0atxfjp703yhyesn` (`service_id`),
  CONSTRAINT `FK2udes0d0g0atxfjp703yhyesn` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `FK4weu3k0vdc9s00pnlgj4qelor` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `clinics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `about` varchar(600) DEFAULT NULL,
  `address` varchar(200) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `city_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcpl886afbkhnvxyq0lokq6wnb` (`email`),
  UNIQUE KEY `UKlncumc9wtp5b37i62y731qk6` (`phone_number`),
  KEY `FKq5t97kf8jgekycnavabmubag4` (`city_id`),
  CONSTRAINT `FKq5t97kf8jgekycnavabmubag4` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `doctor_leaves` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_date` datetime(6) NOT NULL,
  `reason` varchar(300) DEFAULT NULL,
  `start_date` datetime(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbd1ja4kico447h6oax2hqfirk` (`doctor_id`),
  CONSTRAINT `FKbd1ja4kico447h6oax2hqfirk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `doctor_schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `day_of_week` enum('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') NOT NULL,
  `end_time` time(6) NOT NULL,
  `slot_duration_minutes` int NOT NULL,
  `start_time` time(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKis6as9vi07nl73q77hh71ai3k` (`doctor_id`,`day_of_week`),
  CONSTRAINT `FKqptts4sun4tpv6elafrnrfeup` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `doctor_verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `degree` varchar(100) NOT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `registration_council` varchar(100) NOT NULL,
  `registration_number` varchar(100) NOT NULL,
  `verification_status` enum('PENDING','REJECTED','VERIFIED') DEFAULT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKext5bmjest0q107ke7fa8kjr0` (`user_id`),
  CONSTRAINT `FK4l8awb7l43osqu1o4le6r36sj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `doctors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `experience` int NOT NULL,
  `consultation_fees` int NOT NULL,
  `is_prime` bit(1) NOT NULL,
  `rating` double NOT NULL,
  `clinic_id` bigint DEFAULT NULL,
  `speciality_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt1f6cueqyjwx5ghew9ar1exe3` (`user_id`),
  KEY `FKihqanxookqa5oh9guthqjfxxm` (`clinic_id`),
  KEY `FKecksrkmked5wnsmscpgq9bqgf` (`speciality_id`),
  CONSTRAINT `FKe9pf5qtxxkdyrwibaevo9frtk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKecksrkmked5wnsmscpgq9bqgf` FOREIGN KEY (`speciality_id`) REFERENCES `specialities` (`id`),
  CONSTRAINT `FKihqanxookqa5oh9guthqjfxxm` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`),
  CONSTRAINT `doctors_chk_1` CHECK ((`experience` >= 0)),
  CONSTRAINT `doctors_chk_2` CHECK ((`consultation_fees` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `amount` int NOT NULL,
  `payment_status` enum('COMPLETED','FAILED','PENDING') NOT NULL,
  `txn_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbwnche3mlynf7o536dk4p77gr` (`txn_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `comment` varchar(300) DEFAULT NULL,
  `rating` int NOT NULL,
  `appointment_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKvroos1rdslok15k6q2go3p15` (`appointment_id`),
  KEY `FKf940sak3s3i21v956bej9y0ii` (`doctor_id`),
  KEY `FKp6ff3lit060ehcuyc5artangi` (`patient_id`),
  CONSTRAINT `FKf940sak3s3i21v956bej9y0ii` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  CONSTRAINT `FKfhaj6kqx2pjpn6eambt0pa1nm` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  CONSTRAINT `FKp6ff3lit060ehcuyc5artangi` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5) and (`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKh4rqgjwnqidx6mvj4i22dxwxe` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `specialities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(300) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhyxbmhook00xojab057gnoo5u` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `profile_img` varchar(512) DEFAULT NULL,
  `role` enum('ADMIN','DOCTOR','PATIENT') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK9q63snka3mdh91as4io72espi` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


