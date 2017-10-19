use shanggang;
DROP TABLE IF EXISTS dumping_area;


create table dumping_area(
	area_id varchar(100),
	location  varchar(500),
	
	primary key(area_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into dumping_area values("1_2", "31'16'32N,121'45'39E;31'16'44N,12'45'40E");