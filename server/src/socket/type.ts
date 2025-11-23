export interface ChatMessage {
  username: string;
  text: string;
  room_id: string;
}

export interface User {
  id: string;
  username: string;
  room_id: string;
}
