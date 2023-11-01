export class UseNonCustomerLogin extends Error {
    constructor(message = "For non-customer login, please use the Non-Customer tab.") {
        super(message);
        this.name = "UseNonCustomerLogin";
    }
}

export class UseCustomerLogin extends Error {
    constructor(message = "For customer login, please use the Customer tab.") {
        super(message);
        this.name = "UseCustomerLogin";
    }
}