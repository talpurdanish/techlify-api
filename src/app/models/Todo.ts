export class Todo {
  Id: string;
  Title: string;
  CreatedAt: Date;
  Completed: boolean;
  UserId: number;
  constructor(data: any) {
    let jsonObj = JSON.stringify(data);
    let result = JSON.parse(jsonObj);
    this.Id = result.id;
    this.Title = result.title;

    this.CreatedAt = result.created;
    this.Completed = result.completed;
    this.UserId = result.userId;
  }
}
