interface supportTicketAttributes {
  id: string;
  userId: string;
  agentId?: string;
  subject: string;
  importance: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "OPEN" | "REPLIED" | "CLOSED";
  messages?: ChatMessage[];
  type?: "LIVE" | "TICKET";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type supportTicketPk = "id";
type supportTicketId = supportTicket[supportTicketPk];
type supportTicketOptionalAttributes =
  | "id"
  | "agentId"
  | "importance"
  | "status"
  | "messages"
  | "type"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type supportTicketCreationAttributes = Optional<
  supportTicketAttributes,
  supportTicketOptionalAttributes
>;
