import * as editor from './editor';
import * as c64asm from 'c64asm/src';
import * as c64emu from 'c64emu/src';

let assembleResult: c64asm.AssembleResult = null;
let monitor: HTMLCanvasElement = null;

export function init(): void {
    monitor = <HTMLCanvasElement>document.getElementById('c64monitor_canvas');
    editor.initCodeMirror();
    c64emu.init(monitor);
    c64emu.render();
}

export function reset(): void {
    c64emu.init(monitor);
    c64emu.render();
}

export function assemble(): boolean {
    const outputDiv = document.getElementById('asm-output');
    const errorDiv = document.getElementById('asm-errors');
    const src = editor.getText();
    assembleResult = c64asm.assemble6502(src);
    if (assembleResult.error) {
        errorDiv.innerHTML =
            'Error:' + assembleResult.errorString.replace(/\n/g, '<br/>');
        return false;
    } else {
        errorDiv.innerHTML = 'ok';
        outputDiv.innerHTML = assembleResult.stringifiedCode.replace(
            /\n/g,
            '<br/>',
        );
        return true;
    }
}

export function load(): boolean {
    if (assembleResult == null || assembleResult.error) {
        // TODO
        alert('!!!!!');
        return false;
    }
    c64emu.setMemory(
        assembleResult.machineCodeAddress,
        assembleResult.machineCode,
    );
    c64emu.startDebugging(assembleResult.machineCodeAddress);
    updateRegisters();
    return true;
}

export function step(): void {
    if (assembleResult == null) return;
    c64emu.step();
    updateRegisters();
    c64emu.render();
}

function updateRegisters(): void {
    const registers = c64emu.getRegisters();
    const registersString =
        'pc=' +
        registers['pc'].toString(16).toUpperCase() +
        ' (' +
        registers['pc'] +
        ')' +
        ', a=' +
        registers['a'].toString(16).toUpperCase() +
        ' (' +
        registers['a'] +
        ')' +
        ', x=' +
        registers['x'].toString(16).toUpperCase() +
        ' (' +
        registers['x'] +
        ')' +
        ', y=' +
        registers['y'].toString(16).toUpperCase() +
        ' (' +
        registers['y'] +
        ')';
    document.getElementById('registers').innerHTML = registersString;
}
