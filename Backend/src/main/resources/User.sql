-- Jobs 테이블의 title 컬럼을 job_name으로 변경
ALTER TABLE Jobs 
CHANGE COLUMN title job_name VARCHAR(100) NOT NULL; 