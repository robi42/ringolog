This is a minimal [RingoJS] microblogging application.

First, in case you don't have `ringo-hibernate` installed yet:

    ringo-admin install robi42/ringo-hibernate

Initially, create MySQL DB, e.g.:

    mysql -uroot < app/config/init-mysql.sql

Now, to run the app launch ringo with the main script, e.g.:

    ringo app/main.js

Then point your browser to this URL:

    http://localhost:8080/

  [RingoJS]: http://ringojs.org/
