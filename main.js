import { readFile } from 'fs';

class IDProc {
    constructor() {
        this.ACC = 0; // Accumulator
        this.BNK = 0; // Backup Register
        this.IPT = 0; // Instruction Pointer
        this.NIL = 0; // Null Register
        this.instrucoes = []; // Program memory
        this.labels = {}; // Map of labels and their corresponding indices
    }

    cleanProgram(instrucoes) {
        const linhas_sem_vazio = [];
        for (let i = 0; i < instrucoes.length; i++) {
            if (instrucoes[i] !== '') {
                linhas_sem_vazio.push(instrucoes[i]);
            }
        }
        if (linhas_sem_vazio.length > 32) {
            console.log('Erro: O programa excede o limite máximo de 32 instruções.');
            return;
        }
        return linhas_sem_vazio;
    }

    loadProgram(content) {
        const contentClean = this.cleanProgram(content);
        this.labels = this.extractLabels(contentClean);
        this.instrucoes = this.parser(contentClean);
        this.instrucoes = this.executeNextInstruction(contentClean);
    }

    parser(content) {
        const linhas_sem_vazio = this.cleanProgram(content);
        // for (let i = 0; i < content.length; i++) {
        //     if (content[i] !== '') {
        //         linhas_sem_vazio.push(content[i]);
        //     }
        // }
        // if (linhas_sem_vazio.length > 32) {
        //     console.log('Erro: O programa excede o limite máximo de 32 instruções.');
        //     return;
        // }
        const instrucoes = [];
        for (let i = 0; i < linhas_sem_vazio.length; i++) {
            const instrucao = content[i].split(' ');
            switch (instrucao[0]) {
                case 'NOP':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução NOP não deve ter argumentos.');
                        return;
                    }
                    break;

                case 'MOV':
                    if (instrucao.length !== 3) {
                        console.log('Erro: A instrução MOV deve ter dois argumentos.');
                        return;
                    }
                    if (instrucao[1] !== 'ACC' && instrucao[1] !== 'NIL') {
                        console.log('Erro: O primeiro argumento da instrução MOV deve ser ACC ou NIL.');
                        return;
                    }
                    const intTeste = parseInt(instrucao[2]);
                    if (intTeste === NaN || intTeste < -127 || intTeste > 128) {
                        console.log('Erro: O segundo argumento da instrução MOV deve ser um número inteiro de 8 bits.');
                        return;
                    }
                    break;

                case 'SAV':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução SAV não deve ter argumentos.');
                        return;
                    }
                    break;

                case 'SWP':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução SWP não deve ter argumentos.');
                        return;
                    }
                    break;

                case 'NEG':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução NEG não deve ter argumentos.');
                        return;
                    }
                    this.neg();
                    break;

                case 'ADD':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução ADD não deve ter argumentos.');
                        return;
                    }
                    intTeste = parseInt(instrucao[2]);
                    if (intTeste === NaN || intTeste < -127 || intTeste > 128) {
                        console.log('Erro: O segundo argumento da instrução MOV deve ser um número inteiro de 8 bits.');
                        return;
                    }
                    break;

                case 'SUB':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução SUB não deve ter mais de um argumento.');
                        return;
                    }
                    const intTeste2 = parseInt(instrucao[2]);
                    if (intTeste2 === NaN || intTeste2 < -127 || intTeste2 > 128) {
                        console.log('Erro: O segundo argumento da instrução SUB deve ser um número inteiro de 8 bits.');
                        return;
                    }
                    break;

                case 'PNT':
                    if (instrucao.length !== 1) {
                        console.log('Erro: A instrução PNT não deve ter argumentos.');
                        return;
                    }
                    break;

                case 'JMP':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução JMP deve ter um argumento.');
                        return;
                    }
                    if (this.labels[instrucao[1]] === undefined) {
                        console.log('Erro: Label não encontrada para a instrução JMP.');
                        return;
                    }
                    break;

                case 'JEQ':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução JEQ deve ter um argumento.');
                        return;
                    }
                    if (this.labels[instrucao[1]] === undefined) {
                        console.log('Erro: Label não encontrada para a instrução JEQ.');
                        return;
                    }
                    break;

                case 'JNZ':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução JMP deve ter um argumento.');
                        return;
                    }
                    if (this.labels[instrucao[1]] === undefined) {
                        console.log('Erro: Label não encontrada para a instrução JMP.');
                        return;
                    }
                    break;

                case 'JGZ':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução JMP deve ter um argumento.');
                        return;
                    }
                    if (this.labels[instrucao[1]] === undefined) {
                        console.log('Erro: Label não encontrada para a instrução JMP.');
                        return;
                    }
                    break;

                case 'JLZ':
                    if (instrucao.length !== 2) {
                        console.log('Erro: A instrução JMP deve ter um argumento.');
                        return;
                    }
                    if (this.labels[instrucao[1]] === undefined) {
                        console.log('Erro: Label não encontrada para a instrução JMP.');
                        return;
                    }
                    break;
                default:

                    break;
            }
            instrucoes.push(instrucao);
        }
        return instrucoes;
    }

    extractLabels(instrucoes) {
        const labels = {};
        const tamanho = instrucoes.length;
        for (let i = 0; i < tamanho; i++) {
            const instruction = instrucoes[i];
            if (instruction.endsWith(':')) {
                const label = instruction.slice(0, -1);
                //console.log(label);
                labels[label] = i;
            }
        }
        return labels;
    }

    executeNextInstruction(content) {
        content = this.instrucoes[this.IPT];
        if (!content) {
            console.log('Program execution finished.');
            return;
        }

        const [opcode, ...args] = content.split(' ');

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
                // Verificar se a instrução é uma label
                if (instruction.endsWith(':')) {
                    // Tratamento para labels
                    const label = instruction.slice(0, -1);
                    this.labels[label] = this.IPT;
                } else {
                    console.log(`Unknown instruction: ${instruction}`);
                }
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
// Função para executar o programa após a leitura do arquivo
function runProgram(program) {
    const processor = new IDProc();
    processor.loadProgram(program);
    processor.executeNextInstruction();
}

// Ler o arquivo de texto
readFile('./programas-testes-dist/prog-correto-03.idp', 'utf-8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    // Separar as linhas do arquivo
    const linhas = data.trim().split('\n');
    //console.log(program);

    // Executar o programa após a leitura do arquivo
    runProgram(linhas);
});

// // Exemplo de uso
// const processor = new IDProc();

// // Ler o arquivo de texto
// readFile('./programas-testes-dist/prog-correto-04.idp', 'utf-8', (err, data) => {
//   if (err) {
//     console.error('Erro ao ler o arquivo:', err);
//     return;
//   }

//   // Separar as linhas do arquivo
//   const program = data.trim().split('\n');

//   // Carregar o programa no IDProc
//   processor.loadProgram(program);

//   // Executar a primeira instrução
//   processor.executeNextInstruction();
// });

