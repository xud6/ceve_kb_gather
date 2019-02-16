/**
 * template error
 */
export class template_error extends Error {
    /**
     * 
     * @param message error message
     */
    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = 'template error';
    }
}

/**
 * print hello message
 * @param compiler people to welcome
 */
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");