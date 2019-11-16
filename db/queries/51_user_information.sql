SELECT first_name, last_name, email, phone_number
FROM users
WHERE usertoken = $1;