/******************************************************************************
 * C64 Emulator -- for the web                                                *
 * (c) 2022 by Andreas Schwenk, License: GPLv3                                *
 * mailto:contact@compiler-construction.com                                   *
 *****************************************************************************/

//import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/scroll/simplescrollbars';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

export let editor: CodeMirror.EditorFromTextArea = null;

const breakpointLines = new Set<number>();

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
                regex: /(?:adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|pla|plp|rol|ror|rti|rts|sbc|sec|sed|sei|sta|stx|sty|tax|tay|tsx|txs|tya|.byte|.screen|.text)\b/,
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
            gutters: ['CodeMirror-linenumbers', 'breakpoints'],
            extraKeys: {
                'Ctrl-S': function () {
                    //saveDocument();
                },
                'Cmd-S': function () {
                    //saveDocument();
                },
            },
            scrollbarStyle: 'simple',
        },
    );
    editor.on('gutterClick', function (cm, lineNo) {
        const info = cm.lineInfo(lineNo);
        if (info.gutterMarkers) breakpointLines.delete(lineNo + 1);
        else breakpointLines.add(lineNo + 1);
        cm.setGutterMarker(
            lineNo,
            'breakpoints',
            info.gutterMarkers ? null : makeMarker(),
        );
    });

    editor.setSize(null, '100%');

    const prog = `; hello world
* = $4000
start
    ldx #$00
next
    lda msg,x
    sta $0400,x
    inx
    cpx #$0D
    bne next
    jmp *
msg
    .screen "HELLO, WORLD!"
`.replace(/ {4}/g, '\t');
    editor.setValue(prog);
}

function makeMarker() {
    const marker = document.createElement('div');
    marker.style.color = '#822';
    marker.innerHTML = '&#9679;';
    return marker;
}
