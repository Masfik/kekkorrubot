import { Jimp, loadFont, HorizontalAlign, VerticalAlign, JimpMime } from 'jimp'
import { SANS_64_WHITE } from 'jimp/fonts'

export default async function overlayTextToImage(path: string, text: string) {
    const image = await Jimp.read(path);
    const font = await loadFont(SANS_64_WHITE);

    image.blur(5);
    image.print({
        font,
        x: 0,
        y: 0,
        text: {
            text,
            alignmentX: HorizontalAlign.CENTER,
            alignmentY: VerticalAlign.MIDDLE,
        },
        maxWidth: image.bitmap.width,
        maxHeight: image.bitmap.height,
    });

    return image.getBuffer(JimpMime.png);
}