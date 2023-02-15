const moment = require('moment');

class User{
    constructor(id, name, username){
        this.id = id;
        this.name = name;
        this.username = username;
        this.online = false;
        this.lastSeen = null;
    }

    /**
     * @param {Intl} lastSeen
     */
    setOnline(lastSeen){
        this.online = true;
        if(lastSeen) this.lastSeen = moment(lastSeen).fromNow()
        else this.lastSeen = null;
    }

    /**
     * @param {Intl} lastSeen
     */
    setOffline(lastSeen){
        this.online = false;
        if(lastSeen) this.lastSeen = moment(lastSeen).fromNow()
        else this.lastSeen = null;
    }

    static fromJson(json){
        var user = new User(json.id||-1, json.name, json.username);
        return user;
    }
}

export default User;