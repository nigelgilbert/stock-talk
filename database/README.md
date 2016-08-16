I. What data do I need stored?

  - Symbols
    - symbol_id
    - symbolname

  - Ticks
    - id
    - symbol_id
    - type (TODO)
    - value

  - Tweets
    - id
    - symbol_id
    - last_accessed
    - body
    - retweet count

II. What transactions do I we need?

  1. Find tweet by body / see if tweet exists
  2. Find tweet by symbol
  3. Append tweet's repeat count
  4. delete tweets that are old
  5. insert tick data into the db
  6. delete tick data that is old
  7. get the 10 most tweeted about symbols


III. Making the tables:

  CREATE TABLE Example_Table (
    t  TEXT,     -- text affinity by rule 2
    nu NUMERIC,  -- numeric affinity by rule 5
    i  INTEGER,  -- integer affinity by rule 1
    r  REAL,     -- real affinity by rule 4
    no BLOB      -- no affinity by rule 3
  );

  CREATE TABLE Symbols (
    symbol_id INTEGER,
    symbol TEXT PRIMARY KEY,
  );

  CREATE TABLE Ticks (
    symbol_id INTEGER,
    value REAL
  );

  CREATE TABLE Tweets (
    symbol_id INTEGER,
    last_accessed INTEGER,
    body TEXT,
    retweet_count INTEGER DEFAULT 0
  );

IV. SQL query implementation

  db.run("SELECT * FROM Tweets Where body=?, string);

  1.
    SELECT *
    FROM Tweets
    WHERE body = ?

  2.
    SELECT *
    FROM Tweets
    WHERE symbol_id IN(
      SELECT symbol_id
      FROM Symbols
      WHERE symbol = ?
    )

  3.
    UPDATE Tweets
    SET retweet_count = retweet_count + 1
    WHERE body = ?

  4.
    DELETE FROM Tweets
    WHERE last_accessed > ?

  5.
    INSERT INTO Ticks (symbol_id, value)
    VALUES (?, ?)

  6.
    DELETE FROM Ticks
    WHERE last_accessed > ?

  7.
    SELECT *
    FROM Tweets
    ORDER BY retweet_count DESC,
    LIMIT 10
