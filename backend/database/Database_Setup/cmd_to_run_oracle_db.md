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

