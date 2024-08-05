--this is OK now, but if faced constraint error then, based on the current user_id size please change the user_ids (i'm lazy)

-- Insert statements for Users
INSERT INTO MCSC.Users (first_name, last_name, email, password, account_type, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('John', 'Doe', 'john.doe@example.com', 'password123', 'Student', '1', '1', 'token123', TO_TIMESTAMP('2024-06-17 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'john.png', NULL, NULL);

INSERT INTO MCSC.Users (first_name, last_name, email, password, account_type, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', 'password456', 'Instructor', '1', '1', 'token456', TO_TIMESTAMP('2024-06-18 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'jane.png', NULL, NULL);

INSERT INTO MCSC.Users (first_name, last_name, email, password, account_type, active, approved, token, reset_password_expires, image, courses, course_progress)
VALUES ('Alice', 'Johnson', 'alice.johnson@example.com', 'password789', 'Admin', '1', '1', 'token789', TO_TIMESTAMP('2024-06-19 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'alice.png', NULL, NULL);

-- Insert statements for Profile
INSERT INTO MCSC.Profile (user_id, gender, date_of_birth, about, contact_number)
VALUES ('00000004120000001', 'Male', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'About John Doe', '123-456-7890');

INSERT INTO MCSC.Profile (user_id, gender, date_of_birth, about, contact_number)
VALUES ('00000004130000002', 'Female', TO_DATE('1985-02-02', 'YYYY-MM-DD'), 'About Jane Smith', '234-567-8901');

INSERT INTO MCSC.Profile (user_id, gender, date_of_birth, about, contact_number)
VALUES ('00000004140000003', 'Female', TO_DATE('1992-03-03', 'YYYY-MM-DD'), 'About Alice Johnson', '345-678-9012');

-- Insert statements for Category
INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Programming', 'Courses related to programming and coding.', NULL);

INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Data Science', 'Courses related to data analysis and machine learning.', NULL);

INSERT INTO MCSC.Category (name, description, courses)
VALUES ('Design', 'Courses related to graphic and UI/UX design.', NULL);

-- Insert statements for Courses
INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, price, thumbnail, status, category)
VALUES ('Introduction to Programming', 'Learn the basics of programming.', '00000004130000002', 'Basics of programming languages, algorithms, and problem solving.', 100, 'prog_thumb.png', 'Published', 1);

INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, price, thumbnail, status, category)
VALUES ('Data Science 101', 'Introduction to data science concepts.', '00000004130000002', 'Data analysis, machine learning basics.', 200, 'ds_thumb.png', 'Published', 2);

INSERT INTO MCSC.Courses (course_name, course_description, instructor, what_you_will_learn, price, thumbnail, status, category)
VALUES ('Graphic Design Basics', 'Learn the fundamentals of graphic design.', '00000004130000002', 'Design principles, software tools.', 150, 'design_thumb.png', 'Published', 3);

-- Insert statements for Course_StudentsEnrolled
INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (1, '00000004120000001');

INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (2, '00000004120000001');

INSERT INTO MCSC.Course_StudentsEnrolled (course_id, student_id)
VALUES (3, '00000004140000003');

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
VALUES (2, 1, 'Loops and Conditions', '20m', 'Learn about loops and conditionals.', 'loops.mp4');

INSERT INTO MCSC.SubSection (section_id, course_id, title, time_duration, description, video_url)
VALUES (3, 2, 'Data Cleaning Basics', '15m', 'Introduction to data cleaning.', 'cleaning.mp4');

-- Insert statements for CourseProgress
INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (1, '00000004120000001', 'intro.mp4,loops.mp4');

INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (2, '00000004120000001', 'cleaning.mp4');

INSERT INTO MCSC.CourseProgress (course_id, user_id, completed_videos)
VALUES (3, '00000004140000003', NULL);

-- Insert statements for OTP
INSERT INTO MCSC.OTP (email, otp)
VALUES ('john.doe@example.com', '123456');

INSERT INTO MCSC.OTP (email, otp)
VALUES ('jane.smith@example.com', '654321');

INSERT INTO MCSC.OTP (email, otp)
VALUES ('alice.johnson@example.com', '789012');

INSERT INTO MCSC.RatingAndReviews (user_id, course_id, review, rating) VALUES
('00000004120000001', 1, 'Great course, very informative!', 5);
INSERT INTO MCSC.RatingAndReviews (user_id, course_id, review, rating) VALUES
('00000004130000002', 2, 'Good course but could be improved.', 3);
INSERT INTO MCSC.RatingAndReviews (user_id, course_id, review, rating) VALUES
('00000004130000002', 3, 'Excellent course, highly recommend!', 4);



INSERT INTO MCSC.PRACTICECONTENT (PID, TITLE, IMAGE, URI)
VALUES (123, 'SQL', q'[https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMMMws7rPtchjHY5odL-gMT_qlY3ASpQPQWw&s]', 'practice/plsql');



--Contest part

INSERT INTO MCSC.Contest (
  contestID, contestName, contestDesc, contestType, startTime, endTime, status, totalParticipant, totalSolves
) VALUES (
  1, 'Monthly Challenge', 'Monthly coding challenge for all levels.', 'Algorithm', TIMESTAMP '2024-07-01 09:00:00', TIMESTAMP '2024-07-01 21:00:00', 1, 100, 50
);

INSERT INTO MCSC.Contest (
  contestID, contestName, contestDesc, contestType, startTime, endTime, status, totalParticipant, totalSolves
) VALUES (
  2, 'Weekly Contest', 'Weekly contest to test algorithm skills.', 'Algorithm', TIMESTAMP '2024-07-08 12:00:00', TIMESTAMP '2024-07-08 15:00:00', 1, 150, 75
);

INSERT INTO MCSC.Contest (
  contestID, contestName, contestDesc, contestType, startTime, endTime, status, totalParticipant, totalSolves
) VALUES (
  3, 'Beginner Blitz', 'Contest for beginner level programmers.', 'Beginner', TIMESTAMP '2024-07-15 10:00:00', TIMESTAMP '2024-07-15 13:00:00', 1, 200, 120
);

INSERT INTO MCSC.Contest (
  contestID, contestName, contestDesc, contestType, startTime, endTime, status, totalParticipant, totalSolves
) VALUES (
  4, 'Advanced Algorithms', 'Challenge for advanced programmers.', 'Advanced', TIMESTAMP '2024-07-22 14:00:00', TIMESTAMP '2024-07-22 17:00:00', 0, 80, 40
);

INSERT INTO MCSC.Contest (
  contestID, contestName, contestDesc, contestType, startTime, endTime, status, totalParticipant, totalSolves
) VALUES (
  5, 'Hackathon', '24-hour hackathon event.', 'Hackathon', TIMESTAMP '2024-07-29 09:00:00', TIMESTAMP '2024-07-30 09:00:00', 0, 250, 200
);


--Challenges

INSERT INTO MCSC.Challenges (
  cid, c_title, c_content, Points, category, TASKURL, status, TASKNOTE, attempted, totalSolves, flag, contestID
) VALUES (
  1, 'Simple Addition', 'Solve simple addition problems.', 100, 'Mathematics', 'http://example.com/task1', 1, 'No special notes', 120, 100, 'easy', 1
);

INSERT INTO MCSC.Challenges (
  cid, c_title, c_content, Points, category, TASKURL, status, TASKNOTE, attempted, totalSolves, flag, contestID
) VALUES (
  2, 'Sorting Algorithms', 'Implement various sorting algorithms.', 200, 'Algorithms', 'http://example.com/task2', 1, 'Use efficient sorting techniques', 150, 80, 'medium', 2
);

INSERT INTO MCSC.Challenges (
  cid, c_title, c_content, Points, category, TASKURL, status, TASKNOTE, attempted, totalSolves, flag, contestID
) VALUES (
  3, 'Beginner Array', 'Work with arrays for beginners.', 50, 'Beginner', 'http://example.com/task3', 1, 'Focus on basics', 180, 150, 'easy', 3
);

INSERT INTO MCSC.Challenges (
  cid, c_title, c_content, Points, category, TASKURL, status, TASKNOTE, attempted, totalSolves, flag, contestID
) VALUES (
  4, 'Dynamic Programming', 'Solve problems using dynamic programming.', 300, 'Advanced', 'http://example.com/task4', 0, 'Optimization is key', 70, 40, 'hard', 4
);

INSERT INTO MCSC.Challenges (
  cid, c_title, c_content, Points, category, TASKURL, status, TASKNOTE, attempted, totalSolves, flag, contestID
) VALUES (
  5, 'Hackathon Challenge', 'Create a project within 24 hours.', 500, 'Hackathon', 'http://example.com/task5', 0, 'Be creative and innovative', 300, 200, 'hard', 5
);
