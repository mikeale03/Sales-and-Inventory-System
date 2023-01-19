import PouchDb from 'pouchdb';
import pouchDbFind from 'pouchdb-find';

PouchDb.plugin(pouchDbFind);

export default PouchDb;
