DROP DATABASE hsj;
CREATE DATABASE hsj;

USE hsj;

-- 사용자 테이블
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL, -- 암호화된 비밀번호 저장
    name VARCHAR(100) NOT NULL,     -- 사용자 실명
    level VARCHAR(20) NOT NULL,      -- ADMIN, MANAGER, WORKER 등
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 업무 테이블
CREATE TABLE Jobs (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    job_name VARCHAR(100) NOT NULL,
    description TEXT,               -- 업무 설명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),        -- 업무 생성자
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, ARCHIVED 등
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- 사용자-업무 매핑 테이블 (다대다 관계)
CREATE TABLE UserJobs (
    user_id VARCHAR(50),
    job_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(50),        -- 업무 할당자
    PRIMARY KEY (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id),
    FOREIGN KEY (assigned_by) REFERENCES Users(user_id)
);

-- 파일 접근 권한 테이블
CREATE TABLE FilePermissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    file_path VARCHAR(255) NOT NULL, -- 파일/폴더 경로
    permission_type VARCHAR(20),     -- READ, WRITE, NONE 등
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
);


INSERT INTO Users (user_id, password, name, level) VALUES ('asd', '123', 'ASD', 'WORKER');

SELECT * FROM Users;
