USE shanggang;

DROP TABLE IF EXISTS fleet;

CREATE TABLE `fleet`(
	`fleet_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`name` varchar(100) NOT NULL,
	`address` varchar(100) NOT NULL,
	`contact` varchar(200) NOT NULL,
	`cellphone` varchar(100) NOT NULL,

	PRIMARY KEY (`fleet_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8£»