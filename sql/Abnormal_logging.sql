use shanggang;
DROP TABLE IF EXISTS Abnormal_logging;


create table Abnormal_logging(
	mmsi varchar(100),
	abnormal_type varchar(100),
	lon varchar(100),
	lat varchar(100),
	time datetime,
	speed varchar(100),
	
	primary key(mmsi,time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
