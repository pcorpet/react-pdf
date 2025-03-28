import { describe, expect, test } from 'vitest';

import font from '../internal/font';
import pluck from '../internal/pluck';
import append from '../../src/run/append';
import { Glyph } from '../../src/types';

describe('run append glyph operator', () => {
  test('should return same run if no glyph provided', () => {
    const run = {
      start: 0,
      end: 5,
      attributes: {},
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
    };

    const result = append(null, run);

    expect(result).toHaveProperty('start', 0);
    expect(result).toHaveProperty('end', 5);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 114, 101, 109]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9]);
  });

  test('should append glyph at run', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
      attributes: { font: [font], fontSize: 2 },
    };

    const glyph = { id: 105, codePoints: [105], advanceWidth: 10 } as Glyph; // i
    const result = append(glyph, run);

    expect(result).toHaveProperty('start', 0);
    expect(result).toHaveProperty('end', 6);
    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 3, 4, 5]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 114, 101, 109, 105]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9, 10]);
  });

  test('should append ligature glyph at run', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
      attributes: { font: [font], fontSize: 2 },
    };

    const glyph = {
      id: 64257,
      codePoints: [102, 105],
      advanceWidth: 10,
    } as Glyph; // fi
    const result = append(glyph, run); // loremfi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 3, 4, 5, 5]);
    expect(pluck('id', result.glyphs!)).toEqual([
      76, 111, 114, 101, 109, 64257,
    ]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9, 10]);
  });

  test('should append glyph at run with ligature', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 64257, advanceWidth: 0, codePoints: [102, 105] }, // fi
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 2, 3],
      attributes: { font: [font], fontSize: 2 },
    };

    const glyph = { id: 105, codePoints: [105], advanceWidth: 10 } as Glyph; // i
    const result = append(glyph, run); // lofimi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 2, 3, 4]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 64257, 109, 105]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 10]);
  });

  test('should append ligature glyph before run ligature', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 64257, advanceWidth: 0, codePoints: [102, 105] }, // fi
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 2, 3],
      attributes: { font: [font], fontSize: 2 },
    };

    const glyph = {
      id: 64259,
      codePoints: [102, 102, 105],
      advanceWidth: 10,
    } as Glyph; // ffi
    const result = append(glyph, run); //  lofimffi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 2, 3, 4, 4, 4]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 64257, 109, 64259]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 10]);
  });
});

describe('run append code point operator', () => {
  test('should return same run if no code point provided', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
      attributes: { font: [font], fontSize: 2 },
    };

    const result = append(null, run);

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 3, 4]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 114, 101, 109]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9]);
  });

  test('should append code point at run', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
      attributes: { font: [font], fontSize: 2 },
    };

    const result = append(105, run);

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 3, 4, 5]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 114, 101, 109, 105]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9, 8]);
  });

  test('should append ligature code point at run', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 114, advanceWidth: 0, codePoints: [114] }, // r
        { id: 101, advanceWidth: 0, codePoints: [101] }, // e
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 9, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 3, 4],
      attributes: { font: [font], fontSize: 2 },
    };

    const result = append(64257, run); // loremfi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 3, 4, 5, 5]);
    expect(pluck('id', result.glyphs!)).toEqual([
      76, 111, 114, 101, 109, 64257,
    ]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 9, 10]);
  });

  test('should append code point at run with ligature', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 64257, advanceWidth: 0, codePoints: [102, 105] }, // fi
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 2, 3],
      attributes: { font: [font], fontSize: 2 },
    };

    const result = append(105, run); // lofimi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 2, 3, 4]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 64257, 109, 105]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 8]);
  });

  test('should append ligature code point before run ligature', () => {
    const run = {
      start: 0,
      end: 5,
      glyphs: [
        { id: 76, advanceWidth: 0, codePoints: [76] }, // l
        { id: 111, advanceWidth: 0, codePoints: [111] }, // o
        { id: 64257, advanceWidth: 0, codePoints: [102, 105] }, // fi
        { id: 109, advanceWidth: 0, codePoints: [109] }, // m
      ] as Glyph[],
      positions: [
        { xAdvance: 5, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 6, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 7, yAdvance: 0, xOffset: 0, yOffset: 0 },
        { xAdvance: 8, yAdvance: 0, xOffset: 0, yOffset: 0 },
      ],
      glyphIndices: [0, 1, 2, 2, 3],
      attributes: { font: [font], fontSize: 2 },
    };

    const result = append(64259, run); //  lofimffi

    expect(result).toHaveProperty('glyphIndices', [0, 1, 2, 2, 3, 4, 4, 4]);
    expect(pluck('id', result.glyphs!)).toEqual([76, 111, 64257, 109, 64259]);
    expect(pluck('xAdvance', result.positions!)).toEqual([5, 6, 7, 8, 10]);
  });
});
