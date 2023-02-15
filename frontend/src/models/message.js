import User from "@/models/user";

const moment = require('moment');

class Message{
    constructor(id, sender, text_content, message_type, file_mime_type, file_stored_name, file_name, is_notification_message, is_replied, replied_to_id, timestamp) {
        this.id = id;
        this.sender = sender;
        this.text_content = text_content;
        this.message_type = message_type;
        this.file_mime_type = file_mime_type;
        this.file_stored_name = file_stored_name;
        this.file_name = file_name;
        this.is_notification_message = is_notification_message;
        this.is_replied = is_replied;
        this.replied_to_id = replied_to_id;
        this.timestamp = timestamp;
    }

    static fromJSON(json){
        return new Message(
            json["id"],
            User.fromJson(json["sender"]),
            json["text_content"],
            json["message_type"],
            json["file_mime_type"],
            json["file_stored_name"],
            json["file_name"],
            json["is_notification_message"],
            json["is_replied"],
            json["replied_to"] ? json["replied_to"]["id"] : null,
            moment(json["timestamp"]).fromNow()
        );
    }
}

export default Message