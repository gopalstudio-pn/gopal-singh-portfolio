export type Cat = 'elegant' | 'bold' | 'cute' | 'gaming' | 'symbols';
export type FancyStyle = { id: string; label: string; cat: Cat; fn: (s: string) => string };

const cp = (n: number) => String.fromCodePoint(n);
const chars = (s: string) => Array.from(s);
const rng = (s: number) => Array.from({ length: 26 }, (_, i) => cp(s + i)).join('');

const offset =
  (up: number, low: number, dig?: number, ex: Record<string, string> = {}) =>
  (s: string) =>
    chars(s)
      .map((ch) => {
        if (ex[ch]) return ex[ch];
        const c = ch.codePointAt(0) as number;
        if (c >= 65 && c <= 90) return cp(up + c - 65);
        if (c >= 97 && c <= 122) return cp(low + c - 97);
        if (dig !== undefined && c >= 48 && c <= 57) return cp(dig + c - 48);
        return ch;
      })
      .join('');

const list = (up: string, low: string, dig?: string) => {
  const U = chars(up);
  const L = chars(low);
  const D = dig ? chars(dig) : [];
  return (s: string) =>
    chars(s)
      .map((ch) => {
        const c = ch.codePointAt(0) as number;
        if (c >= 65 && c <= 90) return U[c - 65] || ch;
        if (c >= 97 && c <= 122) return L[c - 97] || ch;
        if (D.length && c >= 48 && c <= 57) return D[c - 48] || ch;
        return ch;
      })
      .join('');
};

const mark = (m: string) => (s: string) => chars(s).map((ch) => (ch.trim() ? ch + m : ch)).join('');
const wrap = (l: string, r: string, f: (s: string) => string = (x) => x) => (s: string) => l + f(s) + r;
const upper = (f: (s: string) => string) => (s: string) => f(s.toUpperCase());
const spaced = (sep: string) => (s: string) => s.trim().split(/\s+/).map((w) => chars(w).join(sep)).join('   ');

const bold = offset(0x1d400, 0x1d41a, 0x1d7ce);
const italic = offset(0x1d434, 0x1d44e, undefined, { h: 'ℎ' });
const boldItalic = offset(0x1d468, 0x1d482);
const script = offset(0x1d49c, 0x1d4b6, undefined, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' });
const boldScript = offset(0x1d4d0, 0x1d4ea);
const fraktur = offset(0x1d504, 0x1d51e, undefined, { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' });
const boldFraktur = offset(0x1d56c, 0x1d586);
const double = offset(0x1d538, 0x1d552, 0x1d7d8, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' });
const sans = offset(0x1d5a0, 0x1d5ba, 0x1d7e2);
const sansBold = offset(0x1d5d4, 0x1d5ee, 0x1d7ec);
const sansItalic = offset(0x1d608, 0x1d622);
const sansBoldItalic = offset(0x1d63c, 0x1d656);
const mono = offset(0x1d670, 0x1d68a, 0x1d7f6);
const fullwidth = offset(0xff21, 0xff41, 0xff10);
const circled = list(rng(0x24b6), rng(0x24d0), '⓪①②③④⑤⑥⑦⑧⑨');
const neg = list(rng(0x1f150), rng(0x1f150));
const squared = list(rng(0x1f130), rng(0x1f130));
const paren = list(rng(0x249c), rng(0x249c));
const smallCaps = list('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ', 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ');
const sup = list('ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ', 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ', '⁰¹²³⁴⁵⁶⁷⁸⁹');
const flipMap = list('∀ᗺƆᗡƎℲ⅁HIſʞ˥WNOԀΌᴚS⊥∩ΛMX⅄Z', 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz');
const flip = (s: string) => chars(flipMap(s)).reverse().join('');

const S = (id: string, label: string, cat: Cat, fn: (s: string) => string): FancyStyle => ({ id, label, cat, fn });

export const STYLES: FancyStyle[] = [
  S('script', 'Script', 'elegant', script),
  S('bscript', 'Bold Script', 'elegant', boldScript),
  S('fraktur', 'Fraktur', 'elegant', fraktur),
  S('bfraktur', 'Bold Fraktur', 'elegant', boldFraktur),
  S('italic', 'Italic', 'elegant', italic),
  S('bitalic', 'Bold Italic', 'elegant', boldItalic),
  S('smallcaps', 'Small Caps', 'elegant', smallCaps),
  S('double', 'Double Struck', 'elegant', double),
  S('royal', 'Royal', 'elegant', wrap('♛ ', ' ♛', boldScript)),
  S('noble', 'Noble', 'elegant', wrap('༺ ', ' ༻', fraktur)),
  S('bold', 'Bold', 'bold', bold),
  S('sansbold', 'Sans Bold', 'bold', sansBold),
  S('sansbi', 'Sans Bold Italic', 'bold', sansBoldItalic),
  S('sans', 'Sans', 'bold', sans),
  S('sansi', 'Sans Italic', 'bold', sansItalic),
  S('mono', 'Monospace', 'bold', mono),
  S('full', 'Fullwidth', 'bold', fullwidth),
  S('boldcaps', 'Bold Caps', 'bold', upper(bold)),
  S('sanscaps', 'Sans Caps', 'bold', upper(sansBold)),
  S('squared', 'Squared', 'bold', squared),
  S('neg', 'Negative Circle', 'bold', neg),
  S('tiny', 'Tiny', 'cute', sup),
  S('tinycaps', 'Tiny Caps', 'cute', upper(sup)),
  S('bubble', 'Bubble', 'cute', circled),
  S('paren', 'Parentheses', 'cute', paren),
  S('heart', 'Heart', 'cute', wrap('♡ ', ' ♡', smallCaps)),
  S('flower', 'Flower', 'cute', wrap('✿ ', ' ✿', script)),
  S('moon', 'Moon', 'cute', wrap('☾ ', ' ☽', italic)),
  S('wings', 'Wings', 'cute', wrap('ʚ ', ' ɞ', italic)),
  S('sparkle', 'Sparkle', 'cute', wrap('⋆｡°✩ ', ' ✩°｡⋆', italic)),
  S('star', 'Star', 'cute', wrap('★彡 ', ' 彡★', boldItalic)),
  S('kanji', 'Kanji', 'gaming', wrap('亗 ', ' 亗', upper(sansBold))),
  S('tsu', 'Tsu', 'gaming', (s) => sup(s) + ' ツ'),
  S('cross', 'Cross', 'gaming', wrap('✘ ', ' ✘', upper(sansBold))),
  S('boxed', 'Boxed', 'gaming', (s) => '【 ' + spaced(' ')(s.toUpperCase()) + ' 】'),
  S('void', 'Void', 'gaming', wrap('꧁༒ ', ' ༒꧂', bold)),
  S('legend', 'Legend', 'gaming', wrap('『', '』', boldItalic)),
  S('elite', 'Elite', 'gaming', wrap('▓▒░ ', ' ░▒▓', upper(sansBold))),
  S('ghost', 'Ghost', 'gaming', (s) => smallCaps(s) + ' ☠'),
  S('strike', 'Strikethrough', 'symbols', mark('\u0336')),
  S('under', 'Underline', 'symbols', mark('\u0332')),
  S('dunder', 'Double Underline', 'symbols', mark('\u0333')),
  S('slash', 'Slash', 'symbols', mark('\u0338')),
  S('over', 'Overline', 'symbols', mark('\u0305')),
  S('xabove', 'Cross Above', 'symbols', mark('\u033d')),
  S('arrow', 'Arrow Below', 'symbols', mark('\u034e')),
  S('dot', 'Dot Below', 'symbols', mark('\u0323')),
  S('tilde', 'Tilde Below', 'symbols', mark('\u0330')),
  S('flip', 'Upside Down', 'symbols', flip),
  S('spaced', 'Spaced', 'symbols', spaced(' ')),
  S('dotted', 'Dotted', 'symbols', spaced('·')),
  S('dashed', 'Dashed', 'symbols', spaced('-')),
  S('bullets', 'Bullets', 'symbols', spaced('•')),
  S('b1', 'Brackets', 'symbols', wrap('『', '』')),
  S('b2', 'Lenticular', 'symbols', wrap('【', '】')),
  S('b3', 'Corner', 'symbols', wrap('「', '」')),
  S('b4', 'Double Corner', 'symbols', wrap('〘', '〙')),
  S('b5', 'White Square', 'symbols', wrap('⟦', '⟧')),
  S('quote', 'Quote', 'symbols', wrap('❝ ', ' ❞')),
  S('spark2', 'Diamond', 'symbols', wrap('✦ ', ' ✦')),
];

export const CATS: [string, string][] = [
  ['all', 'ALL'],
  ['elegant', 'ELEGANT'],
  ['bold', 'BOLD'],
  ['cute', 'CUTE'],
  ['gaming', 'GAMING'],
  ['symbols', 'SYMBOLS'],
];
