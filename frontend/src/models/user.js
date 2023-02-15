class User{
    constructor(id, name, username){
        this.id = id;
        this.name = name;
        this.username = username;
        this.online = false;
        this.lastSeen = null;
    }

    setOnline(lastSeen){
        this.online = true;
        this.lastSeen = lastSeen;
    }

    setOffline(lastSeen){
        this.online = false;
        this.lastSeen = lastSeen;
    }

    static fromJson(json){
        var user = new User(json.id||-1, json.name, json.username);
        return user;
    }
}

export default User;