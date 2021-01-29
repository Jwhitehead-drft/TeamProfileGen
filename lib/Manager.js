// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email)
        getOffice() {
            this.officeNumber = officeNumber;
        };
    }

    getRole() {
        return "Manager";
    };

    getOfficeNumber() {
        return this.officeNumber;
    };
};