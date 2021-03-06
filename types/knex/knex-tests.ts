import Knex = require('knex');
import { WriteStream } from 'fs';

// Initializing the Library
let knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

knex = Knex({
  debug: true,
  client: 'mysql',
  connection: {
    socketPath     : '/path/to/socket.sock',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
});

knex = Knex({
  debug: true,
  client: 'pg',
  version: '9.5',
  connection: {
    user    : 'your_database_user',
    password: 'your_database_password',
    server  : 'your_database_server',
    options : {
      database: 'myapp_test'
    }
  }
});

knex = Knex({
  debug: true,
  client: 'mssql',
  connection: {
    user    : 'your_database_user',
    password: 'your_database_password',
    server  : 'your_database_server',
    options : {
      database: 'myapp_test'
    }
  }
});

// Mariasql configuration
knex = Knex({
  debug: true,
  client: 'mariasql',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    db       : 'myapp_test'
  }
});

// Mysql configuration
knex = Knex({
  debug: true,
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    db       : 'myapp_test',
    trace: false
  }
});

// Pooling
knex = Knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "your_database_user",
        password: "your_database_password",
        database: "myapp_test"
    },
    pool: {
        min: 0,
        max: 7,
        afterCreate: (connection: any, callback: (...args: any[]) => void) => callback(null, connection),
        beforeDestroy: (connection: any, callback: (...args: any[]) => void) => callback(null, connection)
    }
});

// acquireConnectionTimeout
knex = Knex({
  debug: true,
  client: 'mysql',
  connection: {
    socketPath     : '/path/to/socket.sock',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  },
  acquireConnectionTimeout: 60000,
});

// Pure Query Builder without a connection
knex = Knex({});

// Pure Query Builder without a connection, using a specific flavour of SQL
knex = Knex({
  client: 'pg'
});

// searchPath
knex = Knex({
    client: 'pg',
    searchPath: 'public',
});
knex = Knex({
    client: 'pg',
    searchPath: ['public', 'private'],
});

// postProcessResponse
knex = Knex({
  client: 'pg',
  postProcessResponse(result, queryContext) {
    return result;
  }
});

// wrapIdentifier
knex = Knex({
  client: 'pg',
  wrapIdentifier(value, origImpl, queryContext) {
    return origImpl(value + 'foo');
  }
});

// useNullAsDefault
knex = Knex({
  client: 'sqlite',
  useNullAsDefault: true,
});

// Using custom client
class TestClient extends Knex.Client {}

knex = Knex({
  client: TestClient,
});

knex('books').insert({title: 'Test'}).returning('*').toString();

// Migrations
knex = Knex({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  },
  migrations: {
    tableName: 'migrations'
  },
  seeds: {
    directory: 'seeds'
  }
});

// Knex Query Builder
knex.select('title', 'author', 'year').from('books');
knex.select({ name: 'title', writer: 'author' }).from(knex.raw('books'));
knex.select().table('books');

knex.avg('sum_column1').from(() => {
  this.sum('column1 as sum_column1').from('t1').groupBy('column1').as('t1');
}).as('ignored_alias');

knex.column('title', 'author', 'year').select().from('books');
knex.column(['title', 'author', 'year']).select().from('books');
knex.column('title', { by: 'author' }, 'year').select().from('books');
knex.column({ title: 'title', by: 'author', published: 'year' }).select().from('books');
knex.select('*').from('users');

knex('users').where({
  first_name: 'Test',
  last_name:  'User'
}).select('id');

knex('users').where('id', 1);

knex('users').where(() => {
  this.where('id', 1).orWhere('id', '>', 10);
}).orWhere({name: 'Tester'});

knex('users').where('votes', '>', 100);

// Let null be used in a two or 3 parameter where filter
knex('users').where('votes', null);
knex('users').where('votes', 'is not', null);

// Using Raw in where
knex('users').where(knex.raw('votes + 1'), '>', 101);
knex('users').where(knex.raw('votes + 1'), '>', knex.raw('100 + 1'));
knex('users').where('votes', '>', knex.raw('100 + 1'));

let subquery = knex('users').where('votes', '>', 100).andWhere('status', 'active').orWhere('name', 'John').select('id');
knex('accounts').where('id', 'in', subquery);

knex.select('name').from('users')
  .whereIn('id', [1, 2, 3])
  .orWhereIn('id', [4, 5, 6]);

subquery = knex.select('id').from('accounts');
knex.select('name').from('users')
  .whereIn('account_id', subquery);

knex('users')
  .where('name', '=', 'John')
  .orWhere(() => {
    this.where('votes', '>', 100).andWhere('title', '<>', 'Admin');
  });

knex('users').whereNotIn('id', [1, 2, 3]);

knex('users').where('name', 'like', '%Test%').orWhereNotIn('id', [1, 2, 3]);

knex('users').whereNull('updated_at');

knex('users').whereNotNull('created_at');

knex('users').whereExists(() => {
  this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
});

knex('users').whereExists(knex.select('*').from('accounts').whereRaw('users.account_id = accounts.id'));

knex('users').whereNotExists(() => {
  this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
});

knex('users').whereBetween('votes', [1, 100]);

knex('users').whereNotBetween('votes', [1, 100]);

knex('users').whereRaw('id = ?', [1]);
knex('users').whereRaw('id = :id', { id: 1 });
knex('users').whereRaw('id = :id', { id: knex('users').select('id').limit(1) });

// Aggregate functions can use string/object parameters
knex('users').count();
knex('users').count('*');
knex('users').count('id', 'votes');
knex('users').count({count: '*'});
knex('users').count({count: ['id', 'votes']});
knex('users').count({count: knex.raw('*')});
knex('users').count(knex.raw('id'));

knex('users').countDistinct('votes');
knex('users').countDistinct(knex.raw('votes'));
knex('users').countDistinct({votes: 'votes'});
knex('users').countDistinct({votes: knex.raw('votes')});

knex('users').avg('id');
knex('users').avg('id', 'votes');
knex('users').avg({avg: 'id'});
knex('users').avg({avg: ['id', 'votes']});
knex('users').avg({ab: knex.raw('a + b')});
knex('users').avg(knex.raw('votes'));

knex('users').avgDistinct('votes');
knex('users').avgDistinct(knex.raw('votes'));
knex('users').avgDistinct({votes: 'votes'});
knex('users').avgDistinct({votes: knex.raw('votes')});

knex('users').max('id');
knex('users').max('id', 'votes');
knex('users').max({max: 'id'});
knex('users').max({max: ['id', 'votes']});
knex('users').max({ab: knex.raw('a + b')});
knex('users').max(knex.raw('votes'));

knex('users').min('id');
knex('users').min('id', 'votes');
knex('users').min({min: 'id'});
knex('users').min({min: ['id', 'votes']});
knex('users').min({ab: knex.raw('a + b')});
knex('users').min(knex.raw('votes'));

knex('users').sum('id');
knex('users').sum('id', 'votes');
knex('users').sum({sum: 'id'});
knex('users').sum({sum: ['id', 'votes']});
knex('users').sum({ab: knex.raw('a + b')});
knex('users').sum(knex.raw('votes'));

knex('users').sumDistinct('votes');
knex('users').sumDistinct(knex.raw('votes'));
knex('users').sumDistinct({votes: 'votes'});
knex('users').sumDistinct({votes: knex.raw('votes')});

// Join methods
knex('users')
  .join('contacts', 'users.id', '=', 'contacts.user_id')
  .select('users.id', 'contacts.phone');

knex('users')
  .join('contacts', { 'users.id': 12355 })
  .select('users.id', 'contacts.phone');

knex('users')
  .join('contacts', 'users.id', 'contacts.user_id')
  .select('users.id', 'contacts.phone');

knex('users')
  .join(knex('contacts').select('user_id', 'phone').as('contacts'), 'users.id', 'contacts.user_id')
  .select('users.id', 'contacts.phone');

knex('users')
  .join(knex('contacts').select('user_id', 'phone').as('contacts'), { 'users.id': 'contacts.user_id' })
  .select('users.id', 'contacts.phone');

knex.select('*').from('users').join(knex('accounts').select('id', 'owner_id').as('accounts'), () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').join('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').join('accounts', (join: Knex.JoinClause) => {
  if (this !== join) {
    throw new Error("join() callback call semantics wrong");
  }
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('user').join('contacts', () => {
  this.on('users.id', '=', knex.raw(7));
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNotIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnNotIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnNotIn('contacts.id', [7, 15, 23, 41]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNotNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnNotNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnNotNull('contacts.email');
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNotExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnNotExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnNotExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNotBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').andOnNotBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').orOnNotBetween('contacts.id', [5, 30]);
});

knex.select('*').from('users').join('contacts', () => {
  this.on('users.id', '=', 'contacts.id').onNotExists(() => {
    this.select('*').from('accounts').whereRaw('users.account_id = accounts.id');
  });
});

knex.select('*').from('users').join('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').join('accounts', 'accounts.type', knex.raw('?', ['admin']));

knex.raw('? ON CONFLICT DO NOTHING', [knex('account').insert([{}])]);
knex.raw('select * from users where id = ? OR id = ?',
  1,
  knex('users').select('id').limit(1),
);
knex.raw('select * from users where id = :user_id', { user_id: 1 });
knex.raw('select * from users where id = :user_id_query', {
  user_id_query: knex('ids').select('id').limit(1)
});

knex.from('users').innerJoin('accounts', 'users.id', 'accounts.user_id');

knex.table('users').innerJoin('accounts', 'users.id', '=', 'accounts.user_id');

knex('users').innerJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex('users').innerJoin('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').leftJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').leftJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').leftJoin('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').leftJoin('accounts', (join) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
  .andOn((join2) => {
    join2.on('col1', 'col2').orOn('col3', 'col4');
  });
});

knex.select('*').from('users').leftOuterJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').leftOuterJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').rightJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').rightJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').rightJoin('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').rightOuterJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').rightOuterJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').outerJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').outerJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').outerJoin('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').fullOuterJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('users').fullOuterJoin('accounts', () => {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').fullOuterJoin('accounts', (join: Knex.JoinClause) => {
  join.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id');
});

knex.select('*').from('users').crossJoin('accounts', 'users.id', 'accounts.user_id');

knex.select('*').from('accounts').joinRaw('natural full join table1').where('id', 1);

knex.select('*').from('accounts').join(knex.raw('natural full join table1')).where('id', 1);

knex.select('*').from('accounts')
  .join(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .leftJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .leftOuterJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .rightJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .rightOuterJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .innerJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .crossJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .fullOuterJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');
knex.select('*').from('accounts')
  .outerJoin(() => {
    this.select('*').from('accounts').as('special_accounts');
  }, 'special_accounts.a', '=', 'accounts.b');

knex('customers')
  .distinct('first_name', 'last_name')
  .select();

knex('users').groupBy('count');

knex.select('year', knex.raw('SUM(profit)')).from('sales').groupByRaw('year WITH ROLLUP');

knex('users').orderBy('name', 'desc');

knex.select('*').from('table').orderByRaw('col NULLS LAST DESC');

knex('books').insert({title: 'Slaughterhouse Five'});

knex('coords').insert([{x: 20}, {y: 30},  {x: 10, y: 20}]);

knex.insert([{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}], 'id').into('books');
knex.insert([{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}], ['id', 'title']).into('books');

knex('books')
  .returning('id')
  .insert({title: 'Slaughterhouse Five'});

knex('books')
  .returning('id')
  .insert([{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}]);

knex.batchInsert('books', [{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}], 200);
knex.batchInsert('books', [{title: 'Catcher In The Rye'}, {title: 'Pride And Prejudice'}]);
knex.queryBuilder().table('books');

knex('books').where('published_date', '<', 2000).update({status: 'archived'});
knex('books').where('published_date', '<', 2000).update({status: 'archived'}, 'id');
knex('books').where('published_date', '<', 2000).update({status: 'archived'}, ['id', 'title']);

knex('books').update('title', 'Slaughterhouse Five');
knex('books').update('title', 'Slaughterhouse Five', 'id');
knex('books').update('title', 'Slaughterhouse Five', ['id', 'title']);

knex('accounts').where('activated', false).del();
knex('accounts').where('activated', false).del('id');
knex('accounts').where('activated', false).del(['id', 'title']);
knex('accounts').where('activated', false).delete();
knex('accounts').where('activated', false).delete('id');
knex('accounts').where('activated', false).delete(['id', 'title']);

knex.with('old_books', (qb) => {
  qb.select('*').from('books').where('published_date', '<', 1970);
}).select('*').from('old_books');

knex.with('new_books', knex.raw('select * from books where published_date >= 2016'))
  .select('*').from('new_books');

knex.with('new_books', 'select * from books where published_date >= :year', { year: 2016 })
  .select('*').from('new_books');

knex.with('new_books', 'select * from books where published_date >= ?', [2016])
  .select('*').from('new_books');

knex.with('new_books', knex.select('*').from('books').where("published_date", ">=", 2016))
  .select('*').from('new_books');

knex.withRaw('recent_books', 'select * from books where published_date >= :year', { year: 2013 })
  .select('*').from('recent_books');

knex.withRaw('recent_books', knex.raw('select * from books where published_date >= ?', [2013]))
  .select('*').from('recent_books');

knex.withWrapped("antique_books", (qb) => {
  qb.select('*').from('books').where('published_date', '<', 1899);
}).select('*').from('antique_books');

knex.withWrapped('new_books', knex.select('*').from('books').where("published_date", ">=", 2016))
  .select('*').from('new_books');

const someExternalMethod: (...args: any[]) => void = () => {};

knex.transaction((trx) => {
  knex('books').transacting(trx).insert({name: 'Old Books'})
    .then((resp) => {
      const id = resp[0];
      someExternalMethod(id, trx);
    })
    .then(trx.commit)
    .catch(trx.rollback);
}).then(() => {
  console.log('Transaction complete.');
}).catch((err) => {
  console.error(err);
});

knex.transaction((trx) => {
  knex('tableName')
    .transacting(trx)
    .forUpdate()
    .select('*');

  knex('tableName')
    .transacting(trx)
    .forShare()
    .select('*');
});

const transactionReturnValue = knex.transaction((trx) => {
  return knex("table")
    .insert({ foo: "bar" })
    .returning(["id"])
    .then((result) => {
      return result[0].id as number;
    });
});

// Tests that the transaction has kept the type of its return value by referencing a method of number
transactionReturnValue.then(value => value.toExponential);

knex('users').count('active');

knex('users').min('age');

knex('users').min('age as a');

knex('users').max('age');

knex('users').max('age as a');

knex('users').sum('products');

knex('users').sum('products as p');

knex('users').avg('age');

knex('users').avg('age as a');

knex('accounts')
  .where('userid', '=', 1)
  .increment('balance', 10);

knex('accounts').where('userid', '=', 1).decrement('balance', 5);

knex('accounts').truncate();

knex.table('users').first('id').then((ids) => {
  console.log(ids);
});

knex.table('users').first('id', 'name').then((row) => {
  console.log(row);
});

knex.table('users').first(knex.raw('round(sum(products)) as p')).then((row) => {
  console.log(row);
});

knex.table('users').select('*').clearSelect().select('id').then((rows) => {
  console.log(rows);
});

knex('accounts').where('userid', '=', 1).clearWhere().select().then((rows) => {
  console.log(rows);
});

// Using trx as a query builder:
knex.transaction((trx) => {
  const info: any = {};
  const books: any[] = [
    {title: 'Canterbury Tales'},
    {title: 'Moby Dick'},
    {title: 'Hamlet'}
  ];

  return trx
    .insert({name: 'Old Books'}, 'id')
    .into('catalogues')
    .then((ids) => {
      return Promise.all(books.map((book: any) => {
        book.catalogue_id = ids[0];
        // Some validation could take place here.
        return trx.insert(info).into('books');
      }));
    });
})
.then((inserts) => {
  console.log(inserts.length + ' new books saved.');
})
.catch((error) => {
  // If we get here, that means that neither the 'Old Books' catalogues insert,
  // nor any of the books inserts will have taken place.
  console.error(error);
});

// Using trx as a transaction object:
knex.transaction<{ length: number }>((trx) => {
  trx.raw('');

  trx.on('query-error', (error: Error) => {
    console.error(error);
  });

  trx.savepoint((nestedTrx) => {
    nestedTrx.rollback(new Error('something went terribly wrong'));
  });

  trx.transaction((nestedTrx) => {
    nestedTrx.commit();
  });

  const info: any = {};
  const books: any[] = [
    {title: 'Canterbury Tales'},
    {title: 'Moby Dick'},
    {title: 'Hamlet'}
  ];

  knex.insert({name: 'Old Books'}, 'id')
    .into('catalogues')
    .transacting(trx)
    .then((ids) => {
      return Promise.all(books.map((book: any) => {
        book.catalogue_id = ids[0];

        // Some validation could take place here.

        return knex.insert(info).into('books').transacting(trx);
      }));
    })
    .then(trx.commit)
    .catch(trx.rollback);
})
.then((inserts) => {
  console.log(inserts.length + ' new books saved.');
})
.catch((error) => {
  // If we get here, that means that neither the 'Old Books' catalogues insert,
  // nor any of the books inserts will have taken place.
  console.error(error);
});

// transacting handles undefined
knex.insert({ name: 'Old Books'}).transacting(undefined);

knex.schema.withSchema("public").hasTable("table"); // $ExpectType Bluebird<boolean>

knex.schema.createTable('users', (table) => {
  table.increments();
  table.string('name');
  table.enu('favorite_color', ['red', 'blue', 'green']);
  table.timestamps();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamps(true, true);
});

knex.schema.alterTable('users', (table) => {
  table.string('role').nullable();
});

knex.schema.renameTable('users', 'old_users');

knex.schema.dropTable('users');

knex.schema.hasTable('users').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('first_name', 100);
      t.string('last_name', 100);
      t.text('bio');
    });
  }
});

const tableName = '';
const columnName = '';
knex.schema.hasColumn(tableName, columnName);

knex.schema.dropTableIfExists('users');

knex.schema.table('users', (table) => {
  table.dropColumn('name');
  table.string('first_name');
  table.string('last_name');
});

knex.schema.raw("SET sql_mode='TRADITIONAL'")
.table('users', (table) => {
    table.dropColumn('name');
    table.string('first_name');
    table.string('last_name');
    table.dropUnique(["name1", "name2"], "index_name");
    table.dropUnique(["name1", "name2"]);
    table.dropPrimary();
    table.dropPrimary("constraint_name");
});

knex('users')
  .select(knex.raw('count(*) as user_count, status'))
  .where(knex.raw(1))
  .orWhere(knex.raw('status <> ?', [1]))
  .groupBy('status');

knex.raw('select * from users where id = ?', [1]).then((resp) => {
    // ...
  });

(() => {
  const subcolumn = knex.raw('select avg(salary) from employee where dept_no = e.dept_no')
    .wrap('(', ') avg_sal_dept');

  knex.select('e.lastname', 'e.salary', subcolumn)
    .from('employee as e')
    .whereRaw('dept_no = e.dept_no');
})();

(() => {
  const subcolumn = knex.avg('salary')
    .from('employee')
    .whereRaw('dept_no = e.dept_no')
    .as('avg_sal_dept');

  knex.select('e.lastname', 'e.salary', subcolumn)
    .from('employee as e')
    .whereRaw('dept_no = e.dept_no');
})();

const x = 1;
knex.select('name').from('users')
  .where('id', '>', 20)
  .andWhere('id', '<', 200)
  .limit(10)
  .offset(x)
  .then((rows) => {
    return rows.map((r: any) => r.name);
  })
  .then((names: any) => {
    return knex.select('id').from('nicknames').whereIn('nickname', names);
  })
  .then((rows) => {
    console.log(rows);
  })
  .catch((error) => {
    console.error(error);
  });

knex.select('*').from('users').where({name: 'Tim'})
  .then((rows) => {
    return knex.insert({user_id: rows[0].id, name: 'Test'}, 'id').into('accounts');
  }).then((id) => {
    console.log('Inserted Account ' + id);
  }).catch((error) => {
    console.error(error);
  });

knex.insert({id: 1, name: 'Test'}, 'id').into('accounts')
  .catch((error) => {
    console.error(error);
  }).then(() => {
    return knex.select('*').from('accounts').where('id', 1);
  }).then((rows) => {
    console.log(rows[0]);
  }).catch((error) => {
    console.error(error);
  });

const query: any = () => {};
query.then((x: any) => {
    // doSideEffectsHere(x);
    return x;
});

knex.select('name').from('users').limit(10).then((rows: any[]): string[] => {
  return rows.map((row: any): string => {
    return row.name;
  });
}).then((names: string[]) => {
  console.log(names);
}).catch((e: Error) => {
  console.error(e);
});

knex.select('name').from('users').limit(10).then((rows: any[]) => {
  return rows.reduce((memo: any, row: any) => {
    memo.names.push(row.name);
    memo.count++;
    return memo;
  }, {count: 0, names: []});
}).then((obj: any) => {
  console.log(obj);
}).catch((e: Error) => {
  console.error(e);
});

knex.select('name').from('users')
  .limit(10)
  .then(console.log.bind(console))
  .catch(console.error.bind(console));

const values: any[] = [];

knex.insert(values).into('users')
  .then(() => {
    return {inserted: true};
  });

knex.select('name').from('users')
  .where('id', '>', 20)
  .andWhere('id', '<', 200)
  .limit(10)
  .offset(x);

// Retrieve the stream:
let stream = knex.select('*').from('users').stream();
const writableStream: NodeJS.WritableStream = new WriteStream();
stream.pipe(writableStream);

// With options:
stream = knex.select('*').from('users').stream({highWaterMark: 5});
stream.pipe(writableStream);

// Use as a promise:
(() => {
    knex
        .select("*")
        .from("users")
        .where(knex.raw("id = ?", [1]))
        .stream((stream: any) => {
            stream.pipe(writableStream);
        })
        .then(() => {
            // ...
        })
        .catch((e: Error) => {
            console.error(e);
        });
})();

stream = knex.select('*').from('users').pipe(writableStream);
const app: any = () => {};

knex.select('*')
  .from('users')
  .on('query', (data: any) => {
    app.log(data);
  })
  .then(() => {
    // ...
  });

knex.select('*').from('users').where(knex.raw('id = ?', [1])).toString();

knex.select('*').from('users').where(knex.raw('id = ?', [1])).toSQL();

//
// Callback functions
//
knex('users')
  .select('*')
  .join('contacts', (builder) => {
    this.on((builder: any) => {
      let self: Knex.JoinClause = this;
      self = builder;
    }).andOn((builder: any) => {
      let self: Knex.JoinClause = this;
      self = builder;
    }).orOn((builder: any) => {
      let self: Knex.JoinClause = this;
      self = builder;
    }).onExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    }).orOnExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    }).andOnExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    }).onNotExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    }).andOnNotExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    }).orOnNotExists((builder: any) => {
      let self: Knex.QueryBuilder = this;
      self = builder;
    });
  }).where((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).orWhere((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).andWhere((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).whereIn('column', (builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).orWhereIn('column', (builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).whereNotIn('column', (builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).orWhereNotIn('column', (builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).whereWrapped((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).union((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).unionAll((builder) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }).modify((builder, aBool) => {
    let self: Knex.QueryBuilder = this;
    self = builder;
  }, true);

//
// Migrations
//
const config = {
  directory: "./migrations",
  extension: "js",
  tableName: "knex_migrations",
  disableTransactions: false
};
knex.migrate.make(name, config);
knex.migrate.make(name);

knex.migrate.latest(config);
knex.migrate.latest();

knex.migrate.rollback(config);
knex.migrate.rollback();

knex.migrate.currentVersion(config);
knex.migrate.currentVersion();

knex.seed.make(name, config);
knex.seed.make(name);

knex.seed.run(config);
knex.seed.run();

knex.schema
  .dropTableIfExists('A')
  .createTable('A', table => {
    table.integer('C').unsigned().references('B.id').notNullable();
    table.integer('D').primary('PK').notNullable();
    table.string('E').unique('UX').nullable();
    table.foreign('E', 'FK').references('F.id');
    table.timestamp('T', false).notNullable();
  });

// creating table in MySQL with binary primary key with known field length
knex.schema.createTable('testTable', (table) => {
    table.binary('binaryKey', 16).primary(); // will make table with binaryKey type BINARY(16)
});

// allow creating decimal column that can store that can store numbers of any
// precision and scale. (Only supported for Oracle, SQLite, Postgres)
knex = Knex({
    client: 'pg'
});

knex.schema
    .dropTableIfExists('testTable')
    .createTable('testTable', (table) => {
        table.decimal('dec', null);
    })
    .dropTable('testTable');

// allow specifying an alias for a table name
knex.schema
    .dropTableIfExists('foo')
    .dropTableIfExists('bar')
    .createTable('foo', (table) => {
        table.uuid('id').primary();
    })
    .createTable('bar', (table) => {
        table.uuid('id').primary();
    });

knex({
    table1: 'foo',
    table2: 'bar'
})
    .select({
        table1Id: 'table1.id',
        table2Id: 'table2.id'
    });

knex('characters')
    .select()
    .whereIn(['name', 'class'], [['Bar', 'Fighter'], ['Foo', 'Druid']]);

knex('characters')
    .select()
    .whereIn('name', knex('characters').select('name'));
knex('characters')
    .select()
    .whereIn(['name', 'class'], knex('characters').select('name', 'class'));

knex('characters')
    .select()
    .whereIn('name', () => {
        this.select('name').from('characters');
    });
knex('characters')
    .select()
    .whereIn(['name', 'class'], () => {
        this.select('name', 'class').from('characters');
    });

knex('characters')
    .select()
    .where({ name: 'Bar', class: 'Fighter' })
    .union(knex('characters').select().where({ name: 'Foo', class: 'Druid' }));
knex('characters')
    .select()
    .where({ name: 'Bar', class: 'Fighter' })
    .union([knex('characters').select().where({ name: 'Foo', class: 'Druid' })]);
knex('characters')
    .select()
    .where({ name: 'Bar', class: 'Fighter' })
    .union(
        knex('characters').select().where({ name: 'Foo', class: 'Druid' }),
        knex('characters').select().where({ name: 'Baz', class: 'Paladin' })
    );
