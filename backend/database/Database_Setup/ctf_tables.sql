CREATE TABLE MCSC.Contest (
    contestID NUMBER PRIMARY KEY NOT NULL,
    contestName VARCHAR2(50) NOT NULL,
    startTime DATE, 
    endTime DATE
);

CREATE SEQUENCE contest_seq
START WITH 012
INCREMENT BY 2
CACHE 10;


create table MCSC.Challenges ( 
cid NUMBER PRIMARY KEY NOT NULL, 
c_point NUMBER, --
c_title VARCHAR2(200),  
c_content VARCHAR2(400),
attempted NUMBER,   
totalSolves NUMBER,  
flag VARCHAR2(100),
contestID NUMBER , 
CONSTRAINT fk_challenges_contestID FOREIGN KEY (contestID) REFERENCES MCSC.Contest(contestID)
);

CREATE SEQUENCE challenges_seq
START WITH 11
INCREMENT BY 2
CACHE 30;

CREATE OR REPLACE TRIGGER trg_insert_challenges
BEFORE INSERT ON MCSC.Challenges
FOR EACH ROW
WHEN (NEW.cid IS NULL)
BEGIN
  SELECT challenges_seq.NEXTVAL
  INTO :NEW.cid
  FROM dual;
END;


CREATE TABLE MCSC.HOST( 
    user_id VARCHAR2(20),
    contestID NUMBER,
    CONSTRAINT fk_host_userid FOREIGN KEY (USER_ID) REFERENCES MCSC.USERS (USER_ID),
    CONSTRAINT fk_host_contestID FOREIGN KEY (contestID) REFERENCES MCSC.Contest(contestID)
);


CREATE TABLE MCSC.PARTICIPATE( 
    user_id VARCHAR2(20),
    contestID NUMBER,
    CONSTRAINT fk_participate_userid FOREIGN KEY (USER_ID) REFERENCES MCSC.USERS (USER_ID),
    CONSTRAINT fk_participate_contestID FOREIGN KEY (contestID) REFERENCES MCSC.Contest(contestID)
);

CREATE TABLE MCSC.TEAM(
    teamID VARCHAR2 (20) PRIMARY KEY NOT NULL,
    t_name VARCHAR2 (20),
    contestID NUMBER,
    CONSTRAINT fk_team_contestid FOREIGN KEY (contestID) REFERENCES MCSC.Contest(contestID)
   
)


CREATE TABLE MCSC.TEAMMEMBER(
    user_id VARCHAR2(20),
    teamID VARCHAR2(20),
    CONSTRAINT fk_teammember_userid FOREIGN KEY (USER_ID) REFERENCES MCSC.USERS (USER_ID),
    CONSTRAINT fk_teammember_teamid FOREIGN KEY (teamID) REFERENCES MCSC.TEAM (TEAMID)
   
);


CREATE TABLE MCSC.SUBMISSION( 
    submissionID VARCHAR (20) PRIMARY KEY NOT NULL,
    penalty VARCHAR (20),       
    submission_time VARCHAR (20),  
    cid NUMBER,
    status VARCHAR2(20),
    user_id VARCHAR (20),
    CONSTRAINT fk_submission_user_id FOREIGN KEY (USER_ID) REFERENCES MCSC.USERS (USER_ID),
    CONSTRAINT fk_submission_cid FOREIGN KEY (cid) REFERENCES MCSC.Challenges(cid)
)

-- Abstract Data type

CREATE TYPE MCSC.HINT AS OBJECT
(
	 cost VARCHAR2 (20),
   content VARCHAR2 (200)
  
);

ALTER MCSC.TABLE CHALLENGES 
ADD hnt MCSC.HINT;



SELECT january, february,  march, april, may, june, july, august, 
    september, october,  november,  december
FROM MCSC.RATING
WHERE user_id = :userId


--rating for a month:-

CREATE TABLE MCSC.Contest_Rating (
    contest_id NUMBER,
    user_id VARCHAR2(20),
    rating NUMBER
);


SELECT 
    CR.contest_id,
    C.contestName,
    CR.user_id,
    CR.rating,
    C.startTime,
    C.endTime
FROM 
    MCSC.Contest_Rating CR
JOIN 
    MCSC.Contest C ON CR.contest_id = C.contestID
WHERE 
    EXTRACT(MONTH FROM C.startTime) = :month
    AND EXTRACT(YEAR FROM C.startTime) = :year;



INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U001', 'Sadman', 'Shafiq', 'sadmanshafiq@gmail.com', 'password123', 'Student', '1234567890', '1', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U002', 'Tasnuva', 'Islam', 'tasnuvaislam@gmail.com', 'password123', 'Instructor', '1234567891', '1', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U003', 'Sadia', 'Moon', 'sadiamoon@gmail.com', 'password123', 'Admin', '1234567892', '1', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U004', 'Iftekharul', 'Islam', 'iftekharulislam@gmail.com', 'password123', 'Student', '1234567893', '0', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U005', 'Rakibul', 'Islam', 'rakibulislam@gmail.com', 'password123', 'Instructor', '1234567894', '1', '0');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U006', 'Sifat', 'Ahmed', 'sifatahmed@gmail.com', 'password123', 'Student', '1234567895', '1', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U007', 'Abdullah', 'Noman', 'abdullahnoman@gmail.com', 'password123', 'Student', '1234567896', '1', '1');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U008', 'Sheikh', 'Hasina', 'sheikhhasina@gmail.com', 'password123', 'Instructor', '1234567897', '0', '0');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U009', 'Sheikh', 'Mujibur', 'sheikhmujibur@gmail.com', 'password123', 'Student', '1234567898', '1', '0');
INSERT INTO MCSC.Users (user_id, first_name, last_name, email, password, account_type, contactNumber, active, approved) VALUES ('U010', 'Rahul', 'Gandhi', 'rahulgandhi@gmail.com', 'password123', 'Admin', '1234567899', '1', '1');



INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (101, 'Code Championship', TO_DATE('2024-08-01','YYYY-MM-DD'), TO_DATE('2024-08-01', 'YYYY-MM-DD'));



INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (102, 'Hackathon', TO_DATE('2024-09-15', 'YYYY-MM-DD'), TO_DATE('2024-09-15', 'YYYY-MM-DD'));


INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (103, 'Bug Bounty', TO_DATE('2024-10-10', 'YYYY-MM-DD'), TO_DATE('2024-10-10', 'YYYY-MM-DD'));


INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (104, 'Hackvens_2024', TO_DATE('2024-10-10', 'YYYY-MM-DD'), TO_DATE('2024-10-10', 'YYYY-MM-DD'));




INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (456, 'Hackathon', TO_DATE('2024-09-15', 'YYYY-MM-DD'), TO_DATE('2024-09-15', 'YYYY-MM-DD'));


INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (457, 'Bug Bounty', TO_DATE('2024-10-10', 'YYYY-MM-DD'), TO_DATE('2024-10-10', 'YYYY-MM-DD'));


INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (458, 'Hackvens_2024', TO_DATE('2024-10-10', 'YYYY-MM-DD'), TO_DATE('2024-10-10', 'YYYY-MM-DD'));


INSERT INTO MCSC.Contest (contestID, contestName, startTime, endTime)
VALUES (459, 'Hackvens_2024', TO_DATE('2024-10-10', 'YYYY-MM-DD'), TO_DATE('2024-10-10', 'YYYY-MM-DD'));





INSERT INTO MCSC.Challenges (cid, c_point, c_title, c_content, attempted, totalSolves, flag, contestID) 
VALUES (101, 100, 'Challenge One', 'Solve the given problem in the shortest time.', 50, 25, 'flag{challenge_one}', 456);

INSERT INTO MCSC.Challenges (cid, c_point, c_title, c_content, attempted, totalSolves, flag, contestID) 
VALUES (102, 200, 'Challenge Two', 'Find the hidden pattern in the dataset.', 40, 20, 'flag{challenge_two}', 457);

INSERT INTO MCSC.Challenges (cid, c_point, c_title, c_content, attempted, totalSolves, flag, contestID) 
VALUES (103, 150, 'Challenge Three', 'Optimize the algorithm for better performance.', 30, 15, 'flag{challenge_three}', 458);

INSERT INTO MCSC.Challenges (cid, c_point, c_title, c_content, attempted, totalSolves, flag, contestID) 
VALUES (104, 250, 'Challenge Four', 'Decode the encrypted message.', 20, 10, 'flag{challenge_four}', 459);





INSERT INTO MCSC.HOST (user_id, contestID)
VALUES ('00004130000002', 456);
INSERT INTO MCSC.HOST (user_id, contestID)
VALUES ('00000012170000806', 457);
INSERT INTO MCSC.HOST (user_id, contestID)
VALUES ('00000016150001204', 458);
INSERT INTO MCSC.HOST (user_id, contestID)
VALUES ('00000004190000008', 459);


INSERT INTO MCSC.PARTICIPATE (user_id, contestID)
VALUES ('00000016160001205', 456);

INSERT INTO MCSC.PARTICIPATE (user_id, contestID)
VALUES ('00000004180000007', 457);

INSERT INTO MCSC.PARTICIPATE (user_id, contestID)
VALUES ('00000018220001411', 458);

INSERT INTO MCSC.PARTICIPATE (user_id, contestID)
VALUES ('00000018210001410', 459);


INSERT INTO MCSC.SUBMISSION (submissionID, penalty, submission_time, cid) VALUES ('S001', 300, '2024-07-06 10:00:00', 101);
INSERT INTO MCSC.SUBMISSION (submissionID, penalty, submission_time, cid) VALUES ('S002', 240, '2024-07-06 10:15:00', 102);
INSERT INTO MCSC.SUBMISSION (submissionID, penalty, submission_time, cid) VALUES ('S003', 420, '2024-07-06 10:30:00', 103);
INSERT INTO MCSC.SUBMISSION (submissionID, penalty, submission_time, cid) VALUES ('S004', 480, '2024-07-06 10:45:00', 104);


INSERT INTO MCSC.TEAMMEMBER (user_id, teamID) VALUES ('U001', 'T001');
INSERT INTO MCSC.TEAMMEMBER (user_id, teamID) VALUES ('U002', 'T002');
INSERT INTO MCSC.TEAMMEMBER (user_id, teamID) VALUES ('U003', 'T003');
INSERT INTO MCSC.TEAMMEMBER (user_id, teamID) VALUES ('U004', 'T004');



INSERT INTO MCSC.TEAM (teamID, t_name, contestID) VALUES ('T001', 'Team Alpha', 456);
INSERT INTO MCSC.TEAM (teamID, t_name, contestID) VALUES ('T002', 'Team Beta', 457);
INSERT INTO MCSC.TEAM (teamID, t_name, contestID) VALUES ('T003', 'Team Gamma', 458);
INSERT INTO MCSC.TEAM (teamID, t_name, contestID) VALUES ('T004', 'Team Delta', 459);

INSERT INTO MCSC.HINT (cost, content, cid) VALUES ('5 points', 'Use function X', 104);
INSERT INTO MCSC.HINT (cost, content, cid) VALUES ('10 points', 'Consider edge cases', 102);
INSERT INTO MCSC.HINT (cost, content, cid) VALUES ('3 points', 'Review algorithm Y', 103);
INSERT INTO MCSC.HINT (cost, content, cid) VALUES ('7 points', 'Optimize data structures', 101);

Select p_name,p_point,p_point
From 
Where 
Order by p_point desc, p_penalty asc


SELECT contestID, contestName, status 
FROM MCSC.Contest
WHERE STATUS = '0';

--7
select user_id,count(cid)
from MCSC.SUBMISSION
where STATUS='solved'
group by user_id;

--
SELECT user_id, COUNT(contestID) AS contest_count
FROM MCSC.PARTICIPATE
GROUP BY user_id;

--past contests

SELECT contestID, contestName
FROM MCSC.Contest
WHERE endTime < TO_DATE(:currentDate, 'YYYY-MM-DD')



SELECT s.user_id,  MIN(s.SUBMISSION_TIME) AS first_solve_time
FROM MCSC.SUBMISSION s , MCSC.USERS u
WHERE s.user_id = u.user_id AND s.STATUS = 'solved'
group by  s.cid




SELECT u.first_name, c.c_point
FROM MCSC.USERS u
JOIN MCSC.SUBMISSION s ON u.user_id = s.user_id
JOIN MCSC.Challenges c ON s.cid = c.cid
ORDER BY c.c_point;


SELECT s.user_id, (c.c_point - s.penalty) as "Points"
FROM MCSC.SUBMISSION s
JOIN MCSC.Challenges c ON s.cid = c.cid
ORDER BY (c.c_point - s.penalty) DESC;



 select s.USER_ID,ch.contestid,COUNT(s.cid)
from mcsc.submission s, mcsc.challenges ch
where ch.cid=s.cid
and s.status='solved'
group by ch.contestid,s.USER_ID ;


select ch.contestid,COUNT(s.cid)
from mcsc.submission s, mcsc.challenges ch
where ch.cid=s.cid
and s.status='solved'
group by ch.contestid ;
