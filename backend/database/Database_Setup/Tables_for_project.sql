-- Table for Users
CREATE TABLE MCSC.Users (
    user_id VARCHAR2(20) PRIMARY KEY,
    first_name VARCHAR2(255) NOT NULL,
    last_name VARCHAR2(255) NOT NULL,
    EMAIL VARCHAR2(255) NOT NULL,
    password VARCHAR2(255) NOT NULL,
    ACCOUNT_TYPE VARCHAR2(50) CHECK (ACCOUNT_TYPE IN ('Admin', 'Student', 'Instructor')),
    CONTACT_NUMBER VARCHAR2(15),
    active CHAR(1) DEFAULT '0',
    approved CHAR(1) DEFAULT '0',
    --additional_details NUMBER,
    -- instead of having this as FK, we'll add user_id as fk to profile to get additional info
    token VARCHAR2(255),
    reset_password_expires TIMESTAMP,
    image VARCHAR2(255),
    courses VARCHAR2(4000),
    course_progress VARCHAR2(4000)
    --CONSTRAINT fk_additional_details FOREIGN KEY (additional_details) REFERENCES Profile(profile_id)
    --CONSTRAINT fk_courses FOREIGN KEY (courses) REFERENCES Course_StudentsEnrolled(course_id)
);
-- Table for Profile
CREATE TABLE MCSC.Profile (
    profile_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id VARCHAR2(20) NOT NULL,
    GENDER VARCHAR2(50),
    date_of_birth DATE,
    ABOUT VARCHAR2(4000),
    contact_number VARCHAR2(50),
    CONSTRAINT fk_profile_USER_ID FOREIGN KEY (user_id) REFERENCES MCSC.USERS(user_id)
);


-- Recreate the sequences with the correct increment
CREATE SEQUENCE random_value_seq
  START WITH 412
  MINVALUE 412
  MAXVALUE 9999999
  NOCYCLE
  CACHE 200
  INCREMENT BY 1;

CREATE SEQUENCE incrementing_counter_seq
  START WITH 1
  MINVALUE 1
  MAXVALUE 9999999
  NOCYCLE
  CACHE 200
  INCREMENT BY 1;

-- Create trigger to generate primary key for Users table
CREATE OR REPLACE TRIGGER USER_ID_key_trigger
BEFORE INSERT ON MCSC.Users
FOR EACH ROW
BEGIN
  :NEW.user_id := TO_CHAR(LPAD(random_value_seq.NEXTVAL, 7, '0') || LPAD(incrementing_counter_seq.NEXTVAL, 7, '0'));
END;
/

--SHOW ERRORS TRIGGER USER_ID_key_trigger;


-- Table for Category
CREATE TABLE MCSC.Category (
    category_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    description VARCHAR2(4000),
    courses VARCHAR2(4000)
);


-- Create a collection type for user IDs
--CREATE TYPE user_id_list AS TABLE OF NUMBER;

-- Table for Courses
CREATE TABLE MCSC.Courses (
    course_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    course_name VARCHAR2(255),
    course_description VARCHAR2(4000),
    instructor VARCHAR2(20) NOT NULL,
    what_you_will_learn VARCHAR2(4000),
    PRICE NUMBER,
    THUMBNAIL VARCHAR2(255),
    --courseContent 
    status VARCHAR2(10) CHECK (status IN ('Draft', 'Published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category NUMBER,
    CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor) REFERENCES MCSC.Users(user_id),
    CONSTRAINT fk_courses_category FOREIGN KEY (category) REFERENCES MCSC.Category(category_id)
   -- CONSTRAINT fk_
);

-- Associative table for Courses and Users (Many-to-Many for Students Enrolled)
CREATE TABLE MCSC.Course_StudentsEnrolled (
    course_id NUMBER,
    student_id VARCHAR2(20),
    PRIMARY KEY (course_id, student_id),
    CONSTRAINT fk_course_COURSE_ID FOREIGN KEY (course_id) REFERENCES MCSC.Courses(course_id),
    CONSTRAINT fk_student_USER_ID FOREIGN KEY (student_id) REFERENCES MCSC.Users(user_id)
);

-- Table for Section
CREATE TABLE MCSC.Section (
    section_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    course_id NUMBER,
    section_name VARCHAR2(255),
    subsection_id NUMBER,
    CONSTRAINT fk_section_COURSE_ID FOREIGN KEY (course_id) REFERENCES MCSC.Courses(course_id)
);
-- Table for SubSection
CREATE TABLE MCSC.SubSection (
    subsection_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    section_id NUMBER,
    course_id NUMBER,
    title VARCHAR2(255),
    time_duration VARCHAR2(50),
    description VARCHAR2(4000),
    video_url VARCHAR2(255),
    CONSTRAINT fk_section_sectionId FOREIGN KEY (section_id) REFERENCES MCSC.Section(section_id),
    CONSTRAINT fk_subsection_COURSE_ID FOREIGN KEY (course_id) REFERENCES MCSC.COURSES(course_id)
);


-- Table for CourseProgress
CREATE TABLE MCSC.CourseProgress (
    course_progress_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    course_id NUMBER,
    user_id VARCHAR2(20),
    completed_videos VARCHAR2(4000),
    CONSTRAINT fk_courseProgress_COURSE_ID FOREIGN KEY (course_id) REFERENCES MCSC.Courses(course_id),
    CONSTRAINT fk_courseProgress_USER_ID FOREIGN KEY (user_id) REFERENCES MCSC.Users(user_id)
);

-- Table for OTP
CREATE TABLE MCSC.OTP (
    otp_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    EMAIL VARCHAR2(255) NOT NULL,
    otp VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP GENERATED ALWAYS AS (created_at + INTERVAL '5' MINUTE)
);
