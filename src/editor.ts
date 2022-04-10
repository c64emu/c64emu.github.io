//import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

export let editor: CodeMirror.EditorFromTextArea = null;

export function getText(): string {
    return editor.getValue();
}

export function initCodeMirror(): void {
    // init code editor
    CodeMirror.defineSimpleMode('mos6502-asm', {
        start: [
            { regex: /%.*/, token: 'comment' },
            { regex: /#.*/, token: 'keyword', sol: true },
            {
                regex: /(?:adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|pla|plp|rol|ror|rti|rts|sbc|sec|sed|sei|sta|stx|sty|tax|tay|tsx|txs|tya|.text)\b/,
                token: 'keyword',
                //sol: true, // only on line start
            },
            {
                regex: /\$[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
                token: 'number',
            },

            { regex: /;.*/, token: 'comment' },
        ],
        comment: [],
        meta: {
            dontIndentStates: ['comment'],
            lineComment: ';',
        },
    });

    editor = CodeMirror.fromTextArea(
        document.getElementById('editor') as HTMLTextAreaElement,
        {
            mode: 'mos6502-asm',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: {
                nonEmpty: true,
            },
            extraKeys: {
                'Ctrl-S': function () {
                    //saveDocument();
                },
                'Cmd-S': function () {
                    //saveDocument();
                },
            },
        },
    );

    editor.setSize(null, '100%');

    const prog = `; hello world
* = $4000
start
    ldx #$00
next
    lda msg,x
    sta $0400,x
    inx
    cpx #$13
    bne next
    jmp *
msg
    .text "HELLO, WORLD!"
`;
    editor.setValue(prog);
}