export class User {
    constructor(
        public email: string,
        public phone: string,
        public name?: string,
        public uid?: string,
        public type?: string,
        public status?: string
    ){}
}
