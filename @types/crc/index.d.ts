// Type definitions for crc 3.4.0
// Project: https://github.com/alexgorbatchev/node-crc
// Definitions by: Yoshihiro Seki <hhttps://github.com/nikochan2k>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export function crc1(buf: string | Buffer): number;
export function crc8(buf: string | Buffer): number;
export function crc8_1wire(buf: string | Buffer): number;
export function crc16(buf: string | Buffer): number;
export function crc16_ccitt(buf: string | Buffer): number;
export function crc16_modbus(buf: string | Buffer): number;
export function crc16_xmodem(buf: string | Buffer): number;
export function crc16_kermit(buf: string | Buffer): number;
export function crc24(buf: string | Buffer): number;
export function crc32(buf: string | Buffer): number;
