-- Insert statements for Users
INSERT INTO MCSC.Users (first_name, last_name, EMAIL, password, ACCOUNT_TYPE, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('John', 'Doe', 'john.doe@example.com', 'password123', 'Student', '1', '1', 'token123', TO_TIMESTAMP('2024-06-17 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'john.png', NULL, NULL);

INSERT INTO MCSC.Users (first_name, last_name, EMAIL, password, ACCOUNT_TYPE, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', 'password456', 'Instructor', '1', '1', 'token456', TO_TIMESTAMP('2024-06-18 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'jane.png', NULL, NULL);

INSERT INTO MCSC.Users (first_name, last_name, EMAIL, password, ACCOUNT_TYPE, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('Alice', 'Johnson', 'alice.johnson@example.com', 'password789', 'Admin', '1', '1', 'token789', TO_TIMESTAMP('2024-06-19 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'alice.png', NULL, NULL);

-- Insert statements for Profile
INSERT INTO MCSC.Profile (user_id, GENDER, date_of_birth, ABOUT, contact_number)
VALUES ('00004120000001', 'Male', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'About John Doe', '123-456-7890');

INSERT INTO MCSC.Profile (user_id, GENDER, date_of_birth, ABOUT, contact_number)
VALUES ('00004130000002', 'Female', TO_DATE('1985-02-02', 'YYYY-MM-DD'), 'About Jane Smith', '234-567-8901');

INSERT INTO MCSC.Profile (user_id, GENDER, date_of_birth, ABOUT, contact_number)
VALUES ('00004140000003', 'Female', TO_DATE('1992-03-03', 'YYYY-MM-DD'), 'About Alice Johnson', '345-678-9012');

-- Insert statements for Category
INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Programming', 'Courses related to programming and coding.', NULL);

INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Data Science', 'Courses related to data analysis and machine learning.', NULL);

INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Design', 'Courses related to graphic and UI/UX design.', NULL);

-- Insert statements for Courses
INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, PRICE, THUMBNAIL, status, category)
VALUES ('Introduction to Programming', 'Learn the basics of programming.', '00004130000002', 'Basics of programming languages, algorithms, and problem solving.', 100, 'prog_thumb.png', 'Published', 1);

INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, PRICE, THUMBNAIL, status, category)
VALUES ('Data Science 101', 'Introduction to data science concepts.', '00004130000002', 'Data analysis, machine learning basics.', 200, 'ds_thumb.png', 'Published', 2);

INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, PRICE, THUMBNAIL, status, category)
VALUES ('Graphic Design Basics', 'Learn the fundamentals of graphic design.', '00004130000002', 'Design principles, software tools.', 150, 'design_thumb.png', 'Published', 3);

-- Insert statements for Course_StudentsEnrolled
INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (1, '00004120000001');

INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (2, '00004120000001');

INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (3, '00004140000003');

-- Insert statements for Section
INSERT INTO MCSC.Section (course_id, section_name)
VALUES (1, 'Introduction');

INSERT INTO MCSC.Section (course_id, section_name)
VALUES (1, 'Advanced Topics');

INSERT INTO MCSC.Section (course_id, section_name)
VALUES (2, 'Data Cleaning');

-- Insert statements for SubSection
INSERT INTO MCSC.SubSection (section_id, course_id, title, time_duration, description, video_url)
VALUES (1, 1, 'What is Programming?', '10m', 'Introduction to programming concepts.', 'intro.mp4');

INSERT INTO MCSC.SubSection (section_id, course_id, title, time_duration, description, video_url)
VALUES (2, 1, 'Loops and Conditions', '20m', 'Learn ABOUT loops and conditionals.', 'loops.mp4');

INSERT INTO MCSC.SubSection (section_id, course_id, title, time_duration, description, video_url)
VALUES (3, 2, 'Data Cleaning Basics', '15m', 'Introduction to data cleaning.', 'cleaning.mp4');

-- Insert statements for CourseProgress
INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (1, '00004120000001', 'intro.mp4,loops.mp4');

INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (2, '00004120000001', 'cleaning.mp4');

INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (3, '00004140000003', NULL);

-- Insert statements for OTP
INSERT INTO MCSC.OTP (EMAIL, otp)
VALUES ('john.doe@example.com', '123456');

INSERT INTO MCSC.OTP (EMAIL, otp)
VALUES ('jane.smith@example.com', '654321');

INSERT INTO MCSC.OTP (EMAIL, otp)
VALUES ('alice.johnson@example.com', '789012');
