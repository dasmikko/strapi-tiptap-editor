import { Extension } from '@tiptap/core';
export interface TextAlignOptions {
    types: string[];
    alignments: string[];
    defaultAlignment: string;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textAlign: {
            /**
             * Set the text align attribute
             */
            setTextAlign: (alignment: string) => ReturnType;
            /**
             * Unset the text align attribute
             */
            unsetTextAlign: () => ReturnType;
        };
    }
}
export declare const TextAlign: Extension<TextAlignOptions, any>;
