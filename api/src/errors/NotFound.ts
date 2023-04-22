class NotFound {
  public readonly name: string;

  public readonly message: string;

  constructor(message: string) {
    this.name = 'NotFound';

    this.message = message;
  }
}

export default NotFound;
