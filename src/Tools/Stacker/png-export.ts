import { toPng } from 'html-to-image';

export async function exportDiagramAsPng(element: HTMLElement, filename = 'stacker-stack.png'): Promise<void> {
  await document.fonts?.ready;

  const width = Math.max(element.scrollWidth, element.clientWidth);
  const height = Math.max(element.scrollHeight, element.clientHeight);
  const image = await toPng(element, {
    backgroundColor: '#0d0d17',
    cacheBust: true,
    pixelRatio: 2,
    width,
    height,
    canvasWidth: width * 2,
    canvasHeight: height * 2,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = image;
  link.click();
}
