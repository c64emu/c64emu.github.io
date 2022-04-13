/******************************************************************************
 * C64 Emulator -- for the web                                                *
 * (c) 2022 by Andreas Schwenk, License: GPLv3                                *
 * mailto:contact@compiler-construction.com                                   *
 *****************************************************************************/

export class SpriteEditor {
    // monochrome (high-res) sprites consist of 24 columns (3 bytes) and 21 rows
    private spriteData = new Uint8Array(21 * 3);
    private canvas: HTMLCanvasElement = null;

    constructor() {
        this.canvas = <HTMLCanvasElement>(
            document.getElementById('sprite-editor-canvas')
        );
        const this_ = this;
        this.canvas.onclick = function (ev: MouseEvent) {
            const rect = this_.canvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            this_.setMonochromeBit(x >> 3, y >> 3);
            this_.renderSprite();
        };
        // test data
        this.setSpriteData(
            new Uint8Array([
                0x00, 0x00, 0x00, 0x00, 0x3f, 0x80, 0x01, 0xc0, 0xe0, 0x03,
                0x00, 0x30, 0x06, 0x00, 0x10, 0x0c, 0x42, 0x10, 0x08, 0x42,
                0x10, 0x08, 0x42, 0x10, 0x10, 0x00, 0x10, 0x10, 0x00, 0x10,
                0x10, 0x00, 0x10, 0x11, 0x00, 0x90, 0x10, 0xc3, 0x90, 0x10,
                0x3e, 0x30, 0x10, 0x00, 0x20, 0x0c, 0x00, 0xe0, 0x07, 0xff,
                0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00,
            ]),
        );
    }

    getSpriteData(): Uint8Array {
        return this.spriteData;
    }

    setSpriteData(data: Uint8Array) {
        this.spriteData = data;
    }

    getSpriteAssemblyCode(): string {
        let s = '';
        for (let i = 0; i < 21 * 3; i++) {
            if (i % 8 == 0) s += '\n    .byte ';
            else s += ',';
            s += '$' + this.spriteData[i].toString(16).padStart(2, '0');
        }
        s += ',$00';
        return '    ' + s.trim() + '\n';
    }

    setMonochromeBit(x: number, y: number) {
        this.spriteData[y * 3 + (x >> 3)] |= 0x01 << (7 - (x % 8));
    }

    getMonochromeBit(x: number, y: number): number {
        return (this.spriteData[y * 3 + (x >> 3)] >> (7 - (x % 8))) & 0x01;
    }

    renderSprite(): void {
        const buffer = new Uint8ClampedArray(21 * 8 * (24 * 8) * 4);
        for (let y = 0; y < 21; y++) {
            for (let x = 0; x < 24; x++) {
                const color = this.getMonochromeBit(x, y) == 1 ? 0x00 : 0xff;
                for (let v = 0; v < 8; v++) {
                    for (let u = 0; u < 8; u++) {
                        const idx = ((y * 8 + v) * (24 * 8) + (x * 8 + u)) * 4;
                        buffer[idx + 0] = color;
                        buffer[idx + 1] = color;
                        buffer[idx + 2] = color;
                        buffer[idx + 3] = 0xff;
                    }
                }
            }
        }
        const imageData = new ImageData(buffer, 24 * 8);
        const ctx = this.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(imageData, 0, 0);
        // data
        const asmElement = document.getElementById('sprite-editor-asm');
        asmElement.innerHTML = this.getSpriteAssemblyCode();
    }
}
