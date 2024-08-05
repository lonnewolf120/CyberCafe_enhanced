#After installing docker, run:

docker login 

#After logging in:

docker pull gvenzl/oracle-xe

docker run -d -p 1521:1521 -e ORACLE_PASSWORD=ADMIN -v oracle-volume:/opt/oracle/oradata gvenzl/oracle-xe
(this will create a parsistent database)

#run the container (in cmd): 
docker exec -it <containerName> /bin/sh
(for me container name was ecstatic_lamarr, it can be different for you)

then, run:

sqlplus sys as sysdba 
(enter the password you entered before)

after that connect everything in SQL Developer for running operations, using following configuration:

user : SYS (as SYSDBA)
pass : ADMIN

![](C:\Users\iftek\AppData\Roaming\marktext\images\2024-06-28-11-16-26-image.png)


then in sqlplus or sqldeveloper: 

CREATE USER MCSC IDENTIFIED BY MCSC;
GRANT ALL PRIVILEGES TO MCSC;
ALTER USER MCSC QUOTA UNLIMITED ON USERS;
GRANT CREATE SESSION TO MCSC;

CREATE USER STU IDENTIFIED BY STUDENT;
GRANT CONNECT TO STU;
