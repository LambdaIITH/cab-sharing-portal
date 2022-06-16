-- name:cab_booking<!
insert into cab_booking (id,date,start_time,end_time,comments,capacity,from_loc,to_loc) 
values (:id, :date, :start_time, :end_time, :comments, :capacity, :from_loc, :to_loc)
returning id;

-- name:add_traveller!
insert into traveller (id,user_email)
values  (:id,:user_email); 