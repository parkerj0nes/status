CREATE DATABASE IF NOT EXISTS  `TrendyStatus`;

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`Status`(
     `ID` int NOT NULL AUTO_INCREMENT,
     `StatusName` varchar(50),
     `StatusUrl` varchar(50),
     PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `TrendyStatus`.`StatusMeta`(
     `ID` int NOT NULL AUTO_INCREMENT,
     `StatusID` int NOT NULL,
     `LastResponseCode` int,
     `LastTestTime` DATETIME,
     `CreationDate` DATETIME DEFAULT NOW(),
     `description` varchar(255),
     `visibility` bit,
     PRIMARY KEY (`ID`),
     FOREIGN KEY (`StatusID`) REFERENCES Status(ID)
);


CREATE TABLE IF NOT EXISTS `User`(
     `ID` int NOT NULL AUTO_INCREMENT,
     `Email` varchar(50) NOT NULL,
     `Password` varchar(50) NOT NULL,
     PRIMARY KEY(`ID`,`Email`)
)

CREATE TABLE UserMeta(
     int StatusID NOT NULL,
     int code,
     varchar(255) description,
     bit visibility
)

CREATE TABLE Session(
     
)

- status:
