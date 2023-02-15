import User from "@/models/user";

class Chat{
    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {boolean} is_group_chat
     * @param {User[]} users
     * @param {string} last_message_text
     * @param {string} last_message_time
     */
    constructor(id, name, is_group_chat, users, last_message_text, last_message_time){
        this.id = id;
        this.name = name;
        this.is_group_chat = is_group_chat;
        this.users = users;
        this.last_message_text = last_message_text;
        this.last_message_time = last_message_time;
        if(!this.is_group_chat){
            this.name = this.users[0].name;
        }
        this.typing = false;
        this.typing_name = "";
        this.typing_timeout_ref = null;
        this.unread_count = 0;
    }

    setTyping(name) {
        this.typing = true;
        this.typing_details.name = name;
        setTimeout(() => {
            this.typing = false;
            this.typing_details.name = "";
        }
        , 3000);
    }

    /**
     * @param {JSON} json
     * @returns {Chat}
     */
    static fromJson(json){
        const chat = new Chat(
            json["id"]||-1,
            json["name"],
            json["is_group_chat"],
            json["users"].map(user => User.fromJson(user)),
            json["last_message"]["message_type"] === "TEXT" ? json["last_message"]["text_content"] : json.last_message.message_type,
            json["last_message"]["created_at"]
        );
        return chat;
    }
}

export default Chat;