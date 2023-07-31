-- name: get_phone_number$
SELECT phone_number FROM users WHERE user_email = :email;

-- name: get_user_past_bookings
SELECT c.id, c.start_time, c.end_time, c.capacity, fl.place, tl.place, c.owner_email, u.name, u.phone_number
  FROM cab_booking c
    INNER JOIN traveller t ON c.id = t.cab_id
    INNER JOIN locations fl ON fl.id = c.from_loc
    INNER JOIN locations tl ON tl.id = c.to_loc
    INNER JOIN users u ON u.user_email = c.owner_email
  WHERE t.user_email = :email
    AND c.end_time < (SELECT CURRENT_TIMESTAMP);

-- name: get_user_future_bookings
SELECT c.id, c.start_time, c.end_time, c.capacity, fl.place, tl.place, c.owner_email, u.name, u.phone_number
  FROM cab_booking c
    INNER JOIN traveller t ON c.id = t.cab_id
    INNER JOIN locations fl ON fl.id = c.from_loc
    INNER JOIN locations tl ON tl.id = c.to_loc
    INNER JOIN users u ON u.user_email = c.owner_email
  WHERE t.user_email = :email
    AND c.end_time > (SELECT CURRENT_TIMESTAMP);

-- name: get_all_active_bookings
SELECT c.id, c.start_time, c.end_time, c.capacity, fl.place, tl.place, c.owner_email, u.name, u.phone_number
  FROM cab_booking c
    INNER JOIN locations fl ON fl.id = c.from_loc
    INNER JOIN locations tl ON tl.id = c.to_loc
    INNER JOIN users u ON u.user_email = c.owner_email
  WHERE c.end_time > (SELECT CURRENT_TIMESTAMP);

-- name: filter_times
SELECT c.id, c.start_time, c.end_time, c.capacity, fl.place, tl.place, c.owner_email, u.name, u.phone_number
  FROM cab_booking c
    INNER JOIN locations fl ON fl.id = c.from_loc
    INNER JOIN locations tl ON tl.id = c.to_loc
    INNER JOIN users u ON u.user_email = c.owner_email
  WHERE c.end_time > (SELECT CURRENT_TIMESTAMP)
    AND ((c.start_time <= :start_time AND c.end_time >= :start_time)
      OR (c.end_time >= :end_time AND c.start_time <= :end_time)
      OR (:start_time <= c.start_time AND :end_time >= c.end_time));

-- name: filter_all
SELECT c.id, c.start_time, c.end_time, c.capacity, fl.place, tl.place, c.owner_email, u.name, u.phone_number
  FROM cab_booking c
    INNER JOIN locations fl ON fl.id = c.from_loc
    INNER JOIN locations tl ON tl.id = c.to_loc
    INNER JOIN users u ON u.user_email = c.owner_email
  WHERE c.end_time > (SELECT CURRENT_TIMESTAMP)
    AND fl.id= :from_loc AND tl.id = :to_loc
    AND ((c.start_time <= :start_time AND c.end_time >= :start_time)
      OR (c.end_time >= :end_time AND c.start_time <= :end_time)
      OR (:start_time <= c.start_time AND :end_time >= c.end_time));

-- name: get_travellers
SELECT t.user_email, t.comments, u.name, u.phone_number
  FROM traveller t
    INNER JOIN users u ON t.user_email = u.user_email
  WHERE t.cab_id = :cab_id;
