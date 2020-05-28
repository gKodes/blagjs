import { SessionManager } from './manager';
import LRU from 'lru-cache';

const lruOptions = {
  max: 50,
  dispose: function (key, value) {
    //TODO: Close the context form the browser
  },
  updateAgeOnGet: true,
  maxAge: 5 * 1000 * 60, // 5 min
};

const Sessions = new Map(); // lruOptions


export class LocalSessionManager extends SessionManager {
  constructor() {
    super();
  }

  getSession(userId) {
    let session = Sessions.get(userId);

    if ( !session ) {
      session = { userId };
      Sessions.set(userId, session);
    }
    
    return session;
  }
}
