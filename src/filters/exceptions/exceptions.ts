export class LocationException extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'LocationException';
  }
}

export class CoordinatesException extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'CoordinatesException';
  }
}

export class InternalServerException extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'InternalServerException';
  }
}

export class LocationTypeException extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'LocationTypeException';
  }
}
