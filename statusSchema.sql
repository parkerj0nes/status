CREATE DATABASE IF NOT EXISTS  TrendyStatus;

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`status`(
     `ID` int NOT NULL,
     `StatusName` varchar(50),
     `StatusUrl` varchar(50),
     PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`statusmeta`(
     `ID` int NOT NULL,
     `StatusID` int NOT NULL unique,
     `LastResponseCode` int,
     `LastTestTime` DATETIME,
     `CreationDate` DATETIME,
     `Description` varchar(255),
     `Visibility` tinyint(1),
     PRIMARY KEY (`ID`, `StatusID`),
     FOREIGN KEY (`StatusId`) REFERENCES `status`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);