CREATE DATABASE IF NOT EXISTS TrendyStatus;

CREATE TABLE IF NOT EXISTS `Status` (
	`ID` int(11) NOT NULL AUTO_INCREMENT,
	`StatusName` varchar(50),
	`StatusUrl` varchar(255)

)
CREATE TABLE IF NOT EXISTS `StatusMeta` (
	`ID` int(11) NOT NULL AUTO_INCREMENT,
	`StatusName` varchar(50),
	`StatusUrl` varchar(255)

)

