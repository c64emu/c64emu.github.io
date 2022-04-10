import * as editor from './editor';
import { ASM_MOS6502 } from 'c64asm/src/asm';
import * as c64emu from 'c64emu/src';

export function init(): void {
    const monitor = <HTMLCanvasElement>(
        document.getElementById('c64monitor_canvas')
    );
    editor.initCodeMirror();
    c64emu.init(monitor);
    c64emu.render();
}

export function assemble(): boolean {
    const outputDiv = document.getElementById('asm-output');
    const src = editor.getText();
    const assembler = new ASM_MOS6502();
    if (assembler.assemble(src)) {
        const mc = assembler.getMachineCode().toString({
            matchSourceCode: true,
            includeAddress: true,
            maxBytesPerRow: 8,
            includeSourceCode: true,
        });
        outputDiv.innerHTML = mc.replace(/\n/g, '<br/>');
        return true;
    } else {
        outputDiv.innerHTML =
            'assemble failed. Error:' +
            assembler.getErrorString().replace(/\n/g, '<br/>');
        return;
    }
}
