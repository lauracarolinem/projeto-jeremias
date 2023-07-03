class IDProc {
    constructor() {
        this.ACC = 0; // Accumulator
        this.BNK = 0; // Backup Register
        this.IPT = 0; // Instruction Pointer
        this.NIL = 0; // Null Register
        this.program = []; // Program memory
        this.labels = {}; // Map of labels and their corresponding indices
    }

    loadProgram(program) {
        this.program = program;
        this.labels = this.extractLabels(program);
    }

    extractLabels(program) {
        const labels = {};
        for (let i = 0; i < program.length; i++) {
            const instruction = program[i];
            if (instruction.endsWith(':')) {
                const label = instruction.slice(0, -1);
                labels[label] = i;
            }
        }
        return labels;
    }

    executeNextInstruction() {
        const instruction = this.program[this.IPT];
        if (!instruction) {
            console.log('Program execution finished.');
            return;
        }

        const [opcode, ...args] = instruction.split(' ');

        switch (opcode) {
            case 'NOP':
                // No operation
                break;

            case 'MOV':
                this.mov(args[0], parseInt(args[1]));
                break;

            case 'SAV':
                this.sav();
                break;

            case 'SWP':
                this.swp();
                break;

            case 'NEG':
                this.neg();
                break;

            case 'ADD':
                this.add(parseInt(args[0]));
                break;

            case 'SUB':
                this.sub(parseInt(args[0]));
                break;

            case 'PNT':
                this.pnt();
                break;

            case 'JMP':
                this.jmp(args[0]);
                return;

            case 'JEQ':
                if (this.ACC === 0) {
                    this.jmp(args[0]);
                    return;
                }
                break;

            case 'JNZ':
                if (this.ACC !== 0) {
                    this.jmp(args[0]);
                    return;
                }
                break;

            case 'JGZ':
                if (this.ACC > 0) {
                    this.jmp(args[0]);
                    return;
                }
                break;

            case 'JLZ':
                if (this.ACC < 0) {
                    this.jmp(args[0]);
                    return;
                }
                break;

            default:
                console.log(`Unknown instruction: ${instruction}`);
        }

        this.IPT++;
        this.executeNextInstruction();
    }

    mov(register, immediate) {
        switch (register) {
            case 'ACC':
                this.ACC = immediate;
                break;

            case 'NIL':
                this.NIL = immediate;
                break;

            default:
                console.log(`Invalid register: ${register}`);
        }
    }

    sav() {
        this.BNK = this.ACC;
    }

    swp() {
        const temp = this.ACC;
        this.ACC = this.BNK;
        this.BNK = temp;
    }

    neg() {
        this.ACC = -this.ACC;
    }

    add(immediate) {
        this.ACC += immediate;
    }

    sub(immediate) {
        this.ACC -= immediate;
    }

    pnt() {
        console.log(this.ACC);
    }

    jmp(label) {
        const targetIndex = this.labels[label];
        if (targetIndex !== undefined) {
            this.IPT = targetIndex;
        } else {
            console.log(`Label not found: ${label}`);
        }
    }
}

// Exemplo de uso
const processor = new IDProc();
const program = [
    'MOV ACC 2',
    'LACO:',
    'JEZ FINAL',
    'PNT',
    'SUB 1',
    'JMP LACO',
    'FINAL:'
];
processor.loadProgram(program);
processor.executeNextInstruction();
