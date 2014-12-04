CREATE DATABASE IF NOT EXISTS  TrendyStatus;

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`Status`(
     `ID` int NOT NULL,
     `StatusName` varchar(50),
     `StatusUrl` varchar(50),
     PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`StatusMeta`(
     `ID` int NOT NULL,
     `StatusID` int NOT NULL unique,
     `LastResponseCode` int,
     `LastTestTime` DATETIME,
     `CreationDate` DATETIME DEFAULT NOW(),
     `Description` varchar(255),
     `Visibility` tinyint(1),
     PRIMARY KEY (`ID`, `StatusID`),
     FOREIGN KEY (`StatusID`) REFERENCES Status(ID)
);


-- CREATE TABLE IF NOT EXISTS `User`(
--      `ID` int NOT NULL AUTO_INCREMENT,
--      `Email` varchar(50) NOT NULL,
--      `Password` varchar(50) NOT NULL,
--      PRIMARY KEY(`ID`,`Email`)
-- )

-- CREATE TABLE UserMeta(
--      int StatusID NOT NULL,
--      int code,
--      varchar(255) description,
--      bit visibility
-- )

-- CREATE TABLE Session(
     
-- )

- status:

drop table StatusMeta;

drop table status;

truncate table StatusMeta;

truncate table Status;

Use TrendyStatus;

select * from Status;

select * from Status where ID = 31621;

select * from StatusMeta;

show create table StatusMeta;


