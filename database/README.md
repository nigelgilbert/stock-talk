## Functions

<dl>
<dt><a href="#StockTicks.extends">StockTicks.extends(database)</a> ⇒ <code>object</code></dt>
<dd><p>Creates a StockTick table in the sqlite db, extends it with ORM methods.</p>
</dd>
<dt><a href="#StockTicks.insert">StockTicks.insert(params, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Inserts a StockTick row into the database for a yahoo finance event.</p>
</dd>
<dt><a href="#StockTicks.find.bySymbol">StockTicks.find.bySymbol(symbol_name, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Tries to find a row in the StockTicks table by its symbol.</p>
</dd>
<dt><a href="#StockTicks.cull">StockTicks.cull(date, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Deletes all StockTicks older than the given javascript Date object.</p>
</dd>
<dt><a href="#Symbols.extends">Symbols.extends(database)</a> ⇒ <code>object</code></dt>
<dd><p>Creates a Symbol table in the sqlite db, extends it with ORM methods.</p>
</dd>
<dt><a href="#Symbols.insert">Symbols.insert(params, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Inserts a Symbol row into the database.</p>
</dd>
<dt><a href="#Tweets.extends">Tweets.extends(database)</a> ⇒ <code>object</code></dt>
<dd><p>Creates a Tweets table in the sqlite db, extends it with ORM methods.</p>
</dd>
<dt><a href="#Tweets.insert">Tweets.insert(params, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Inserts a Tweet row into the database.</p>
</dd>
<dt><a href="#Tweets.find.bySymbol">Tweets.find.bySymbol(symbol_name, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Tries to find a row in the Tweets table by its symbol.</p>
</dd>
<dt><a href="#Tweets.find.byBody">Tweets.find.byBody(body, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Tries to find a row in the Tweets table by its body.</p>
</dd>
<dt><a href="#Tweets.retweet">Tweets.retweet(body, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Increments a Tweets&#39; retweet count.</p>
</dd>
<dt><a href="#Tweets.cull">Tweets.cull(date, callback)</a> ⇒ <code>object</code></dt>
<dd><p>Deletes all Tweets older than the given javascript Date object.</p>
</dd>
</dl>

<a name="StockTicks.extends"></a>

## StockTicks.extends(database) ⇒ <code>object</code>
Creates a StockTick table in the sqlite db, extends it with ORM methods.

**Returns**: <code>object</code> db - the modified node-sqlite3 database

| Param | Type | Description |
| --- | --- | --- |
| database | <code>object</code> | a node-sqlite3 database |

<a name="StockTicks.insert"></a>

## StockTicks.insert(params, callback) ⇒ <code>object</code>
Inserts a StockTick row into the database for a yahoo finance event.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | a StockTick event specc |
| params.symbol | <code>string</code> | a stock symbol |
| params.value | <code>string</code> | the dollar value of the event |
| callback | <code>callback</code> | called after db write, handles errors |

<a name="StockTicks.find.bySymbol"></a>

## StockTicks.find.bySymbol(symbol_name, callback) ⇒ <code>object</code>
Tries to find a row in the StockTicks table by its symbol.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| symbol_name | <code>string</code> | a stock symbol |
| callback | <code>callback</code> | passed an error or and array of Tweets |

<a name="StockTicks.cull"></a>

## StockTicks.cull(date, callback) ⇒ <code>object</code>
Deletes all StockTicks older than the given javascript Date object.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | anything older than this will be deleted |
| callback | <code>callback</code> | called after deletion, handles errors |

<a name="Symbols.extends"></a>

## Symbols.extends(database) ⇒ <code>object</code>
Creates a Symbol table in the sqlite db, extends it with ORM methods.

**Returns**: <code>object</code> db - the modified node-sqlite3 database

| Param | Type | Description |
| --- | --- | --- |
| database | <code>object</code> | a node-sqlite3 database |

<a name="Symbols.insert"></a>

## Symbols.insert(params, callback) ⇒ <code>object</code>
Inserts a Symbol row into the database.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | a Tweet entry specc |
| params.symbol | <code>string</code> | a stock symbol |
| callback | <code>callback</code> | called after db write, handles errors |

<a name="Tweets.extends"></a>

## Tweets.extends(database) ⇒ <code>object</code>
Creates a Tweets table in the sqlite db, extends it with ORM methods.

**Returns**: <code>object</code> db - the modified node-sqlite3 database

| Param | Type | Description |
| --- | --- | --- |
| database | <code>object</code> | a node-sqlite3 database |

<a name="Tweets.insert"></a>

## Tweets.insert(params, callback) ⇒ <code>object</code>
Inserts a Tweet row into the database.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | a Tweet specc |
| params.symbol | <code>string</code> | a stock symbol |
| params.body | <code>string</code> | the text content of the Tweet |
| callback | <code>callback</code> | called after db write, handles errors |

<a name="Tweets.find.bySymbol"></a>

## Tweets.find.bySymbol(symbol_name, callback) ⇒ <code>object</code>
Tries to find a row in the Tweets table by its symbol.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| symbol_name | <code>string</code> | a stock symbol |
| callback | <code>callback</code> | passed an error and an array of Tweets |

<a name="Tweets.find.byBody"></a>

## Tweets.find.byBody(body, callback) ⇒ <code>object</code>
Tries to find a row in the Tweets table by its body.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> | a Tweet body |
| callback | <code>callback</code> | passed an error and an array of Tweets |

<a name="Tweets.retweet"></a>

## Tweets.retweet(body, callback) ⇒ <code>object</code>
Increments a Tweets' retweet count.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> | a Tweet body |
| callback | <code>callback</code> | called after increment occurs, handles errors |

<a name="Tweets.cull"></a>

## Tweets.cull(date, callback) ⇒ <code>object</code>
Deletes all Tweets older than the given javascript Date object.

**Returns**: <code>object</code> db - a node-sqlite database for method chaining

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | anything older than this will be deleted |
| callback | <code>callback</code> | called after deletion, handles errors |

